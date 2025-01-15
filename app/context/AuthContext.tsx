"use client";
import User from "@/types/User";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
const AuthContext = createContext<any | undefined>(undefined);

export const UseAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = Cookies.get("auth_token");
    const storedUser = Cookies.get("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (token) {
      Cookies.set("auth_token", token, { expires: 1, secure: true });
    } else {
      Cookies.remove("auth_token");
    }

    if (user) {
      Cookies.set("user", JSON.stringify(user), { expires: 1, secure: true });
    } else {
      Cookies.remove("user");
    }
  }, [token, user]);

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    Cookies.remove("auth_token");
    Cookies.remove("user");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        setUser,
        setToken,
        setIsAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
