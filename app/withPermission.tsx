"use client";
import Cookies from "js-cookie";

import { useEffect, useState } from "react";

const withPermission = (Component: React.FC, requiredPermission: number) => {
  return (props: any) => {
    const [isAllowed, setIsAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (typeof window !== "undefined") {
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
        }

        setIsLoading(false);
      }
    }, []);

    if (isLoading) {
      return <p>Cargando...</p>;
    }

    return isAllowed ? <Component {...props} /> : null;
  };
};

export default withPermission;
