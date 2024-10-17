"use client";
import { useState } from "react";
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import ICONOLAPIZ from "@/public/iconoLapiz.png";
import ICONOOJO from "@/public/IconoOjo.png";
import Image from "next/image";
import { Signup, User, UserData } from "@/types";
import UseUsers from "@/app/parking-payment/hooks/UseUsers";
import { SubmitHandler, useForm } from "react-hook-form";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  ModalContent,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalBody,
} from "@nextui-org/modal";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { roles } from "@/app/utils/data";
import { ModalError } from "@/components/modales";

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

const Users = ({
  userData,
  setUserData,
}: {
  userData: UserData;
  setUserData: (userdata: UserData) => void;
}) => {
  const { users, updateUser, getUsers, createUser, isUserDataUnique } =
    UseUsers();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm<UserData>();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onOpenChange: onOpenChangeEdit,
    onClose: onCloseEdit,
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
  const [isView, setIsView] = useState(false);
  const [message, setMessage] = useState("");

  const clearInputs = () => {
    setUserEdit(initialUserEdit);
  };

  const editUser = async () => {
    if (userEdit.id) {
      try {
        const response = await updateUser(userEdit);
        console.log("Usuario actualizado:", response);
        clearInputs();
        onCloseEdit();
        await getUsers();
      } catch (error) {
        console.error("Error editando el usuario:", error);
      }
    } else {
      console.error("Usuario no válido");
    }
  };

  const handleButtonClick = (data: User) => {
    setUserEdit(data);
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
  }
  const onSubmit: SubmitHandler<UserData> = async (data) => {
    if (
      isUserDataUnique({ username: data.username, email: data.email }, users)
    ) {
      const newUser = await createUser({
        username: data.username,
        password: data.password,
        email: data.email,
        name: data.name,
        lastName: data.lastName,
        cellPhoneNumber: data.cellPhoneNumber,
        realm: data.realm,
      });

      console.log("Usuario creado exitosamente:", newUser);
      await getUsers();
      onClose();
    } else {
      setMessage("Usuario ya existe");
      onOpenErrorModal();
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
            <Image src={ICONOLAPIZ} alt="IconoLapiz" width={20} />
          </Button>
          <Button
            color="primary"
            onPress={() => {
              handleButtonClick(params.row);
              setIsView(true);
            }}
          >
            <Image src={ICONOOJO} alt="IconoOjo" width={20} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <section>
      <div className="flex justify-between">
        <h1 className={title()}>Usuarios</h1>
        <Button className="bg-primary text-white" onPress={onOpen}>
          +Agregar usuario
        </Button>
      </div>

      <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
        <DataGrid
          sx={{ backgroundColor: "white" }}
          rows={users || []}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>

      {/* Modal para agregar usuario */}
      <Modal
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        aria-labelledby="user-modal-title"
        aria-describedby="user-modal-description"
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
                    <div className="flex items-center mt-2 mb-2 w-full">
                      <label className="text-xl font-bold text-nowrap w-1/3">
                        Usuario
                      </label>
                      <Input
                        label={"Inserta aquí tu usuario"}
                        className="ml-4 w-2/3"
                        variant="faded"
                        {...register("username", { required: true })}
                      />
                    </div>
                    <div className="flex items-center mt-2 mb-2 w-96">
                      <label className="text-xl font-bold text-nowrap w-1/3">
                        Contraseña
                      </label>
                      <Input
                        label="Inserta aquí tu contraseña"
                        className="ml-4 w-2/3"
                        type="password"
                        variant="faded"
                        {...register("password", { required: true })}
                      />
                    </div>
                    <div className="flex items-center mt-2 mb-2 w-96">
                      <label className="text-xl font-bold text-nowrap w-1/3">
                        Email
                      </label>
                      <Input
                        label="Inserta aquí tu email"
                        className="ml-4 w-2/3"
                        type="email"
                        variant="faded"
                        {...register("email", { required: true })}
                      />
                    </div>
                    <div className="flex items-center mt-2 mb-2 w-96">
                      <label className="text-xl font-bold text-nowrap w-1/3">
                        Nombre
                      </label>
                      <Input
                        label="Inserta aquí tu nombre"
                        className="ml-4 w-2/3"
                        type="text"
                        variant="faded"
                        {...register("name", { required: true })}
                      />
                    </div>
                    <div className="flex items-center mt-2 mb-2 w-96">
                      <label className="text-xl font-bold text-nowrap w-1/3">
                        Apellido
                      </label>
                      <Input
                        label="Inserta aquí tu apellido"
                        className="ml-4 w-2/3"
                        type="text"
                        variant="faded"
                        {...register("lastName", { required: true })}
                      />
                    </div>
                    <div className="flex items-center mt-2 mb-2 w-96">
                      <label className="text-xl font-bold text-nowrap w-1/3">
                        Celular
                      </label>
                      <Input
                        label="Inserta aquí tu celular"
                        className="ml-4 w-2/3"
                        type="text"
                        variant="faded"
                        {...register("cellPhoneNumber", { required: true })}
                      />
                    </div>
                    <div className="flex items-center mt-2 mb-2 w-96">
                      <label className="text-xl font-bold text-nowrap w-1/3">
                        Perfil
                      </label>
                      <Select
                        variant="faded"
                        label="Selecciona tu rol"
                        className="ml-4 w-2/3"
                        {...register("realm", { required: false })}
                      >
                        {roles.map((rol) => {
                          return (
                            <SelectItem key={rol.key}>{rol.label}</SelectItem>
                          );
                        })}
                      </Select>
                    </div>
                    <div className="flex justify-between w-96 mt-4 ">
                      <Button color="primary" type="submit">
                        Guardar datos
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => console.log("Limpiar Datos")}
                      >
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
        onOpenChange={onOpenChangeEdit}
        isOpen={isOpenEdit}
        aria-labelledby="user-modal-title"
        aria-describedby="user-modal-description"
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
                      placeholder="Inserta aquí tu nombre"
                      className="ml-4 w-2/3"
                      type="text"
                      value={userEdit.name}
                      onChange={(e) =>
                        setUserEdit({ ...userEdit, name: e.target.value })
                      }
                      disabled={isView}
                    />
                  </div>
                  <div className="flex items-center mt-2 mb-2 w-96">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Apellido
                    </label>
                    <Input
                      placeholder="Inserta aquí tu apellido"
                      className="ml-4 w-2/3"
                      type="text"
                      value={userEdit.lastName}
                      onChange={(e) =>
                        setUserEdit({ ...userEdit, lastName: e.target.value })
                      }
                      disabled={isView}
                    />
                  </div>
                  <div className="flex items-center mt-2 mb-2 w-96">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Usuario
                    </label>
                    <Input
                      placeholder="Inserta aquí tu usuario"
                      className="ml-4 w-2/3"
                      type="text"
                      value={userEdit.username}
                      onChange={(e) =>
                        setUserEdit({ ...userEdit, username: e.target.value })
                      }
                      disabled={isView}
                    />
                  </div>
                  <div className="flex items-center mt-2 mb-2 w-96">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Email
                    </label>
                    <Input
                      placeholder="Inserta aquí tu email"
                      className="ml-4 w-2/3"
                      type="email"
                      value={userEdit.email}
                      onChange={(e) =>
                        setUserEdit({ ...userEdit, email: e.target.value })
                      }
                      disabled={isView}
                    />
                  </div>
                  <div className="flex items-center mt-2 mb-2 w-96">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Perfil
                    </label>
                    <Select
                      variant="faded"
                      label="Selecciona tu rol"
                      className="ml-4 w-2/3"
                      value={userEdit.realm}
                      onChange={(e) =>
                        setUserEdit({ ...userEdit, realm: e.target.value })
                      }
                    >
                      {roles.map((rol) => {
                        return (
                          <SelectItem key={rol.key}>{rol.label}</SelectItem>
                        );
                      })}
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
      <ModalError
        modalControl={{
          isOpen: isOpenErrorModal,
          onOpen: onOpenErrorModal,
          onClose: onCloseErrorModal,
          onOpenChange: onOpenChangeErrorModal,
        }}
        message={message}
      ></ModalError>
      {/* <ModalExito
        modalControl={{
          isOpen: isOpenErrorModal,
          onOpen: onOpenErrorModal,
          onClose: onCloseErrorModal,
          onOpenChange: onOpenChangeErrorModal,
        }}
        message={message}
      ></ModalExito> */}
    </section>
  );
};

export default Users;
