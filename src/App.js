import { useAuthSession } from './hooks/useAuthSession';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
// import { Login } from './components/Login';
import { LoadingScreen } from './utils/LoadingScreen';
// import { Header } from './utils/Header';
import { Alert } from './utils/Alert';

function App() {
    const [alertClassName] = useState("d-none");
    const [alertMessage] = useState("");
    // const navigate = useNavigate();
    const {
        jwtToken,
        // setJwtToken,
        sessionChecked,
        // setIsLoggedInExplicitly,
        // toggleRefresh,
        // logOut,
    } = useAuthSession(process.env.REACT_APP_BACKEND_URL);

    if (!sessionChecked) return <LoadingScreen />;

    // const handleLogin = () => {
    //     setIsLoggedInExplicitly(true);
    //     toggleRefresh(true); // optional: start refresh loop after login
    //     navigate('/login');
    // };

    return (
        <>
            {/* <Header jwtToken={jwtToken} handleLogin={handleLogin} /> */}
            <main className="container mt-3">
                <Alert message={alertMessage} className={alertClassName} />
                    {jwtToken ? (
                        <Navigate to="/apps" />
                    ) : (

                        <Navigate to="/home" />
                    )}
            </main>
        </>
    )
}
export { App }