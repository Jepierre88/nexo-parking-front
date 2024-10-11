"use client";
import { useState } from "react";
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import ICONOLAPIZ from "@/public/iconoLapiz.png";
import ICONOOJO from "@/public/IconoOjo.png";
import Image from "next/image";
import { UserData } from "@/types";
import UseUsers from "@/app/parking-payment/hooks/UseUsers";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  ModalContent,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalBody,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/react";

const Users = ({
  userData,
  setUserData,
}: {
  userData: UserData;
  setUserData: (userdata: UserData) => void;
}) => {
  const { users } = UseUsers();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

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
          <Button className="bg-primary text-white">
            <Image src={ICONOLAPIZ} alt="IconoLapiz" width={20} />
          </Button>
          <Button className="bg-primary text-white">
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
        <Button className="bg-primary text-white" onPress={() => onOpen()}>
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
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        />
      </div>

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
                <h1 className={`text-2xl ${title()}`}>
                  INFORMACIÓN DE USUARIO
                </h1>
              </ModalHeader>

              <ModalBody className="flex w-full mt-4">
                <div className="flex-grow" />

                <div className="flex flex-col items-start w-98 ">
                  <div className="flex items-center mt-2 mb-2 w-full">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Usuario
                    </label>
                    <Input
                      placeholder="Inserta aquí tu usuario"
                      className="ml-4 w-2/3"
                      type="text"
                    />
                  </div>
                  <div className="flex items-center mt-2 mb-2 w-96">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Contraseña
                    </label>
                    <Input
                      placeholder="Inserta aquí tu contraseña"
                      className="ml-4 w-2/3"
                      type="password"
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
                    />
                  </div>
                  <div className="flex items-center mt-2 mb-2 w-96">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Nombre
                    </label>
                    <Input
                      placeholder="Inserta aquí tu nombre"
                      className="ml-4 w-2/3"
                      type="text"
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
                    />
                  </div>
                  <div className="flex items-center mt-2 mb-2 w-96">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Celular
                    </label>
                    <Input
                      placeholder="Inserta aquí tu celular"
                      className="ml-4 w-2/3"
                      type="text"
                    />
                  </div>
                  <div className="flex items-center mt-2 mb-2 w-96">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Perfil
                    </label>
                    <select className="ml-4 w-2/3 border rounded p-2">
                      <option value=""> </option>
                      <option value="admin">Admin</option>
                      <option value="user">Usuario</option>
                      <option value="guest">Invitado</option>
                    </select>
                  </div>
                  <div className="flex justify-between w-96 mt-4 ">
                    <Button
                      color="primary"
                      onClick={() => console.log("Guardar datos")}
                    >
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
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
};

export default Users;
