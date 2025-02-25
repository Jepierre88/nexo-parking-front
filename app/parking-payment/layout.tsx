import { ReactNode } from "react";

import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ParkingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow">
        <ProtectedRoute>
          <Toaster richColors duration={2000} />
          {children}
        </ProtectedRoute>
      </main>
    </>
  );
}
