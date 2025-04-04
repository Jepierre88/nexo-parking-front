'use server'
import { CONSTANTS } from "@/config/constants";
import Signup from "@/types/Auth";
import User from "@/types/User";
import axios from "axios";

const isUserDataUnique = (newUserData: any, existingUsers: User[]) => {
  const exists = existingUsers.some(
    (user) =>
      user.username === newUserData.username ||
      user.email === newUserData.email
  );

  return !exists;
};

export const updateUserAction = async (user: User) => {
  try {
    const response = await axios.patch(
      `${CONSTANTS.APIURL}/users/${user.id}`,
      {
        name: user.name,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        realm: user.realm,
        eliminated: user.eliminated,
      }
    );

    console.log("Usuario actualizado:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error actualizando el usuario:", error);
  }
};

export const createUserAction = async (signup: Signup) => {
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
    }
  );

  console.log("Usuario creado:", response.data);

  return response.data;
};

const deleteUserAction = async (id: string) => {
  try {
    const response = await axios.delete(
      `${CONSTANTS.APIURL}/users/${id}`
    );
    console.log(`Usuario con ID ${id} eliminado:`, response.data);

    return response.data;
  } catch (error) {
    console.error("Error eliminando el usuario:", error);
  }
};

const resetPasswordAction = async (
  username: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const response = await axios.put(
      `${CONSTANTS.APIURL}/reset-password/NewPP`,
      {
        username,
        password,
        confirmPassword,
      }
    );
    console.log("Contraseña reseteada exitosamente:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error al resetear la contraseña:", error);
    throw error;
  }
};

export const getUsersAction = async ({ page, eliminated }: {
  page?: string;
  eliminated?: string;
}) => {
  try {
    const response = await axios.get(
      `${CONSTANTS.APIURL}/users`,
      {
        headers: {
          page,
          eliminated,
        },
      }
    );

    const { meta, data } = response.data;
    const arrayfilter: User[] = Array.isArray(data)
      ? data
      : [];
    console.log(meta)

    const existingUsernames = arrayfilter.map(
      (user) => user.username
    );

    const existingEmails = arrayfilter.map(
      (user) => user.email
    );

    return {
      users: arrayfilter,
      existingUsernames,
      existingUserEmails: existingEmails,
      pages: meta.lastPage,
      count: meta.count,
    }
  } catch (error) {
    throw error;
  }
};

export const getUserByIdAction = async (id: string) => {
  try {
    const response = await axios.get(
      `${CONSTANTS.APIURL}/users/${id}`
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error al obtener el usuario por ID:", error);
    throw error;
  }
};

export const getRolesAction = async () => {
  try {
    const response = await axios.get(
      `${CONSTANTS.APIURL}/rol`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
