"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";
import { redirect } from "next/navigation";
import { UseNavigateContext } from "./NavigateContext";

const AuthContext = createContext<any | undefined>(undefined);

export const UseAuthContext = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("AuthContext must be used within an AuthProvider");
	}

	return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const { router } = UseNavigateContext();
	const [user, setUser] = useState<
		{ name: string; lastName: string; realm: string } | undefined
	>({
		name: "",
		lastName: "",
		realm: "",
	});

	useEffect(() => {
		const validateToken = () => {
			const token = Cookies.get("authToken");
			console.log(token);
			if (!token) {
				router.push("/auth/login");
			} else {
				return;
			}
		};
		validateToken();
	}, [router.asPath]);

	const signIn = async (email: string, password: string) => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_LOCAL_APIURL}/users/login`,
				{
					email: email,
					password: password,
				}
			);
			if (response.data.token) {
				// Actualizar el contexto de autenticación
				setUser({
					name: response.data.name,
					lastName: response.data.lastName,
					realm: response.data.realm,
				});
				setIsAuthenticated(true);

				// Guardar el token en cookies
				Cookies.set("authToken", response.data.token, {
					expires: 0.125, // Expira en 7 días
					secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
					sameSite: "strict", // Política de seguridad
					path: "/", // Disponible en toda la app
				});
			} else {
				throw new Error("Token no recibido");
			}
		} catch (error: any) {
			console.error("Error en inicio de sesión:", error);
			setIsAuthenticated(false);
			Cookies.remove("authToken");
			throw error; // Permitir que el componente maneje el error
		}
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: isAuthenticated, // Replace with actual authentication logic
				user: user,
				setUser,
				setIsAuthenticated,
				signIn,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
