import { useCallback, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Alert from './components/Alert';
import { LoadingScreen } from "./misc/LoadingScreen";

function App() {
    const [jwtToken, setJwtToken] = useState('');
    const [alertMessage, setAlertMessage] = useState();
    const [alertClassName, setAlertClassName] = useState('d-none');

    const [tickInterval, setTickInterval] = useState();
    const [sessionChecked, setSessionChecked] = useState(false);

    const navigate = useNavigate();
    const [isLoggedInExplicitly, setIsLoggedInExplicitly] = useState(false);

    const toggleRefresh = useCallback((status) => {
        if (status && !isLoggedInExplicitly) return;
        if (status) {
            const intervalId = setInterval(() => {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/refresh`, {
                    method: "GET",
                    credentials: "include",
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.access_token) {
                            setJwtToken(data.access_token);
                        }
                    })
                    .catch(error => {
                        console.log("user is not logged in");
                    })
            }, 600000);
            setTickInterval(intervalId);
        } else {
            if (tickInterval) {
                clearInterval(tickInterval);
                setTickInterval(null);
            }
        }
    }, [tickInterval, isLoggedInExplicitly])

    const logOut = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/logout`, {
            method: 'GET',
            credentials: 'include',
        })
            .catch((error) => {
                console.log('error logging out', error);
            })
            .finally(() => {
                setJwtToken('');
                setIsLoggedInExplicitly(false);
                toggleRefresh(false);
                navigate('/login');
            });
    };
    useEffect(() => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;

        if (!backendUrl) {
            console.error("Environment variable REACT_APP_BACKEND_URL is missing.");
            return;
        }

        fetch(`${backendUrl}/refresh`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Server responded with ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                if (data.access_token) {
                    setJwtToken(data.access_token);
                }
            })
            .catch((error) => {
                console.error("Token refresh failed:", error);
            })
            .finally(() => {
                setSessionChecked(true);
            });
    }, [toggleRefresh]);
    if (!sessionChecked) return <LoadingScreen />;
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1 className="mt-3">Server Authentication for All the Apps!</h1>
                </div>
                <div className="col text-end">
                    {jwtToken === ''
                        ? (<Link to='login'><span className="badge bg-success">Login</span></Link>)
                        : (<a href='#!' onClick={logOut}><span className='badge bg-danger'>Logout</span></a>)
                    }
                </div>
                <hr className="mb-3"></hr>
            </div>

            <div className="row">
                <div className="col-md-2">
                    <nav>
                        <div className='list-group'>
                            <Link to='/' className="list-group-item list-group-item-action">Home</Link>
                            {jwtToken !== '' && (
                                <>
                                    <Link to='/apps' className="list-group-item list-group-item-action">Apps</Link>
                                    <Link to='/databases' className="list-group-item list-group-item-action">Databases</Link>
                                    <Link to='/roles' className="list-group-item list-group-item-action">Roles</Link>
                                    <Link to='/users' className="list-group-item list-group-item-action">Users</Link>
                                    <Link to='/groups' className="list-group-item list-group-item-action">Groups</Link>
                                    <Link to='/profiles' className="list-group-item list-group-item-action">Profiles</Link>
                                    <Link to='/ips' className="list-group-item list-group-item-action">IPs</Link>
                                    <Link to='/regions' className="list-group-item list-group-item-action">Regions</Link>
                                    <Link to='/biometrics' className="list-group-item list-group-item-action">Biometrics</Link>
                                    {/* <Link to='/manage-catalogue' className="list-group-item list-group-item-action">Manage Catalogue</Link> */}
                                </>
                            )}
                        </div>
                    </nav>
                </div>
                <div className="col-md-10 ">
                    <Alert
                        message={alertMessage}
                        className={alertClassName}
                    />
                    <Outlet context={{
                        jwtToken,
                        setJwtToken,
                        setAlertClassName,
                        setAlertMessage,
                        toggleRefresh,
                        setIsLoggedInExplicitly,
                    }} />
                </div>
            </div>
        </div>
    );
}
export default App;