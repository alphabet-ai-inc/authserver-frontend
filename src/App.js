import { useAuthSession } from './hooks/useAuthSession';
import { useState } from 'react';
import { LoadingScreen } from './utils/LoadingScreen';
import { Alert } from './utils/Alert';
import { Link }  from 'react-router-dom';

function App() {
    const [alertClassName] = useState("d-none");
    const [alertMessage] = useState("");
    const {
        jwtToken,
        sessionChecked,
    } = useAuthSession(process.env.REACT_APP_BACKEND_URL);

    if (!sessionChecked) return <LoadingScreen />;

    return (
            <main className="container mt-3">
                <Alert message={alertMessage} className={alertClassName} />
                    {jwtToken ? (
                        <Link to="/apps">Apps</Link>
                    ) : (
                        <Link to="/home">Home</Link>
                    )}
            </main>
    )
}
export { App }