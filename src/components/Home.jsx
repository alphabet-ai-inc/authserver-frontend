import Security from '../images/switch1.jpeg'
import { useAuthSession } from '../hooks/useAuthSession';
import { useNavigate } from 'react-router-dom';

function LoginPrompt({ handleLogin }) {
    return (
        <div className='login-container'>
            <img src={Security} alt="security" onClick={handleLogin} style={{ cursor: 'pointer', display: 'block', margin: '0 auto' }} />
            <button onClick={handleLogin} style={{ display: 'block', margin: '20px auto' }} className="btn btn-primary">
                <i className="bi bi-box-arrow-in-right me-1"></i>Login
            </button>
        </div>
    );
}
/**
 *
 * It is necessary to call useAuthSession in each component that needs to know the auth status,
 * because it manages the session state and token refresh logic. This makes possible to welcome back
 * the user if they are already logged in, without requiring them to log in again.
 * In the future, we could use a global state management solution (like Redux or Context API)
 * to avoid calling useAuthSession in every component, but for now this approach works well.
 *
 * Welcome back should allow the user to access protected routes directly if they have a valid session.
 */
export function Home() {
    const navigate = useNavigate();

    const {
        jwtToken,
        sessionChecked,
        setIsLoggedInExplicitly,
        toggleRefresh,
    } = useAuthSession(import.meta.env.VITE_BACKEND_URL);

    const handleLogin = () => {
        setIsLoggedInExplicitly(true);
        toggleRefresh(true); // optional: start refresh loop after login
        navigate('/login');
    };

    if (!sessionChecked) return <div>Loading session...</div>;
    /**
     * In the future, we could enhance this component to display more personalized information
     * about the user if they are logged in, such as their username or profile picture.
     * We could also add links to other parts of the application that require authentication.
     * Depending on the user's roles and permissions -profile- can also explain the features of each section.
     */
    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"></link>

            <section className="vh-100 d-flex align-items-center bg-dark text-white">
                <div className="container text-center">
                    <h1 className="display-4 fw-bold"><i className="bi bi-shield-lock-fill me-2"></i>AuthServer</h1>
                    <p className="lead">Secure access to your IT ecosystem: services, users, databases, and more.</p>
                    {!jwtToken ? (
                        <LoginPrompt handleLogin={handleLogin} />
                        ) : (
                        <div>Welcome back!</div>
                    )}
                </div>
            </section>
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-md-3">
                            <i className="bi bi-hdd-network fs-1 text-primary"></i>
                            <h5 className="mt-2">Services</h5>
                            <p className="text-muted">Manage and monitor deployed applications.</p>
                        </div>
                        <div className="col-md-3">
                            <i className="bi bi-people-fill fs-1 text-success"></i>
                            <h5 className="mt-2">Users</h5>
                            <p className="text-muted">Control access and roles across your system.</p>
                        </div>
                        <div className="col-md-3">
                            <i className="bi bi-database-fill fs-1 text-info"></i>
                            <h5 className="mt-2">Databases</h5>
                            <p className="text-muted">Connect and configure your data sources.</p>
                        </div>
                        <div className="col-md-3">
                            <i className="bi bi-diagram-3-fill fs-1 text-warning"></i>
                            <h5 className="mt-2">Groups</h5>
                            <p className="text-muted">Organize users and services logically.</p>
                        </div>
                        <div className="col-md-3">
                            <i className="bi bi-fingerprint fs-1 text-warning"></i>
                            <h5 className="mt-2">Biometrics</h5>
                            <p className="text-muted">Manage and verify user identities.</p>
                        </div>
                        <div className="col-md-3">
                            <i className="bi bi-router-fill fs-1 text-warning"></i>
                            <h5 className="mt-2">IPs</h5>
                            <p className="text-muted">Manage and monitor IP addresses.</p>
                        </div>
                        <div className="col-md-3">
                            <i className="bi bi-person-fill fs-1 text-warning"></i>
                            <h5 className="mt-2">Profiles</h5>
                            <p className="text-muted">Manage user profiles and preferences.</p>
                        </div>
                        <div className="col-md-3">
                            <i className="bi bi-file-earmark-text-fill fs-1 text-warning"></i>
                            <h5 className="mt-2">Logs</h5>
                            <p className="text-muted">View and analyze system logs.</p>
                        </div>
                        <div className="col-md-3">
                            <i className="bi bi-geo-alt-fill fs-1 text-warning"></i>
                            <h5 className="mt-2">Regions</h5>
                            <p className="text-muted">Manage and monitor geographical regions.</p>
                        </div>

                    </div>
                </div>
            </section>

            <footer className="bg-dark text-white text-center py-3">
                <small>&copy; 2025 AuthServer. All rights reserved.</small>
            </footer>

        </>
    )
}
