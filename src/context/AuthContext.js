import { createContext, useContext } from "react";
import { useAuthSession } from "../hooks/useAuthSession";

const AuthContext = createContext();

export function AuthProvider({ children, backendUrl }) {
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