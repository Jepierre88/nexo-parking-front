"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PaymentProvider } from "./context/PaymentContext";
import { useLocale } from "@react-aria/i18n";

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: any;
}

export function Providers({ children, themeProps }: ProvidersProps) {
	const router = useRouter();
	const { locale } = useLocale();

	return (
		<NextUIProvider navigate={router.push} locale={locale}>
			<PaymentProvider>
				<NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
			</PaymentProvider>
		</NextUIProvider>
	);
}
