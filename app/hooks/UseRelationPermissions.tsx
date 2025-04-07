"use client";

import { CONSTANTS } from "@/config/constants";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function UseRelationPermissions(id: number) {
  const [permissionsById, setPermissionsById] = useState<number[]>([]);

  const getPermissionsById = async () => {
    if (!id) return;
    try {
      const response = await axios.get(
        `${CONSTANTS.APIURL}/relationpermissions/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
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
