import { useState } from "react";
import { Input } from "./form/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
/**
 * Login component for user authentication.
 * @returns {JSX.Element}   The rendered login form component.
 * User validation is handled by the backend.
 * On successful login, the JWT token is stored in context and user is redirected to /apps.
 * On failure, an error message is displayed.
 * For now, the login form is basic and uses only email and password fields.
 * Future improvements could include "Remember Me" functionality, password reset, and OAuth integration.
 */
const Login = () => {
    const {
        setJwtToken,
        setIsLoggedInExplicitly,
        toggleRefresh,
        setJustLoggedIn,  // Add this from context

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
                    setJustLoggedIn(true);
                    setIsLoggedInExplicitly(true);
                    toggleRefresh(true);
                    setJwtToken(data.access_token);
                    navigate("/apps");
                    setJustLoggedIn(false);
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
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"></link>

            <div className="container py-4">
                <h2 style={{ textAlign: "center" }}>Login</h2>
                <hr />
                <div className={`alert ${alertClassName}`} role="alert">  {/* USING alertClassName */}
                    {alertMessage}
                </div>

                <form onSubmit={handleSubmit} data-testid="LoginForm">
                    <Input
                        label={"Email Address"}
                        data-testid={"email-address"}
                        type={"email"}
                        className={"form-control"}
                        name={"email"}
                        autoComplete={"email-new"}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <Input
                        label={"Password"}
                        data-testid={"password"}
                        type={"password"}
                        className={"form-control"}
                        name={"password"}
                        autoComplete={"password-new"}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <hr />
                    <div className="d-flex gap-2">
                        <button className="btn btn-success" type="submit" disabled={loading}>
                            <i className="bi bi-login"></i> {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
export { Login }