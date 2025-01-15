"use client";
import { UseAuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated } = UseAuthContext();
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/auth/login"); // Redirigir al login si no está autenticado
		}
	}, [isAuthenticated, router]);

	if (!isAuthenticated) return null; // Muestra nada mientras redirige

	return <>{children}</>;
};
