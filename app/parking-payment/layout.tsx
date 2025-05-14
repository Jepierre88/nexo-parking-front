import { ReactNode } from "react";

import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import OcupationCounter from "@/components/parking-payment/OcupationCounter";

export default function ParkingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="container relative mx-auto max-w-7xl px-2 flex-grow">
        <ProtectedRoute>
          <Toaster richColors duration={3000} />
          {/* <OcupationCounter /> */}
          {children}
        </ProtectedRoute>
      </main>
    </>
  );
}
