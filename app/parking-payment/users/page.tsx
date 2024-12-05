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
import UseRol from "@/app/parking-payment/hooks/UseRol";
import { ModalError, ModalExito } from "@/components/modales";
import Loading from "@/app/loading";
import { createUserSchema } from "@/app/validationSchemas";
import { editUserSchema } from "@/app/validationSchemas";
import MessageError from "@/components/menssageError";
import CustomDataGrid from "@/components/customDataGrid";
import { Preview } from "@mui/icons-material";
import { match } from "assert";
import { error } from "console";
import withPermission from "@/app/withPermission";
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
  permissions: [],
};

const initialNewUser: Signup = {
  username: "",
  password: "",
  email: "",
  name: "",
  lastName: "",
  cellPhoneNumber: "",
  realm: "",
  permissions: [],
};

const Users = () => {
  const { roles } = UseRol();

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
    setValue,
    formState: { errors },
  } = useForm<UserData>({
    resolver: zodResolver(
      createUserSchema(existingUsernames, existingUserEmails)
    ),
  });

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: editReset,
    formState: { errors: editErrors },
  } = useForm<UserData>({
    resolver: zodResolver(
      editUserSchema(existingUsernames, existingUserEmails)
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
  const [isView, setIsView] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onEditSubmit: SubmitHandler<UserData> = async (data) => {
    setLoading(true);
    try {
      console.log("Editando usuario con datos:", data);
      if (userEdit.id) {
        await updateUser({ ...userEdit, ...data });
        console.log("Usuario actualizado exitosamente:", data);
        setMessage("Usuario actualizado con éxito");
        onOpenExitoModal();
        await getUsers();
        onCloseEdit();
      } else {
        throw new Error("id no validoooooooooooo");
      }
    } catch (error) {
      console.error("Error desconocidi:", error);
      setMessage("Ocurrió un error desconocido. Inténtalo de nuevo.");
      onOpenErrorModal();
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (data: User) => {
    setUserEdit(data);
    editReset(data);
    setIsView(false);
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
    permissions: [];
  }
  const onSubmit: SubmitHandler<UserData> = async (data) => {
    setLoading(true);
    try {
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
                          placeholder="Ej: jperez01"
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
                          placeholder="Mínimo 8 caracteres"
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
                          placeholder="Ej: jperez01@gmail.com"
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
                          placeholder="Ej: Juan Felipe"
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
                          placeholder="Ej: Pérez"
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
                          placeholder="Digite el número celular"
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
                          placeholder="Seleccione el rol"
                          variant="faded"
                          {...register("realm")}
                          onChange={(e) => setValue("realm", e.target.value)}
                        >
                          {roles.length > 0 ? (
                            roles.map((rol) => (
                              <SelectItem key={rol.name} value={rol.name}>
                                {rol.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem key="cargando" value="">
                              Cargando roles...
                            </SelectItem>
                          )}
                        </Select>
                      </div>
                      {errors.realm && (
                        <MessageError message={errors.realm.message} />
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-center w-96 mt-4 ">
                      <Button color="primary" type="submit">
                        Guardar datos
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
                <form
                  className="flex flex-grow flex-col items-start w-98"
                  onSubmit={handleEditSubmit(onEditSubmit)}
                >
                  <div className="flex-grow" />

                  {/* Campos para editar usuario */}
                  <div className="flex flex-col itms-star w-98">
                    <div className="flex flex-col mt-2 mb-2 w-96">
                      <div className="flex items-center mt-2 mb-2 w-96">
                        <label className="text-xl font-bold text-nowrap w-1/3">
                          Nombre
                        </label>
                        <Input
                          className="ml-4 w-2/3"
                          disabled={isView}
                          placeholder="Digite aquí el nombre"
                          type="text"
                          {...editRegister("name")}
                        />
                      </div>
                      {editErrors.name && (
                        <MessageError message={editErrors.name.message} />
                      )}
                    </div>
                    <div className="flex items-center mt-2 mb-2 w-96">
                      <label className="text-xl font-bold text-nowrap w-1/3">
                        Apellido
                      </label>
                      <Input
                        className="ml-4 w-2/3"
                        disabled={isView}
                        placeholder="Digite aquí el apellido"
                        type="text"
                        {...editRegister("lastName")}
                      />
                    </div>
                    {editErrors.lastName && (
                      <MessageError message={editErrors.lastName.message} />
                    )}
                    <div className="flex items-center mt-2 mb-2 w-96">
                      <label className="text-xl font-bold text-nowrap w-1/3">
                        Usuario
                      </label>
                      <Input
                        className="ml-4 w-2/3"
                        disabled={isView}
                        placeholder="Digite aquí el usuario"
                        type="text"
                        {...editRegister("username")}
                      />
                    </div>
                    {editErrors.username && (
                      <MessageError message={editErrors.username.message} />
                    )}
                    <div className="flex items-center mt-2 mb-2 w-96">
                      <label className="text-xl font-bold text-nowrap w-1/3">
                        Email
                      </label>
                      <Input
                        className="ml-4 w-2/3"
                        disabled={isView}
                        placeholder="Digite aquí el email"
                        type="email"
                        {...editRegister("email")}
                      />
                    </div>
                    {editErrors.email && (
                      <MessageError message={editErrors.email.message} />
                    )}
                    <div className="flex items-center mt-2 mb-2 w-96">
                      <label className="text-xl font-bold text-nowrap w-1/3">
                        Perfil
                      </label>
                      <Select
                        className="ml-4 w-2/3"
                        isDisabled={isView}
                        placeholder="Seleccione el Rol"
                        variant="faded"
                        {...editRegister("realm")}
                      >
                        {roles.length > 0 ? (
                          roles.map((rol) => (
                            <SelectItem key={rol.name} value={rol.name}>
                              {rol.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem key="cargando" value="">
                            Cargando roles...
                          </SelectItem>
                        )}
                      </Select>
                    </div>
                    {editErrors.realm && (
                      <MessageError message={editErrors.realm.message} />
                    )}

                    <div
                      className={`flex justify-center w-96 mt-4 ${isView ? "hidden" : ""}`}
                    >
                      <Button color="primary" type="submit">
                        Guardar datos
                      </Button>
                    </div>
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

export default withPermission(Users, 1);
