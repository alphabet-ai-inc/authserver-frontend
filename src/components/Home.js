import Security from './../images/switch1.jpeg'
import { useState } from 'react';
import { useAuthSession } from '../hooks/useAuthSession';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../utils/Alert';
import '../style/Home.css';

function LoginPrompt({ handleLogin }) {
    return (
        <div className='home-container'>
                <img src={Security} alt="security" onClick={handleLogin} />
                <button onClick={handleLogin}>
                    Login
                </button>
        </div>
    );
}

export function Home() {
    const navigate = useNavigate();
    const [alertClassName] = useState("d-none");
    const [alertMessage] = useState("");

    const {
        jwtToken,
        sessionChecked,
        setIsLoggedInExplicitly,
        toggleRefresh,
        // logOut,
    } = useAuthSession(process.env.REACT_APP_BACKEND_URL);

    const handleLogin = () => {
        setIsLoggedInExplicitly(true);
        toggleRefresh(true); // optional: start refresh loop after login
        navigate('/login');
    };

    if (!sessionChecked) return <div>Loading session...</div>;
    return (
        <>
            <Alert message={alertMessage} className={alertClassName} />
            <div className="text-center">

                <h1>Welcome to AuthServer</h1>
                <h2>Login and find the application you like to work on</h2>

                <hr />
                {!jwtToken ? (
                    <LoginPrompt handleLogin={handleLogin} />
                ) : (
                    <div>Welcome back!</div>
                )}
            </div>
        </>
    )
}
