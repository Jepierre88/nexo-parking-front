import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const UsePermissions = () => {
  const [permissions, setPermissions] = useState<number[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedPermissions = Cookies.get("permissions");
    if (storedPermissions) {
      try {
        const parsedPermissions = JSON.parse(storedPermissions);
        setPermissions(parsedPermissions);
      } catch (error) {
        console.error("Error al parsear los permisos:", error);
        setPermissions([]);
      }
    } else {
      console.warn("No se encontraron permisos en las cookies");
      setPermissions([]);
    }
    setIsLoading(false);
  }, []);

  const hasPermission = (requiredPermission: number) => {
    if (permissions === null) {
      return false;
    }
    return permissions.includes(requiredPermission);
  };

  return { permissions, hasPermission, isLoading };
};

export default UsePermissions;
