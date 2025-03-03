"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@nextui-org/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { GridColDef } from "@mui/x-data-grid";
import {
  ModalContent,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalBody,
} from "@nextui-org/modal";
import { Input, Select, SelectItem, Switch } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { title } from "@/components/primitives";
import ICONOLAPIZ from "@/public/iconoLapiz.png";
import ICONOOJO from "@/public/IconoOjo.png";
import Signup from "@/types/Auth";
import User, { initialNewUser, initialUserEdit } from "@/types/User";
import UseUsers from "@/app/hooks/users/UseUsers";
import UseRol from "@/app/hooks/UseRol";
import Loading from "@/app/loading";
import { createUserSchema } from "@/app/schemas/validationSchemas";
import { editUserSchema } from "@/app/schemas/validationSchemas";
import CustomDataGrid from "@/components/customDataGrid";
import withPermission from "@/app/withPermission";
import ActionButton from "@/components/actionButtonProps";
import MessageError from "@/components/menssageError";
import { PencilIcon, LargeEyeIcon } from "@/components/icons";
import UsePermissions from "@/app/hooks/UsePermissions";
import { toast } from "sonner";
import memoTheme from "@mui/material/utils/memoTheme";

export const dynamic = "force-dynamic";

const Users = () => {
  const { roles } = UseRol();
  const [userEdit, setUserEdit] = useState<User>(initialUserEdit);
  const [newUser, setNewUser] = useState<Signup>(initialNewUser);
  const [isView, setIsView] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(userEdit.eliminated);
  const { hasPermission } = UsePermissions();
  const canEditUser = useMemo(() => hasPermission(9), [hasPermission]);
  const canSeeUser = useMemo(() => hasPermission(10), [hasPermission]);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isDark, setIsDark] = useState(false);
  const canCreateUser = useMemo(() => hasPermission(8), [hasPermission]);
  const {
    users,
    updateUser,
    getUsers,
    createUser,
    existingUsernames,
    existingUserEmails,
  } = UseUsers();

  const {
    register,
    handleSubmit,
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
      editUserSchema(
        existingUsernames,
        existingUserEmails,
        userEdit.username,
        userEdit.email
      )
    ),
  });
  useEffect(() => {
    setIsSelected(userEdit.eliminated);
  }, [userEdit.eliminated]);

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onOpenChange: onOpenChangeEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const {
    isOpen: isOpenExitoModal,
    onOpen: onOpenExitoModal,
    onOpenChange: onOpenChangeExitoModal,
    onClose: onCloseExitoModal,
  } = useDisclosure();

  const onEditSubmit: SubmitHandler<UserData> = async (data) => {
    setLoading(true);
    try {
      console.log("Editando usuario con datos:", data);
      const updatedUser = { ...userEdit, ...data, eliminated: isSelected };

      await updateUser(updatedUser);
      console.log("Usuario actualizado exitosamente:", data);
      toast.success("Usuario actualizado con éxito");
      onCloseEdit();
      await getUsers();
    } catch (error) {
      console.error("Error desconocidi:", error);
      toast.error("Ocurrió un error desconocido. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (data: User) => {
    setUserEdit(data);
    editReset(data);
    setIsSelected(data.eliminated);
    setIsView(false);
    onOpenEdit();
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
    eliminated: boolean;
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
        toast.error("Error al crear el usuario");
      } else {
        toast.error("Ocurrió un error desconocido. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef<User>[] = [
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
      minWidth: 250,
      headerName: "Email",

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
      field: "eliminated",
      headerName: "Estado",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span>{params.row.eliminated ? "Inactivo" : "Activo"}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex h-full justify-center items-center w-full overflow-hidden">
          <Button
            className="w-1 h-full p-1 flex items-center"
            color="default"
            variant="light"
            isDisabled={!canEditUser}
            onPress={() => {
              handleButtonClick(params.row);
            }}
          >
            {" "}
            <PencilIcon fill={isDark ? "#FFF" : "#000"} size={24} />
          </Button>

          <Button
            className="w-1 h-full p-1 flex items-center"
            color="default"
            variant="light"
            isDisabled={!canSeeUser}
            onPress={() => {
              handleButtonClick(params.row);
              setIsView(true);
            }}
          >
            <LargeEyeIcon fill={isDark ? "#FFF" : "#000"} size={24} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <section className="relative flex-col overflow-hidden h-full">
      {loading && <Loading />}{" "}
      <div className="flex justify-between">
        <h1 className={title()}>Usuarios</h1>
        {canCreateUser && (
          <Button
            className="z-10 right-0 -bottom-14"
            color="primary"
            style={{
              padding: "8px 16px",
              fontSize: "16px",
              lineHeight: "1.5",
              minHeight: "40px",
            }}
            onPress={onOpen}
          >
            {" "}
            +Agregar usuario{" "}
          </Button>
        )}
      </div>
      <CustomDataGrid columns={columns} rows={users as User[]} />
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
                          placeholder="Digite el usuario"
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
                          placeholder="Digite la contraeña"
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
                          placeholder="Digite el email"
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
                          placeholder="Digite el nombre"
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
                          placeholder="Digite el apellido"
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
        className="p-6 m-8"
        aria-describedby="user-modal-description"
        aria-labelledby="user-modal-title"
        isOpen={isOpenEdit}
        onOpenChange={onOpenChangeEdit}
      >
        <ModalContent>
          {() => (
            <div className="flex flex-col items-start w-full p-4">
              <ModalHeader className="flex justify-between w-full p-0">
                <h1 className="text-center text-2xl font-bold mb-2">
                  Editar Usuario
                </h1>
              </ModalHeader>
              <ModalBody className="flex w-full p-0">
                <hr className="separator mt-0 mb-6 w-full" />
                <form
                  className="flex flex-col space-y-6" // Uniform spacing between inputs
                  onSubmit={handleEditSubmit(onEditSubmit)}
                >
                  {/* Campos para editar usuario */}
                  <div className="flex flex-col w-full">
                    {/* Campo Nombre */}
                    <div className="flex items-center w-full">
                      <label className="text-lg font-bold w-1/3">Nombre</label>
                      <div className="flex flex-col w-2/3">
                        <Input
                          disabled={isView}
                          placeholder="Digite el nombre"
                          type="text"
                          {...editRegister("name")}
                        />
                        <div className="h-6 mt-1">
                          {editErrors.name && (
                            <MessageError message={editErrors.name.message} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Campo Apellido */}
                    <div className="flex items-center w-full">
                      <label className="text-lg font-bold w-1/3">
                        Apellido
                      </label>
                      <div className="flex flex-col w-2/3">
                        <Input
                          disabled={isView}
                          placeholder="Digite el apellido"
                          type="text"
                          {...editRegister("lastName")}
                        />
                        <div className="h-6 mt-1">
                          {editErrors.lastName && (
                            <MessageError
                              message={editErrors.lastName.message}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Campo Usuario */}
                    <div className="flex items-center w-full">
                      <label className="text-lg font-bold w-1/3">Usuario</label>
                      <div className="flex flex-col w-2/3">
                        <Input
                          disabled={isView}
                          placeholder="Digite el usuario"
                          type="text"
                          {...editRegister("username")}
                        />
                        <div className="h-6 mt-1">
                          {editErrors.username && (
                            <MessageError
                              message={editErrors.username.message}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Campo Email */}
                    <div className="flex items-center w-full">
                      <label className="text-lg font-bold w-1/3">Email</label>
                      <div className="flex flex-col w-2/3">
                        <Input
                          disabled={isView}
                          placeholder="Digite el email"
                          type="email"
                          {...editRegister("email")}
                        />
                        <div className="h-6 mt-1">
                          {editErrors.email && (
                            <MessageError message={editErrors.email.message} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Campo Perfil */}
                    <div className="flex items-center w-full">
                      <label className="text-lg font-bold w-1/3">Perfil</label>
                      <div className="flex flex-col w-2/3">
                        <Select
                          className="w-full"
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
                        <div className="h-6 mt-1">
                          {editErrors.realm && (
                            <MessageError message={editErrors.realm.message} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Campo Estado */}
                    {hasPermission(11) && (
                      <div className="flex items-center w-full">
                        <label className="text-lg font-bold w-1/3">
                          Estado
                        </label>
                        <div className="w-2/3 mb-6">
                          <Switch
                            className="w-full"
                            isSelected={!userEdit.eliminated}
                            onValueChange={(value) =>
                              setUserEdit((prev) => ({
                                ...prev,
                                eliminated: !value,
                              }))
                            }
                          >
                            <p className="text-sm text-default-500">
                              {userEdit.eliminated ? "Inactivo" : "Activo"}
                            </p>
                          </Switch>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botón de guardar */}
                  <div className="flex justify-center">
                    <Button variant="ghost" color="primary" type="submit">
                      Guardar datos
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
};

export default withPermission(Users, 1);
