"use client";
import Cookies from "js-cookie";

import { useEffect, useState } from "react";

const withPermission = (Component: React.FC, requiredPermission: number) => {
  return (props: any) => {
    const [isAllowed, setIsAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const permissions = Cookies.get("permissions")
        ? JSON.parse(Cookies.get("permissions")!)
        : [];

      if (permissions.includes(requiredPermission)) {
        setIsAllowed(true);
      } else {
        console.warn(
          `Access denied. Permission ${requiredPermission} required.`
        );
        window.location.href = "/auth/login";
        // Redirige al login si no tiene permiso
      }

      setIsLoading(false);
    }, [window.location.href]);

    if (isLoading) {
      return <p>Cargando...</p>; // Mostrar un mensaje mientras se valida
    }

    return isAllowed ? <Component {...props} /> : null; // Renderizar el componente si está permitido
  };
};

export default withPermission;
