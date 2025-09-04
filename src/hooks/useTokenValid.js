import { useState, useEffect } from "react";
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom";

export function useTokenValid(jwtToken) {
    const [tokenValid, setTokenValid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!jwtToken) {
            Swal.fire({
                title: 'Token Invalid',
                text: 'Your Token is invalid. Please log in again.',
                icon: 'warning',
                confirmButtonText: 'OK'
            }).then(() => {
                setTokenValid(false);
                navigate("/login");
            });
        }
        // Example: decode and check expiration (if using JWT)
        try {
            const payload = JSON.parse(atob(jwtToken.split('.')[1]));
            setTokenValid(payload.exp * 1000 > Date.now());
        } catch {
            setTokenValid(false);
        }
    }, [jwtToken, navigate]);

    return tokenValid;
}