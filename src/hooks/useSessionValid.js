import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
export function useSessionValid(backendUrl, jwtToken) {
    const [sessionValid, setSessionValid] = useState(false);
    const [ tokenValid, setTokenValid ] = useState(false);
    const [ checking, setChecking ] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!jwtToken) {
            Swal.fire({
                title: 'Session Invalid',
                text: 'Your session is invalid. Please log in again.',
                icon: 'warning',
                confirmButtonText: 'OK'
            }).then(() => {
                setTokenValid(false);
                navigate("/login");
            });

            setSessionValid(false);
            setChecking(false);
        }

        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
            credentials: "include",
        };

        fetch(`${backendUrl}/validatesession`, requestOptions)
            .then((res) => setSessionValid(res.ok))
            .catch(() => setSessionValid(false))
            .finally(() => setChecking(false));
    }, [backendUrl, jwtToken, navigate, tokenValid]);
    return { sessionValid, checking };
}