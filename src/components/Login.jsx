import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Login component for user authentication.
 * @returns {JSX.Element} The rendered login form component.
 * User validation is handled by the backend.
 * On successful login, the JWT token is stored in context and user is redirected.
 * On failure, an error message is displayed.
 * Enhanced with session expiry detection and improved error handling.
 */
const Login = () => {
    const {
        setJwtToken,
        setIsLoggedInExplicitly,
        toggleRefresh,
        setJustLoggedIn,
        login, // From the enhanced AuthContext
        user, // For potential auto-redirect if already logged in
        loading: authLoading // From enhanced context
    } = useAuth();

    const [alertClassName, setAlertClassName] = useState("d-none");
    const [alertMessage, setAlertMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Handle session expiry messages and auto-redirect if already authenticated
    useEffect(() => {
        // Check for session expiry message in URL
        const urlParams = new URLSearchParams(location.search);
        if (urlParams.get('session') === 'expired') {
            setAlertClassName("alert-warning");
            setAlertMessage("Your session has expired. Please login again.");
        }

        // If user is already logged in, redirect to intended page
        if (user) {
            const from = location.state?.from?.pathname || "/apps";
            navigate(from, { replace: true });
        }
    }, [user, location, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Reset alerts
        setAlertClassName("d-none");
        setAlertMessage("");

        // Build the request payload
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

        setLoading(true);

        try {
            // Option 1: Use your existing fetch approach
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/authenticate`, requestOptions);
            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.message || 'Authentication failed');
            }

            // Success - update auth state using both old and new methods
            setJustLoggedIn(true);
            setIsLoggedInExplicitly(true);
            toggleRefresh(true);
            setJwtToken(data.access_token);

            // If using the enhanced login function, call it as well
            if (login && typeof login === 'function') {
                await login(email, password);
            }

            // Set justLoggedIn to true and redirect
            setJustLoggedIn(true);

            // Redirect to intended page or default
            const from = location.state?.from?.pathname || "/apps";
            navigate(from, { replace: true });

        } catch (error) {
            console.error('Login error:', error);
            setAlertClassName("alert-danger");
            setAlertMessage(error.message || "Login failure: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Alternative handleSubmit using the enhanced login function
    const handleSubmitEnhanced = async (event) => {
        event.preventDefault();

        setAlertClassName("d-none");
        setAlertMessage("");
        setLoading(true);

        try {
            // Use the enhanced login function if available
            if (login && typeof login === 'function') {
                await login(email, password);

                // If login succeeds, update your existing auth state
                setJustLoggedIn(true);
                setIsLoggedInExplicitly(true);
                toggleRefresh(true);

                // Redirect to intended page
                const from = location.state?.from?.pathname || "/apps";
                navigate(from, { replace: true });
            } else {
                // Fallback to original fetch approach
                await handleSubmit(event);
            }
        } catch (error) {
            setAlertClassName("alert-danger");
            setAlertMessage(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    // Choose which submit handler to use based on whether enhanced login is available
    const submitHandler = login && typeof login === 'function' ? handleSubmitEnhanced : handleSubmit;

return (
    <>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"></link>

        <div className="min-vh-100 bg-light d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        {/* Login Card */}
                        <div className="card shadow-lg border-0 rounded-3">
                            {/* Card Header */}
                            <div className="card-header bg-primary text-white text-center py-4 rounded-top-3">
                                <div className="d-flex justify-content-center align-items-center mb-3">
                                    <div className="bg-white bg-opacity-20 rounded-circle p-3 me-3">
                                        <i className="bi bi-person-check display-6"></i>
                                    </div>
                                </div>
                                <h2 className="h3 mb-1">Welcome Back</h2>
                                <p className="mb-0 opacity-75">Sign in to your account</p>
                            </div>

                            {/* Card Body */}
                            <div className="card-body p-4 p-md-5">
                                {/* Session expiry or error alert */}
                                {alertMessage && (
                                    <div className={`alert ${alertClassName} d-flex align-items-center`} role="alert">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        {alertMessage}
                                    </div>
                                )}

                                {/* Loading indicator for auth context */}
                                {authLoading && (
                                    <div className="alert alert-info d-flex align-items-center" role="alert">
                                        <i className="bi bi-arrow-repeat me-2"></i>
                                        Checking authentication status...
                                    </div>
                                )}

                                <form onSubmit={submitHandler} data-testid="LoginForm" className="mt-3">
                                    {/* Email Input */}
                                    <div className="mb-4">
                                        <label htmlFor="email" className="form-label fw-semibold text-dark">
                                            <i className="bi bi-envelope me-2 text-primary"></i>
                                            Email Address
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-at text-muted"></i>
                                            </span>
                                            <input
                                                id="email"
                                                data-testid="email-address"
                                                type="email"
                                                className="form-control border-start-0"
                                                name="email"
                                                autoComplete="email"
                                                onChange={(event) => setEmail(event.target.value)}
                                                value={email}
                                                placeholder="Enter your email address"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password Input */}
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label fw-semibold text-dark">
                                            <i className="bi bi-key me-2 text-primary"></i>
                                            Password
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-lock text-muted"></i>
                                            </span>
                                            <input
                                                id="password"
                                                data-testid="password"
                                                type="password"
                                                className="form-control border-start-0"
                                                name="password"
                                                autoComplete="current-password"
                                                onChange={(event) => setPassword(event.target.value)}
                                                value={password}
                                                placeholder="Enter your password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="rememberMe"
                                            />
                                            <label className="form-check-label text-muted" htmlFor="rememberMe">
                                                Remember me
                                            </label>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-link text-decoration-none p-0 text-primary"
                                            onClick={() => navigate('/forgot-password')}
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>

                                    {/* Login Button */}
                                    <div className="d-grid gap-2">
                                        <button
                                            className="btn btn-primary btn-lg py-2 fw-semibold"
                                            type="submit"
                                            disabled={loading || authLoading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Signing in...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                                    Sign In
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Divider */}
                                <div className="text-center my-4">
                                    <span className="bg-light px-3 text-muted">or</span>
                                </div>

                                {/* Alternative Actions */}
                                <div className="text-center">
                                    <p className="text-muted mb-3">Don't have an account?</p>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={() => navigate('/register')}
                                    >
                                        <i className="bi bi-person-plus me-2"></i>
                                        Create Account
                                    </button>
                                </div>

                                {/* Debug info - remove in production */}
                                {process.env.NODE_ENV === 'development' && (
                                    <div className="mt-4 p-3 border rounded bg-light">
                                        <small className="text-muted d-block">
                                            <i className="bi bi-bug me-1"></i>
                                            Debug: Using {login && typeof login === 'function' ? 'enhanced' : 'legacy'} login method
                                        </small>
                                        <small className="text-muted">
                                            Email: {email} | Auth Loading: {authLoading.toString()}
                                        </small>
                                    </div>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className="card-footer text-center py-3 bg-light rounded-bottom-3">
                                <small className="text-muted">
                                    <i className="bi bi-shield-check me-1"></i>
                                    Your credentials are securely encrypted
                                </small>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="text-center mt-4">
                            <p className="text-muted small">
                                <i className="bi bi-info-circle me-1"></i>
                                Need help? Contact our <button type="button" className="btn btn-link text-decoration-none p-0 text-primary">support team</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <style>{`
            .min-vh-100 {
                min-height: 100vh;
            }

            .card {
                transition: transform 0.2s ease-in-out;
            }

            .card:hover {
                transform: translateY(-2px);
            }

            .input-group-text {
                transition: all 0.2s ease;
            }

            .form-control:focus + .input-group-text,
            .form-control:focus ~ .input-group-text {
                border-color: #0d6efd;
                background-color: #e7f1ff;
            }

            .btn:disabled {
                opacity: 0.6;
            }

            .rounded-top-3 {
                border-top-left-radius: 1rem !important;
                border-top-right-radius: 1rem !important;
            }

            .rounded-bottom-3 {
                border-bottom-left-radius: 1rem !important;
                border-bottom-right-radius: 1rem !important;
            }

            .bg-light {
                background-color: #f8f9fa !important;
            }
        `}</style>
    </>
);
}
export { Login };