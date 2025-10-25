import { createContext, useContext, useState } from "react";
import { useAuthSession } from "../hooks/useAuthSession";
/**
 * Authentication context and provider for managing user authentication state.
 * Utilizes the useAuthSession hook to handle JWT tokens and session management.
 * Provides context to child components for accessing authentication state and functions.
 * without context, useAuthSession would need to be called in every component that needs auth state.
 */
const AuthContext = createContext();
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export function AuthProvider({ children }) {
  const auth = useAuthSession(backendUrl);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  return (
    <AuthContext.Provider value={{ ...auth, justLoggedIn, setJustLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}