import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";
import { NavigateProvider } from "./context/NavigateContext";
import { AuthProvider } from "./context/AuthContext";

import { fontSans } from "@/config/fonts";
import React from "react";

export const metadata: Metadata = {
	title: {
		default: "Punto de pago - COINS Tech",
		template: `%s - Punto de pago - COINS Tech`,
	},
	description: "Nuevo punto de pago creado por COINS Tech",
	icons: {
		icon: "/favicon.ico",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html suppressHydrationWarning lang="es">
			<head />
			<body
				className={clsx(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				<Providers themeProps={{ attribute: "class" }}>
					<div className="relative flex flex-col h-screen overflow-x-hidden">
						<NavigateProvider>
							<AuthProvider>
								{process.env.NODE_ENV === "production" ? (
									<React.StrictMode>{children}</React.StrictMode>
								) : (
									<>{children}</>
								)}
							</AuthProvider>
						</NavigateProvider>
					</div>
				</Providers>
			</body>
		</html>
	);
}
