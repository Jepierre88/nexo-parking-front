"use client";
import { UseAuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = UseAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  if (loading) return null;

  return <>{children}</>;
};
