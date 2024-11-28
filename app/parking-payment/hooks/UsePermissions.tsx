"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function UsePermissions() {
  const [permissions, setPermissions] = useState<any[]>([]);

  const getPermissions = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/permissions`
      );
      setPermissions(response.data);
    } catch (error) {
      console.error("Error obteniendo roles:", error);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  return { permissions };
}
