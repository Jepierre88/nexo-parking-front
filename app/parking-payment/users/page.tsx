"use client";
import { useState } from "react";
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import IMGDESCARGA from "@/public/descarga.png";
import ICONOLAPIZ from "@/public/iconoLapiz.png";
import ICONOOJO from "@/public/IconoOjo.png";
import Image from "next/image";
import { UserData } from "@/types";
import UseUsers from "@/app/parking-payment/hooks/UseUsers";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ModalContent, useDisclosure } from "@nextui-org/modal";
import { Modal } from "@mui/material";

const handleClick = () => {
  console.log('Click');
};

export default function Users({
  userData,
  setUserData,
}: {
  userData: UserData;
  setUserData: (userdata: UserData) => void;
}) {
  const { users } = UseUsers();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();


  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre', flex: 1, headerAlign: 'center', align:"center" },
    { field: 'lastName', headerName: 'Apellido', flex: 1, headerAlign: 'center', align:"center" },
    { field: 'username', headerName: 'Usuario', flex: 1, headerAlign: 'center', align:"center" },
    { field: 'email', headerName: 'Email', flex: 1, headerAlign: 'center', align:"center" },
    { field: 'realm', headerName: 'Perfil', flex: 1, headerAlign: 'center', align:"center" },
    {
      field: 'actions',
      headerName: 'Acciones',
      
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex justify-center items-center " >
        <Button  onClick={handleClick}>
          <Image src={ICONOLAPIZ} alt="IconoLapiz" width={20}/>
        </Button>
        <Button  onClick={handleClick} >
          <Image src={ICONOOJO} alt="IconoOjo" width={20}/>
        </Button>
        </div>
      ),
    },
  ];


  return (
    <section>
      <div className="flex justify-between">
      <h1 className={title()}>Usuarios</h1>
      <Button className="flex justify items-center " onPress={onOpen}>Open Modal</Button>
      </div>
      <div style={{ height: 400, width: '100%', marginTop: "20px" }}>
        <DataGrid
        sx={{backgroundColor: "white"}}
          rows={users || []} 
          columns={columns}
          pagination 
          paginationModel={paginationModel} 
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]} 
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
        />
      </div>

    </section>
  );
}
