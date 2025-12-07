/**
 * ProtectedRoute.jsx
 * -----------------
 * Wrapper component that protects routes requiring authentication.
 * Redirects to login if user is not authenticated.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }) => {
  const { jwtToken, sessionChecked } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only set loading to false after session check is complete
    if (sessionChecked) {
      setIsLoading(false);
    }
  }, [sessionChecked]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!jwtToken) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;