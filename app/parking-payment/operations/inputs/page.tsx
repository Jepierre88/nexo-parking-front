"use client";
import React, { useState } from "react";
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import ICONOLAPIZ from "@/public/iconoLapiz.png";
import ICONOIMPRESORA from "@/public/IconoImpresora.png";
import Image from "next/image";
import { UserData } from "@/types";
import UseIncomes from "@/app/parking-payment/hooks/UseIncomes";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { printInvoice } from "@/app/libs/utils";
import {
  ModalContent,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalBody,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/react";

const handleClick = () => {
  console.log("Click");
};

export default function Incomes({
  userData,
  setUserData,
}: {
  userData: UserData;
  setUserData: (userdata: UserData) => void;
}) {
  const { incomes, getIncomes, updatePlate, setIncomes } = UseIncomes();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const handleFilter = () => {
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      console.error("Fechas no válidas");
      setIncomes([]); // Establecer incomes como vacío
      return; // Salir de la función si las fechas no son válidas
    }
    console.log(startDateTime.toISOString(), endDateTime.toISOString());
    getIncomes(startDateTime, endDateTime);
  };

  const handleClickPrint = async () => {
    try {
      printInvoice();
    } catch (error) {
      console.error(error);
    }
  };

  const [plate, setPlateValue] = useState("");
  const [id, setVehicleId] = useState<string | null>(null);

  const handleButtonClick = (id: string, currentPlate: string) => {
    console.log(id);
    setVehicleId(id);
    setPlateValue(currentPlate);
    onOpen();
  };

  const editPlate = async () => {
    if (id && plate) {
      try {
        await updatePlate(id, plate);
        setPlateValue("");
        setVehicleId(null);
        onClose();
        await getIncomes();
      } catch (error) {
        console.error("Error editando la placa:", error);
      }
    } else {
      console.error("ID o placa no válidos");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "datetime",
      headerName: "Fecha",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "identificationMethod",
      headerName: "Tipo",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "identificationId",
      headerName: "Código",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "vehicleKind",
      headerName: "Tipo V",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "plate",
      headerName: "Placa",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "plateImage",
      headerName: "Imagen",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Acciones",
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex justify-center items-center">
          <Button
            color="primary"
            onPress={() =>
              handleButtonClick(params.row.id, params.row.currentPlate)
            }
          >
            <Image src={ICONOLAPIZ} alt="IconoLapiz" width={20} />
          </Button>
          <Button color="primary" onClick={handleClickPrint}>
            <Image src={ICONOIMPRESORA} alt="IconoImpresora" width={20} />
          </Button>
        </div>
      ),
    },
  ];

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState(
    new Date().toISOString().split("T")[1].split(".")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0]
  );
  const [endTime, setEndTime] = useState(
    new Date().toISOString().split("T")[1].split(".")[0]
  );
  return (
    <section>
      <div className="flex justify-between">
        <h1 className={title()}>Entradas</h1>

        <div className="flex flex-col w-45 ml-72">
          <div className="flex flex-col w-45 ml-64 mr-1">
            <label className="text-base font-bold text-nowrap mb-2 mr-2">
              DESDE
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={startDate}
                className="text-sm font-bold mr-2 border border-gray-300 rounded p-1"
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="time"
                value={startTime}
                className="text-sm font-bold border border-gray-300 rounded p-1"
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-45">
              <label className="text-base font-bold text-nowrap mr-2 mb-2">
                HASTA
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={endDate}
                  className="text-sm font-bold border border-gray-300 rounded p-1"
                  onChange={(e) => setEndDate(e.target.value)} // Manejo de la fecha "Hasta"
                />
                <input
                  type="time"
                  value={endTime}
                  className="text-sm font-bold border border-gray-300 rounded p-1"
                  onChange={(e) => setEndTime(e.target.value)} // Manejo de la hora "Hasta"
                />
              </div>
            </div>
          </div>
        </div>
        <Button
          className="mr-72 mt-14 ml-5"
          color="primary"
          onClick={handleFilter}
          onPress={handleFilter}
        >
          Filtrar
        </Button>
      </div>
      <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
        <DataGrid
          sx={{ backgroundColor: "white" }}
          rows={incomes || []}
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
                <h1 className={`text-2xl ${title()}`}>Agregar placa</h1>
              </ModalHeader>
              <ModalBody className="flex w-full">
                <div className="flex-grow" />
                <div className="flex flex-col items-center w-full">
                  <div className="flex flex-col items-center w-98">
                    <Input
                      placeholder=" "
                      className="ml-4 w-2/3"
                      type="text"
                      value={plate}
                      onChange={(e) => setPlateValue(e.target.value)} // Manejo del input
                    />
                  </div>
                  <div className="flex justify-center w-full mt-4">
                    <Button color="primary" onClick={onClose} className="mr-2">
                      Cancelar
                    </Button>
                    <Button color="primary" onClick={editPlate}>
                      Guardar
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
}
