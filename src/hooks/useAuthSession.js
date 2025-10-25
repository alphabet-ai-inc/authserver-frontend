import { useCallback, useEffect, useState } from 'react';
import Swal from "sweetalert2";
import { useRef } from "react";
/**
 * Interval duration for token refresh in milliseconds.
 */
const REFRESH_INTERVAL = 600000; // 10 minutes
/**
 *
 * @param {*} backendUrl
 * @returns jwtToken, that is the JWT token string. This token is used for authenticating requests to the backend.
 * setJwtToken, that is a function to update the jwtToken state.
 * sessionChecked, that is a boolean indicating whether the session check has been completed.
 * isLoggedInExplicitly, that indicates if the user has logged in explicitly.
 * setIsLoggedInExplicitly changes the isLoggedInExplicitly state.
 * toggleRefresh is a function to start or stop the periodic token refresh.
 * logOut is a function to log out the user.
 * sessionValid, that is a boolean indicating whether the session is valid.
 * tokenValid, that is a boolean indicating whether the token is valid.
 *
 * This hook manages authentication state, including token refresh, session validation,
 * and logout functionality. It uses the provided backendUrl to interact with the authentication backend.
 *
 * In the future, consider splitting this hook into smaller, more focused hooks for better maintainability. Some times it will be necessary to use only the logout function
 * or the toggleRefresh function or the jwtToken state.
 */
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
/**
 * Check session on mount and validate token/session when jwtToken or sessionChecked changes.
 */
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
/**
 * Validate session with the backend to ensure it's still valid.
 */

const validatingRef = useRef(false);

useEffect(() => {
    if (!authState.justLoggedIn || !authState.sessionChecked || !authState.jwtToken || !authState.tokenValid || validatingRef.current) {
        return;
    }

        const validateSession = async () => {
        validatingRef.current = true;
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
        } finally {
            validatingRef.current = false;
        }
    };

    validateSession();
}, [authState.justLoggedIn, authState.sessionChecked, authState.jwtToken, authState.tokenValid, backendUrl, setAuthStateProperty]);
    /**
 * Validate the JWT token by decoding it and checking its expiration.
 * If invalid, notify the user to log in again.
 */
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
