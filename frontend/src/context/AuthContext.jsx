import { useEffect, useState } from "react";
import { AUTH_LOGOUT_EVENT } from "../api/axios";
import { AuthContext } from "./authContextInstance";

const getStoredUser = () => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) return null;

  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : {};
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    const handleLogout = () => setUser(null);
    window.addEventListener(AUTH_LOGOUT_EVENT, handleLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogout);
  }, []);

  const login = ({ access, refresh, user: userData = {} }) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser((previous) => {
      const updated = { ...previous, ...userData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
