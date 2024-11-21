"use client";
import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { GridColDef } from "@mui/x-data-grid";
import {
  ModalContent,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalBody,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/react";

import UseIncomes from "@/app/parking-payment/hooks/UseIncomes";
import { title } from "@/components/primitives";
import Loading from "@/app/loading"; // Asegúrate de importar tu componente de carga
import CustomDataGrid from "@/components/customDataGrid";

export default function Outcomes() {
  const { incomes, getIncomes } = UseIncomes();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [startTime, setStartTime] = useState(
    new Date().toISOString().split("T")[1].split(".")[0],
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0],
  );
  const [endTime, setEndTime] = useState(
    new Date().toISOString().split("T")[1].split(".")[0],
  );

  const handleFilter = () => {
    setLoading(true); // Inicia el loading
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    console.log(startDateTime.toISOString());

    getIncomes(startDateTime, endDateTime).finally(() => {
      setLoading(false); // Finaliza el loading
    });
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
  ];

  return (
    <section className="relative flex-col overflow-hidden h-full">
      {loading && <Loading />} {/* Mostrar el componente de carga */}
      <div className="flex justify-between">
        <h1 className={title()}>Salidas</h1>

        <div className="flex flex-col w-45 ml-72 ">
          <div className="flex flex-col w-45 ml-64 mr-1">
            <label className="text-base font-bold text-nowrap mb-2 mr-2">
              DESDE
            </label>
            <div className="flex space-x-2">
              <input
                className="text-sm font-bold mr-2 border border-gray-300 rounded p-1"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                className="text-sm font-bold border border-gray-300 rounded p-1"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-45">
              <label className="text-base font-bold text-nowrap mr-2 mb-2">
                HASTA
              </label>
              <div className="flex space-x-2">
                <input
                  className="text-sm font-bold border border-gray-300 rounded p-1"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)} // Manejo de la fecha "Hasta"
                />
                <input
                  className="text-sm font-bold border border-gray-300 rounded p-1"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)} // Manejo de la hora "Hasta"
                />
              </div>
            </div>
          </div>
        </div>
        <Button
          className="bg-primary text-white mr-72 mt-14 ml-5"
          onClick={handleFilter}
        >
          Filtrar
        </Button>
      </div>
      <CustomDataGrid columns={columns} rows={incomes} />
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
                <h1 className={`text-2xl ${title()}`}>Agregar placa</h1>
              </ModalHeader>
              <ModalBody className="flex w-full">
                <div className="flex-grow" />
                <div className="flex flex-col items-center w-full">
                  <div className="flex flex-col items-center w-98">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Placa
                    </label>
                    <Input className="ml-4 w-2/3" placeholder=" " type="text" />
                  </div>
                  <div className="flex justify-center w-full mt-4">
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button onClick={() => console.log("Guardar datos")}>
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
