import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuthSession } from "../hooks/useAuthSession";
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Use your existing auth session hook
  const authSession = useAuthSession(backendUrl);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const handleSessionExpiry = useCallback(() => {
    if (authSession.logOut) {
      authSession.logOut();
    }
    setUser(null);
    setJustLoggedIn(false);
    localStorage.clear();
    window.location.href = '/login?session=expired';
  }, [authSession]);

  // Enhanced checkAuth
  const checkAuth = useCallback(async () => {
  // Skip auth check if we're already on the login page
  // if (window.location.pathname === '/login') {
  //   setLoading(false);
  //   return;
  // }
    try {
      const response = await api.get('apps');
      setUser(response.data.user);
    } catch (error) {
      if (error.response?.status === 401) {
        handleSessionExpiry();
      }
    } finally {
      setLoading(false);
    }
  }, [handleSessionExpiry]);

  const enhancedLogout = () => {
    if (authSession.logOut) {
      authSession.logOut();
    }
    setUser(null);
    setJustLoggedIn(false);
    api.post('/auth/logout')
      .finally(() => {
        window.location.href = '/login';
      });
  };

  // Sync with existing auth session
  useEffect(() => {
    if (authSession.user) {
      setUser(authSession.user);
      setLoading(false);
    } else if (authSession.loading !== undefined) {
      setLoading(authSession.loading);
    }
  }, [authSession.user, authSession.loading]);

  useEffect(() => {
    if (!authSession.user && !authSession.loading) {
      checkAuth();
    }
  }, [authSession.user, authSession.loading, checkAuth]);

  // Explicitly define all properties to avoid conflicts
  const value = {
    // From your original useAuthSession
    setJwtToken: authSession.setJwtToken,
    setIsLoggedInExplicitly: authSession.setIsLoggedInExplicitly,
    toggleRefresh: authSession.toggleRefresh,

    // Enhanced properties
    justLoggedIn,
    setJustLoggedIn,
    user: authSession.user || user,
    loading: authSession.loading !== undefined ? authSession.loading : loading,
    logout: enhancedLogout,
    setUser: setUser,
    handleSessionExpiry,

    // Pass through any other properties from authSession
    ...Object.keys(authSession).reduce((acc, key) => {
      if (!acc[key]) {
        acc[key] = authSession[key];
      }
      return acc;
    }, {})
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};