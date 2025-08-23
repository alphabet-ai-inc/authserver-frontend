import { useState } from "react";
import Input from "./form/Input";
import { useNavigate, useOutletContext } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {
        setJwtToken,
        setAlertClassName,
        setAlertMessage,
        toggleRefresh,
        setIsLoggedInExplicitly,
    } = useOutletContext();

    const navigate = useNavigate();

    const handleSubmit = (event) => {
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

        // send the request to the backend
        fetch(`${process.env.REACT_APP_BACKEND_URL}/authenticate`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setAlertClassName("alert-danger");
                    setAlertMessage(data.message);
                } else {
                    setJwtToken(data.access_token);
                    setAlertClassName("d-none");
                    setAlertMessage("");
                    setIsLoggedInExplicitly(true);
                    toggleRefresh(true);
                    navigate("/");
                }
            })
            .catch(error => {
                setAlertClassName("alert-danger");
                setAlertMessage("Login failure: " + error.message);
            });

    }

    return (
        <div className="col-md-6 offset-md3">
            <h2>Login</h2>
            <hr />

            <form onSubmit={handleSubmit}>
                <Input
                    title="Email Address"
                    type="email"
                    className="form-control"
                    name="email"
                    autoComplete="email-new"
                    onChange={(event) => setEmail(event.target.value)}
                />

                <Input
                    title="Password"
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
                    value="Login"
                />
            </form>
        </div>
    )
}
export default Login;