import { useCallback, useEffect, useState } from 'react';
import Swal from "sweetalert2";

const REFRESH_INTERVAL = 600000; // 10 minutes

export function useAuthSession(backendUrl) {
    if (!backendUrl) throw new Error("backendUrl is required");

    const [authState, setAuthState] = useState({
        jwtToken: '',
        isLoggedInExplicitly: false,
        sessionChecked: false,
        sessionValid: false,
        tokenValid: false,
    });

    const [tickInterval, setTickInterval] = useState(null);

    const setAuthStateProperty = useCallback((property, value) => {
        setAuthState(prevState => ({
            ...prevState,
            [property]: value
        }));
    }, []);

    const refreshToken = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/refresh`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`Server responded with ${response.status}`);
            const data = await response.json();
            if (data.access_token) {
                setAuthStateProperty('jwtToken', data.access_token);
            } else {
                console.error('Refresh token not available');
                // Optionally notify the user here
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            // Optionally notify the user here
        }
    }, [backendUrl, setAuthStateProperty]);

    const toggleRefresh = useCallback((status) => {
        if (status && !authState.isLoggedInExplicitly) return;

        if (status) {
            const intervalId = setInterval(refreshToken, REFRESH_INTERVAL);
            setTickInterval(intervalId);
        } else {
            if (tickInterval) {
                clearInterval(tickInterval);
                setTickInterval(null);
            }
        }
    }, [tickInterval, authState.isLoggedInExplicitly, refreshToken]);

    const logOut = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/logout`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`Logout failed with status ${response.status}`);
            setAuthState({
                jwtToken: '',
                isLoggedInExplicitly: false,
                sessionChecked: true,
                sessionValid: false,
                tokenValid: false,
            });
            toggleRefresh(false);
            Swal.fire({
                title: 'Logged Out',
                text: 'You have been successfully logged out.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            console.error('Error logging out:', error);
            Swal.fire({
                title: 'Error',
                text: 'An error occurred while logging out. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }, [backendUrl, toggleRefresh]);

    useEffect(() => {
        if (!backendUrl) {
            console.error('REACT_APP_BACKEND_URL is missing.');
            return;
        }

        const checkSession = async () => {
            const hasSessionCookie = document.cookie.includes('refreshToken'); // adjust to your cookie name
            if (!hasSessionCookie) {
                setAuthStateProperty('sessionChecked', true);
                return;
            }

            try {
                const response = await fetch(`${backendUrl}/refresh`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) throw new Error(`Server responded with ${response.status}`);
                const data = await response.json();
                if (data.access_token) {
                    setAuthStateProperty('jwtToken', data.access_token);
                }
            } catch (error) {
                console.error('Token refresh failed:', error);
            } finally {
                setAuthStateProperty('sessionChecked', true);
            }
        };

        checkSession();
    }, [backendUrl, setAuthStateProperty]);

    useEffect(() => {
        if (!authState.sessionChecked || !authState.jwtToken) return;

        const validateSession = async () => {
            try {
                const response = await fetch(`${backendUrl}/validatesession`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authState.jwtToken}`,
                    },
                    credentials: "include",
                });
                setAuthStateProperty('sessionValid', response.ok);
            } catch (error) {
                console.error('Session validation failed:', error);
                setAuthStateProperty('sessionValid', false);
            }
        };

        validateSession();
    }, [authState.jwtToken, backendUrl, authState.sessionChecked, setAuthStateProperty]);

    useEffect(() => {
        if (!authState.sessionChecked || !authState.jwtToken) return;

        // Only try to decode if jwtToken has 3 parts (header.payload.signature)
        const tokenParts = authState.jwtToken.split('.');
        if (tokenParts.length !== 3) {
            setAuthStateProperty('tokenValid', false);
            return;
        }

        try {
            const payload = JSON.parse(atob(tokenParts[1]));
            setAuthStateProperty('tokenValid', payload.exp * 1000 > Date.now());
        } catch (error) {
            console.error('Token validation failed:', error);
            setAuthStateProperty('tokenValid', false);
            Swal.fire({
                title: 'Token Invalid',
                text: 'Your token is invalid. Please log in again.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    }, [authState.jwtToken, authState.sessionChecked, setAuthStateProperty]);

return {
    jwtToken: authState.jwtToken,
    setJwtToken: (token) => setAuthStateProperty('jwtToken', token),
    sessionChecked: authState.sessionChecked,
    isLoggedInExplicitly: authState.isLoggedInExplicitly,
    setIsLoggedInExplicitly: (value) => setAuthStateProperty('isLoggedInExplicitly', value),
    toggleRefresh,
    logOut,
    sessionValid: authState.sessionValid,
    tokenValid: authState.tokenValid
};
}
