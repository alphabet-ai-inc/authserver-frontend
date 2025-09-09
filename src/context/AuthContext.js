import { createContext, useContext } from "react";
import { useAuthSession } from "../hooks/useAuthSession";

const AuthContext = createContext();
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export function AuthProvider({ children }) {
  const auth = useAuthSession(backendUrl);
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}