"use client";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext<any | undefined>(undefined);

export const UseAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("No auth context provided");

  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<
    | { name: string; lastName: string; realm: string; permissions: number[] }
    | undefined
  >({
    name: "",
    lastName: "",
    realm: "",
    permissions: [] as number[],
  });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        setUser,
        setToken: setToken,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
