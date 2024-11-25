import axios from "axios";
import { useEffect, useState } from "react";

import { User, Signup } from "@/types";

export default function UseUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [signup, setSignup] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [existingUsernames, setExistingUsernames] = useState<string[]>([]);
  const [existingUserEmails, setExistingEmails] = useState<string[]>([]);
  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/users`
      );
      const arrayfilter: User[] = Array.isArray(response.data)
        ? response.data
        : [];
      const filteredUsers = arrayfilter.filter(
        (item) => item.realm !== "Consultorio" && item.realm !== "consultorio"
      );

      setUsers(filteredUsers);
      setExistingUsernames(filteredUsers.map((user) => user.username));
      setExistingEmails(filteredUsers.map((user) => user.email));
      console.log(users);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

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
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/users/${user.id}`,
        {
          name: user.name,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          realm: user.realm,
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
      `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/signup`,
      {
        username: signup.username,
        password: signup.password,
        email: signup.email,
        name: signup.name,
        lastName: signup.lastName,
        cellPhoneNumber: signup.cellPhoneNumber,
        realm: signup.realm,
      }
    );

    console.log("Usuario creado:", response.data);

    return response.data;
  };

  useEffect(() => {
    setLoading(true);
    getUsers();
  }, []);

  return {
    users,
    signup,
    loading,
    getUsers,
    updateUser,
    createUser,
    isUserDataUnique,
    existingUsernames,
    existingUserEmails,
  };
}
