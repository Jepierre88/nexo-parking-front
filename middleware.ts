import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const token = req.cookies.get("authToken")?.value;

	// Si no hay token, redirigir al login
	if (!token) {
		return NextResponse.redirect(new URL("/auth/login", req.url));
	}

	return NextResponse.next(); // Permitir acceso si hay token
}

// Configurar las rutas protegidas
export const config = {
	matcher: ["/parking-payment", "/parking-payment/:path*"], // Rutas protegidas
};
