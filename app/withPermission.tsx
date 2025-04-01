"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function withPermission<P extends Object>(
  Component: React.FC<P>,
  requiredPermission: number
): React.FC<P> {
  return function ProtectedComponent(props: P) {
    const [isAllowed, setIsAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const storedToken = Cookies.get("auth_token");
      const storedPermissions = Cookies.get("permissions");

      if (storedToken && storedPermissions) {
        try {
          const parsedPermissions = JSON.parse(storedPermissions);
          if (
            Array.isArray(parsedPermissions) &&
            parsedPermissions.includes(requiredPermission)
          ) {
            setIsAllowed(true);
          } else {
            setIsAllowed(false);
          }
        } catch (error) {
          console.error("Error procesando los permisos:", error);
          setIsAllowed(false);
        }
      } else {
        setIsAllowed(false);
      }

      setIsLoading(false);
    }, [requiredPermission]);

    useEffect(() => {
      if (!isAllowed && !isLoading) {
        router.replace("/auth/login");
      }
    }, [isAllowed, isLoading, router]);

    if (isLoading) return <p>Cargando...</p>;
    return isAllowed ? <Component {...props} /> : null;
  };
}

export default withPermission;
