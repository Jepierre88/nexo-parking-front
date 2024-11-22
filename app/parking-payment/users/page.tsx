"use client";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { GridColDef } from "@mui/x-data-grid";
import {
  ModalContent,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalBody,
} from "@nextui-org/modal";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import { title } from "@/components/primitives";
import ICONOLAPIZ from "@/public/iconoLapiz.png";
import ICONOOJO from "@/public/IconoOjo.png";
import ICONOBASURERO from "@/public/iconoBasurero.png";
import { Signup, User } from "@/types";
import UseUsers from "@/app/parking-payment/hooks/UseUsers";
import { roles } from "@/app/utils/data";
import { ModalError, ModalExito } from "@/components/modales";
import Loading from "@/app/loading";
import { createUserSchema } from "@/app/validationSchemas";
import MessageError from "@/components/menssageError";
import CustomDataGrid from "@/components/customDataGrid";
const initialUserEdit: User = {
  cellPhoneNumber: "",
  departmentName: "",
  email: "",
  emailVerified: false,
  generalEntityId: 0,
  id: "",
  lastName: "",
  name: "",
  privacyAuthorization: false,
  realm: "",
  resetKey: "",
  username: "",
  verificationToken: "",
  zoneId: 0,
};

const initialNewUser: Signup = {
  username: "",
  password: "",
  email: "",
  name: "",
  lastName: "",
  cellPhoneNumber: "",
  realm: "",
};

const Users = () => {
  const {
    users,
    updateUser,
    getUsers,
    createUser,
    existingUsernames,
    existingUserEmails,
  } = UseUsers();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserData>({
    resolver: zodResolver(
      createUserSchema(existingUsernames, existingUserEmails)
    ),
  });

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onOpenChange: onOpenChangeEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenExitoModal,
    onOpen: onOpenExitoModal,
    onOpenChange: onOpenChangeExitoModal,
    onClose: onCloseExitoModal,
  } = useDisclosure();

  const {
    isOpen: isOpenErrorModal,
    onOpen: onOpenErrorModal,
    onOpenChange: onOpenChangeErrorModal,
    onClose: onCloseErrorModal,
  } = useDisclosure();

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [userEdit, setUserEdit] = useState<User>(initialUserEdit);
  const [newUser, setNewUser] = useState<Signup>(initialNewUser);
  //const [userDelete, setUserDelete] = useState<>();
  const [isView, setIsView] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const clearInputs = () => {
    setUserEdit(initialUserEdit);
    reset();
  };

  const editUser = async () => {
    setLoading(true);
    if (userEdit.id) {
      try {
        const response = await updateUser(userEdit);

        console.log("Usuario actualizado:", response);
        getUsers();
        setMessage("Usuario actualizado con exito");
        onOpenExitoModal();
        onCloseEdit();
      } catch (error) {
        console.error("Error editando el usuario:", error);
        setMessage("Erro al editar el usuario");
        onOpenErrorModal();
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Usuario no válido");
      setMessage("Usuario no valido");
      onOpenErrorModal();
    }
  };

  const handleButtonClick = (data: User) => {
    console.log(data);
    setUserEdit(data);
    onOpenEdit();
  };

  const buttonDelete = (data: User) => {
    console.log(data);
    setUserEdit(data);
    onOpenDelete();
  };

  interface UserData {
    username: string;
    password: string;
    email: string;
    name: string;
    lastName: string;
    cellPhoneNumber: string;
    realm: string;
  }
  const onSubmit: SubmitHandler<UserData> = async (data) => {
    setLoading(true);
    try {
      console.log(data);
      await createUser(data);
      console.log("Usuario creado exitosamente:", data);
      setMessage("Usuario creado con exito");
      onOpenExitoModal();
      await getUsers();
      onClose();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error("Error creando el usuario:", error);
        setMessage("Error al crear el usuario");
        onOpenErrorModal();
      } else {
        setMessage("Ocurrió un error desconocido. Inténtalo de nuevo.");
      }
      onOpenErrorModal();
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastName",
      headerName: "Apellido",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "username",
      headerName: "Usuario",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "realm",
      headerName: "Perfil",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex justify-center items-center">
          <Button
            color="primary"
            onPress={() => {
              handleButtonClick(params.row);
              setIsView(false);
            }}
          >
            <Image alt="IconoLapiz" src={ICONOLAPIZ} width={20} />
          </Button>
          <Button
            color="primary"
            onPress={() => {
              handleButtonClick(params.row);
              setIsView(true);
            }}
          >
            <Image alt="IconoOjo" src={ICONOOJO} width={20} />
          </Button>
          <Button
            color="primary"
            onPress={() => {
              buttonDelete(params.row);
              setIsView(true);
            }}
          >
            <Image alt="iconoBasurero" src={ICONOBASURERO} width={20} />
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = (username: string) => {
    console.log("Eliminado usuario con ID: ", username);
  };

  return (
    <section className="relative flex-col overflow-hidden h-full">
      {loading && <Loading />}{" "}
      <div className="flex justify-between">
        <h1 className={title()}>Usuarios</h1>
        <Button className="bg-primary text-white" onPress={onOpen}>
          +Agregar usuario
        </Button>
      </div>
      <CustomDataGrid columns={columns} rows={users || []} />
      <Modal
        aria-describedby="user-modal-description"
        aria-labelledby="user-modal-title"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <div className="flex flex-col items-start w-full p-4">
              <ModalHeader className="flex justify-between w-full">
                <h1 className={"text-2xl ${title()}"}>
                  INFORMACIÓN DE USUARIO
                </h1>
              </ModalHeader>

              <ModalBody className="flex w-full mt-4">
                <form
                  className="flex flex-col justify-around h-full"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="flex-grow" />
                  <div className="flex flex-col items-start w-98 ">
                    <div className="flex flex-col mt-2 mb-2 w-96">
                      <div className="flex items-center mt-2 mb-2 w-full">
                        <label className="text-xl font-bold text-nowrap w-1/3">
                          Usuario
                        </label>
                        <Input
                          className="ml-4 w-2/3"
                          disabled={isView}
                          placeholder="Inserta aquí tu usuario"
                          type="text"
                          {...register("username")}
                        />
                      </div>
                      {errors.username && (
                        <MessageError message={errors.username.message} />
                      )}
                    </div>
                    <div className="flex flex-col itms-star w-98">
                      <div className="flex items-center mt-2 mb-2 w-96">
                        <label className="text-xl font-bold text-nowrap w-1/3">
                          Contraseña
                        </label>
                        <Input
                          className="ml-4 w-2/3"
                          disabled={isView}
                          placeholder="Inserta aquí tu contraseña"
                          type="password"
                          {...register("password")}
                        />
                      </div>
                      {errors.password && (
                        <MessageError message={errors.password.message} />
                      )}
                    </div>
                    <div className="flex flex-col itms-star w-98">
                      <div className="flex items-center mt-2 mb-2 w-96">
                        <label className="text-xl font-bold text-nowrap w-1/3">
                          Email
                        </label>
                        <Input
                          className="ml-4 w-2/3"
                          disabled={isView}
                          placeholder="Inserta aquí tu email"
                          type="email"
                          {...register("email")}
                        />
                      </div>
                      {errors.email && (
                        <MessageError message={errors.email.message} />
                      )}
                    </div>
                    <div className="flex flex-col itms-star w-98">
                      <div className="flex items-center mt-2 mb-2 w-96">
                        <label className="text-xl font-bold text-nowrap w-1/3">
                          Nombre
                        </label>
                        <Input
                          className="ml-4 w-2/3"
                          disabled={isView}
                          placeholder="Inserta aquí tu nombre"
                          type="text"
                          {...register("name")}
                        />
                      </div>
                      {errors.name && (
                        <MessageError message={errors.name.message} />
                      )}
                    </div>
                    <div className="flex flex-col itms-star w-98">
                      <div className="flex items-center mt-2 mb-2 w-96">
                        <label className="text-xl font-bold text-nowrap w-1/3">
                          Apellido
                        </label>
                        <Input
                          className="ml-4 w-2/3"
                          disabled={isView}
                          placeholder="Inserta aquí tu apellido"
                          type="text"
                          {...register("lastName")}
                        />
                      </div>
                      {errors.lastName && (
                        <MessageError message={errors.lastName.message} />
                      )}
                    </div>
                    <div className="flex flex-col itms-star w-98">
                      <div className="flex items-center mt-2 mb-2 w-96">
                        <label className="text-xl font-bold text-nowrap w-1/3">
                          Celular
                        </label>
                        <Input
                          className="ml-4 w-2/3"
                          disabled={isView}
                          placeholder="Inserta aquí tu celular"
                          type="text"
                          {...register("cellPhoneNumber")}
                        />
                      </div>
                      {errors.cellPhoneNumber && (
                        <MessageError
                          message={errors.cellPhoneNumber.message}
                        />
                      )}
                    </div>
                    <div className="flex flex-col itms-star w-98">
                      <div className="flex items-center mt-2 mb-2 w-96">
                        <label className="text-xl font-bold text-nowrap w-1/3">
                          Perfil
                        </label>
                        <Select
                          className="ml-4 w-2/3"
                          disabled={isView}
                          placeholder="Selecciona tu rol"
                          variant="faded"
                          {...register("realm")}
                        >
                          {roles.map((rol) => (
                            <SelectItem key={rol.key} value={rol.key}>
                              {rol.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      {errors.realm && (
                        <MessageError message={errors.realm.message} />
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-between w-96 mt-4 ">
                      <Button color="primary" type="submit">
                        Guardar datos
                      </Button>
                      <Button color="primary" onClick={clearInputs}>
                        Limpiar Datos
                      </Button>
                    </div>
                  </div>
                </form>
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
      {/* Modal de Edicion y vista */}
      <Modal
        aria-describedby="user-modal-description"
        aria-labelledby="user-modal-title"
        isOpen={isOpenEdit}
        onOpenChange={onOpenChangeEdit}
      >
        <ModalContent>
          {() => (
            <div className="flex flex-col items-start w-full p-4">
              <ModalHeader className="flex justify-between w-full">
                <h1 className={`text-2xl ${title()}`}>USUARIO</h1>
              </ModalHeader>
              <ModalBody className="flex w-full mt-4">
                <form className="flex flex-grow flex-col items-start w-98">
                  <div className="" />

                  {/* Campos para editar usuario */}
                  <div className="flex items-center mt-2 mb-2 w-full">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Nombre
                    </label>
                    <Input
                      className="ml-4 w-2/3"
                      disabled={isView}
                      placeholder="Inserta aquí tu nombre"
                      type="text"
                      value={userEdit.name}
                      onChange={(e) =>
                        setUserEdit({ ...userEdit, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center mt-2 mb-2 w-96">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Apellido
                    </label>
                    <Input
                      className="ml-4 w-2/3"
                      disabled={isView}
                      placeholder="Inserta aquí tu apellido"
                      type="text"
                      value={userEdit.lastName}
                      onChange={(e) =>
                        setUserEdit({ ...userEdit, lastName: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center mt-2 mb-2 w-96">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Usuario
                    </label>
                    <Input
                      className="ml-4 w-2/3"
                      disabled={isView}
                      placeholder="Inserta aquí tu usuario"
                      type="text"
                      value={userEdit.username}
                      onChange={(e) =>
                        setUserEdit({ ...userEdit, username: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center mt-2 mb-2 w-96">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Email
                    </label>
                    <Input
                      className="ml-4 w-2/3"
                      disabled={isView}
                      placeholder="Inserta aquí tu email"
                      type="email"
                      value={userEdit.email}
                      onChange={(e) =>
                        setUserEdit({ ...userEdit, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center mt-2 mb-2 w-96">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Perfil
                    </label>
                    <Select
                      className="ml-4 w-2/3"
                      disabled={isView}
                      label="Selecciona tu rol"
                      value={userEdit.realm}
                      variant="faded"
                      onChange={(e) =>
                        setUserEdit({ ...userEdit, realm: e.target.value })
                      }
                    >
                      {roles.map((rol) => (
                        <SelectItem key={rol.key} value={rol.key}>
                          {rol.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div
                    className={`flex justify-between w-96 mt-4 ${isView ? "hidden" : ""}`}
                  >
                    <Button color="primary" onClick={editUser}>
                      Guardar datos
                    </Button>
                    <Button color="primary" onClick={clearInputs}>
                      Limpiar Datos
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
      <Modal
        aria-describedby="user-modal-description"
        aria-labelledby="user-modal-title"
        isOpen={isOpenDelete}
        onOpenChange={onOpenChangeDelete}
      >
        <ModalContent>
          <ModalHeader>
            <h1 className={`text-xl ${title()}`}>Eliminar Usuario</h1>
          </ModalHeader>
          <ModalBody>
            <p>
              ¿Está seguro que desea eliminar al usuario:
              <span className="ml-1 font-bold">
                {userEdit.name} {userEdit.lastName}
              </span>
              ?
            </p>
            <div className="flex justify-between ">
              <Button color="primary" type="submit">
                Eliminar
              </Button>
              <Button color="primary" onClick={onCloseDelete}>
                Volver
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ModalError
        message={message}
        modalControl={{
          isOpen: isOpenErrorModal,
          onOpen: onOpenErrorModal,
          onClose: onCloseErrorModal,
          onOpenChange: onOpenChangeErrorModal,
        }}
      />
      <ModalExito
        message={message}
        modalControl={{
          isOpen: isOpenExitoModal,
          onOpen: onOpenExitoModal,
          onClose: onCloseExitoModal,
          onOpenChange: onOpenChangeExitoModal,
        }}
      />
    </section>
  );
};

export default Users;
