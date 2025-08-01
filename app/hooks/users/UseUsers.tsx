import axios from "axios";
import { useEffect, useState } from "react";

import User from "@/types/User";
import Signup from "@/types/Auth";
import { CONSTANTS } from "@/config/constants";
import Cookies from "js-cookie";

export default function UseUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [signup, setSignup] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [existingUsernames, setExistingUsernames] = useState<string[]>([]);
  const [existingUserEmails, setExistingEmails] = useState<string[]>([]);

  // const getUsers = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${CONSTANTS.APIURL}/users`
  //     );
  //     const arrayfilter: User[] = Array.isArray(response.data)
  //       ? response.data
  //       : [];
  //     const filteredUsers = arrayfilter.filter(
  //       (item) => item.realm !== "Consultorio" && item.realm !== "consultorio"
  //     );

  //     setUsers(filteredUsers);
  //     setExistingUsernames(filteredUsers.map((user) => user.username));
  //     setExistingEmails(filteredUsers.map((user) => user.email));
  //     console.log(users);
  //   } catch (error) {
  //     console.error("Error al obtener los usuarios:", error);
  //     setUsers([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const isUserDataUnique = (newUserData: any, existingUsers: User[]) => {
    const exists = existingUsers.some(
      (user) =>
        user.username === newUserData.username ||
        user.email === newUserData.email
    );

    return !exists;
  };

  const updateUser = async (user: User) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${CONSTANTS.APIURL}/users/${user.id}`,
        {
          name: user.name,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          realm: user.realm,
          eliminated: user.eliminated,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
      );

      console.log("Usuario actualizado:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error actualizando el usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (signup: Signup) => {
    const response = await axios.post(
      `${CONSTANTS.APIURL}/signUp`,
      {
        username: signup.username,
        password: signup.password,
        email: signup.email,
        name: signup.name,
        lastName: signup.lastName,
        cellPhoneNumber: signup.cellPhoneNumber,
        realm: signup.realm,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("auth_token")}`,
        },
      }
    );

    console.log("Usuario creado:", response.data);

    return response.data;
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${CONSTANTS.APIURL}/users/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
      );
      console.log(`Usuario con ID ${id} eliminado:`, response.data);

      // Actualizar la lista de usuarios después de la eliminación
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

      return response.data;
    } catch (error) {
      console.error("Error eliminando el usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    email: string,
    newPassword: string,
    lastPassword: string
  ) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${CONSTANTS.APIURL}/reset-password/finish`,
        {
          email,
          password: newPassword,
          lastPassword,
        }
      );
      console.log("Contraseña reseteada exitosamente:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error al resetear la contraseña:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   setLoading(true);
  //   getUsers();
  // }, []);

  return {
    users,
    signup,
    loading,
    // getUsers,
    updateUser,
    createUser,
    deleteUser,
    resetPassword,
    isUserDataUnique,
    existingUsernames,
    existingUserEmails,
  };
}
