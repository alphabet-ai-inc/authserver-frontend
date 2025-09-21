import { useState } from "react";
import { Input } from "./form/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/Edit.css";

const Login = () => {
    const {
        setJwtToken,
        setIsLoggedInExplicitly,
        toggleRefresh,
        // logOut,
    } = useAuth();

    const [alertClassName, setAlertClassName] = useState("d-none");
    const [alertMessage, setAlertMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false); // Added loading state

    const navigate = useNavigate();
    const handleSubmit = (event) => {
        setIsLoggedInExplicitly(true);
        event.preventDefault();
        // built the request payload
        let payload = {
            email: email,
            password: password,
        };

        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(payload),
        };

        setLoading(true); // Set loading to true when the request starts

        fetch(`${process.env.REACT_APP_BACKEND_URL}/authenticate`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setAlertClassName("alert-danger");
                    setAlertMessage(data.message);
                } else {
                    setIsLoggedInExplicitly(true);
                    toggleRefresh(true);
                    setJwtToken(data.access_token);
                    navigate("/apps");
                }
            })
            .catch(error => {
                setAlertClassName("alert-danger");
                setAlertMessage("Login failure: " + error.message);
            })
            .finally(() => {
                setLoading(false); // Set loading back to false when the request finishes, whether it's successful or not
            });
        }
    
    return (
        <div className="edit-container">
            <h2>Login</h2>
            <hr />
            <div className={`alert ${alertClassName}`} role="alert">  {/* USING alertClassName */}
                {alertMessage}
            </div>

            <form className="edit-app-form" onSubmit={handleSubmit} data-testid="LoginForm">
                <Input
                    title="Email Address"
                    data-testid="email-address"
                    type="email"
                    className="form-control"
                    name="email"
                    autoComplete="email-new"
                    onChange={(event) => setEmail(event.target.value)}
                />

                <Input
                    title="Password"
                    data-testid="password"
                    type="password"
                    className="form-control"
                    name="password"
                    autoComplete="password-new"
                    onChange={(event) => setPassword(event.target.value)}
                />
                <hr />

                <Input
                    type="submit"
                    className="btn btn-primary"
                    value={loading ? "Logging in..." : "Login"} // Change the button text based on the loading state
                    disabled={loading} // Disable the button while loading
                />
            </form>
        </div>
    );
};
export { Login }