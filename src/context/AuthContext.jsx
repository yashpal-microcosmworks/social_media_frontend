import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(token);

  useEffect(() => {
    if (token) {
      const expiryTime = localStorage.getItem("tokenExpiry");
      const isExpired = Date.now() > parseInt(expiryTime, 10);
      setIsAuthenticated(!isExpired);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  const setAuthStatus = (newToken, expiryTime) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("tokenExpiry", expiryTime.toString());
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, setAuthStatus, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
