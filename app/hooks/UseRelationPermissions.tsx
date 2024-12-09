"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function UseRelationPermissions(id: number) {
  const [permissionsById, setPermissionsById] = useState<number[]>([]);

  const getPermissionsById = async () => {
    if (!id) return;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/relationpermissions/${id}`
      );
      setPermissionsById(response.data);
    } catch (error) {
      console.error("Error obteniendo roles:", error);
    }
  };

  useEffect(() => {
    getPermissionsById();
  }, []);

  return { permissionsById };
}
