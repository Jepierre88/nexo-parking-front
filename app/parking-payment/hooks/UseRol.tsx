import axios from "axios";
import { useEffect, useState } from "react";

export default function UseRol() {
  const [roles, setRoles] = useState<any[]>([]);

  const getRoles = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/rol`
      );
      setRoles(response.data);
    } catch (error) {
      console.error("Error obteniendo roles:", error);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  return roles;
}
