import { Navbar } from "@/components/navbar";
import { ReactNode } from "react";

export default function ParkingLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Navbar />
			<main className="container mx-auto max-w-7xl px-6 flex-grow">
				{children}
			</main>
		</>
	);
}
