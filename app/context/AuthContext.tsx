"use client";
import User from "@/types/User";
import { usePathname, useRouter } from "next/navigation";
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

  const pathname = usePathname();
  const router = useRouter();

  // Guardar la última ruta visitada en localStorage
  useEffect(() => {
    if (pathname !== "/auth/login") {
      localStorage.setItem("last_path", pathname);
    }
  }, [pathname]);

  useEffect(() => {
    try {
      const storedToken = Cookies.get("auth_token");
      const storedUser = Cookies.get("user");

      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && typeof parsedUser === "object" && parsedUser.name) {
            setUser(parsedUser);
          } else {
            console.warn("Usuario en cookies no válido, eliminando...");
            Cookies.remove("user");
            setUser(null);
          }
        } catch (error) {
          console.error("Error al parsear user desde Cookies:", error);
          Cookies.remove("user");
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Error al cargar datos de autenticación:", error);
      Cookies.remove("user");
      setUser(null);
    }
  }, []);

  // Restaurar última ruta visitada tras la autenticación
  useEffect(() => {
    if (isAuthenticated) {
      const lastPath = localStorage.getItem("last_path") || "/parking-payment";
      router.replace(lastPath);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (token) {
      Cookies.set("auth_token", token, { expires: 1, secure: true });
    } else {
      Cookies.remove("auth_token");
    }

    if (user && user.name) {
      try {
        Cookies.set("user", JSON.stringify(user), { expires: 1, secure: true });
      } catch (error) {
        console.error("Error al guardar user en Cookies:", error);
      }
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
    router.push("/auth/login"); // Redirigir al login tras cerrar sesión
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
