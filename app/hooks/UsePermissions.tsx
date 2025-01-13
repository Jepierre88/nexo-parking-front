"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const UsePermissions = () => {
  const [permissions, setPermissions] = useState<number[] | null>(null);

  useEffect(() => {
    const storedPermissions = Cookies.get("permissions")
      ? JSON.parse(Cookies.get("permissions")!)
      : [];
    if (storedPermissions.length === 0) {
      console.warn("No se encontraron permisos en las cookies");
    }
    setPermissions(storedPermissions);
  }, []);

  const hasPermission = (requiredPermission: number) => {
    if (permissions === null) {
      return false;
    }
    return permissions.includes(requiredPermission);
  };

  return { permissions, hasPermission };
};

export default UsePermissions;
