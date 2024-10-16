import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "@/types"; // Asegúrate de que esta ruta sea correcta

export default function UseUsers() {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/users`
      );
      const arrayfilter: User[] = Array.isArray(response.data)
        ? response.data
        : [];
      setUsers(
        arrayfilter.filter(
          (item) => item.realm !== "Consultorio" && item.realm !== "consultorio"
        )
      );
    } catch (error) {
      setUsers([]);
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const updateUser = async (user: User) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/users/${user.id}`,
        {
          name: user.name,
          lastname: user.lastName,
          username: user.username,
          email: user.email,
          realm: user.realm,
        }
      );
      console.log("Usuario actualizado:", response.data);
      return response.data; // Retorna el usuario actualizado
    } catch (error) {
      console.error("Error actualizando el usuario:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return { users, getUsers, updateUser };
}
