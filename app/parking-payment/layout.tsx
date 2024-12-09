import { ReactNode } from "react";

import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";

export default function ParkingLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Navbar />
			<main className="container mx-auto max-w-7xl px-6 flex-grow">
				<Toaster richColors />
				{children}
			</main>
		</>
	);
}
