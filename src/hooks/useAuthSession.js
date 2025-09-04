import { useCallback, useEffect, useState } from 'react';

export function useAuthSession(backendUrl) {
  if (!backendUrl) throw new Error("backendUrl is required");

  const [jwtToken, setJwtToken] = useState('');
  const [isLoggedInExplicitly, setIsLoggedInExplicitly] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [tickInterval, setTickInterval] = useState(null);

  const toggleRefresh = useCallback((status) => {
    
    if (status && !isLoggedInExplicitly) return;

    if (status) {
      const intervalId = setInterval(() => {
        fetch(`${backendUrl}/refresh`, {
          method: 'GET',
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.access_token) {
              setJwtToken(data.access_token);
            }
          })
          .catch(() => {
            console.log('user is not logged in');
          });
      }, 600000); // 10 minutes

      setTickInterval(intervalId);
    } else {
      if (tickInterval) {
        clearInterval(tickInterval);
        setTickInterval(null);
      }
    }
  }, [tickInterval, isLoggedInExplicitly, backendUrl]);

  const logOut = useCallback(() => {
    fetch(`${backendUrl}/logout`, {
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
      });
  }, [backendUrl, toggleRefresh]);

  useEffect(() => {
    if (!backendUrl) {
      console.error('REACT_APP_BACKEND_URL is missing.');
      return;
    }
    const hasSessionCookie = document.cookie.includes('refreshToken'); // adjust to your cookie name

    if (!hasSessionCookie) {
      setSessionChecked(true);
      return;
    }

    fetch(`${backendUrl}/refresh`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.access_token) {
          setJwtToken(data.access_token);
          // No toggleRefresh here — only after explicit login
        }
      })
      .catch((error) => {
        console.error('Token refresh failed:', error);
      })
      .finally(() => {
        setSessionChecked(true);
      });
  }, [backendUrl]);

  return {
    jwtToken,
    setJwtToken,
    sessionChecked,
    isLoggedInExplicitly,
    setIsLoggedInExplicitly,
    toggleRefresh,
    logOut,
  };
}
