"use client";
import React, { useState, useEffect } from "react";
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
import { ModalError, ModalExito } from "@/components/modales";
import Loading from "@/app/loading";

export default function Incomes() {
  const { incomes, getIncomes, updatePlate, setIncomes } = UseIncomes();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

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

  // Inicialización de fechas
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [startDate, setStartDate] = useState(today.toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState(
    today.toISOString().split("T")[1].split(".")[0]
  );
  const [endDate, setEndDate] = useState(tomorrow.toISOString().split("T")[0]);
  const [endTime, setEndTime] = useState(
    today.toISOString().split("T")[1].split(".")[0]
  );

  const handleFilter = () => {
    setLoading(true);
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      console.error("Fechas no válidas");
      setIncomes([]); // Establecer incomes como vacío
      setLoading(false);
      return; // Salir de la función si las fechas no son válidas
    }
    console.log(startDateTime.toISOString(), endDateTime.toISOString());
    getIncomes(startDateTime, endDateTime).finally(() => {
      setLoading(false); // Asegúrate de ocultar el loading al final
    });
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
  const [plateImg, setPlateImg] = useState("");

  const handleButtonClick = (id: string, plate: string, img: string) => {
    console.log(id);
    setVehicleId(id);
    setPlateValue(plate);
    setPlateImg(img);
    onOpen();
  };
  const [message, setMessage] = useState("");

  const editPlate = async () => {
    if (id && plate) {
      setLoading(true); // Comienza el loading
      try {
        await updatePlate(id, plate);
        setPlateValue("");
        setVehicleId(null);
        onClose();
        await getIncomes();
        setMessage("Placa actualizada con éxito");
        onOpenExitoModal();
      } catch (error) {
        console.error("Error editando la placa:", error);
        setMessage("Error editando la placa");
        onOpenErrorModal();
      } finally {
        setLoading(false); // Detiene el loading al final
      }
    } else {
      console.error("ID o placa no válidos");
      setMessage("Placa no válida");
      onOpenErrorModal();
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
      field: "actions",
      headerName: "Acciones",
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex justify-center items-center">
          <Button
            color="primary"
            onPress={() =>
              handleButtonClick(
                params.row.id,
                params.row.plate,
                params.row.plateImage
              )
            }
            disabled={loading} // Deshabilitar el botón mientras está cargando
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

  return (
    <section>
      {loading && <Loading />}{" "}
      {/* Muestra el componente Loading si loading es true */}
      <div className="flex gap-4 justify-between">
        <h1 className={title()}>Entradas</h1>

        <div className="flex w-45 ml-72">
          <div className="flex gap-4 flex-col w-45 ml-64 mr-1">
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
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <input
                  type="time"
                  value={endTime}
                  className="text-sm font-bold border border-gray-300 rounded p-1"
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          className="mr-72 mt-14 ml-5"
          color="primary"
          onClick={handleFilter}
          disabled={loading} // Deshabilitar el botón mientras está cargando
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
                    {/* <Image
                      src={plateImg.replace("C:/", "http://201.184.234.27")}
                      alt="Imagen de Placa"
                      width={100}
                      height={50}
                      className="mb-4"
                    /> */}
                    <Input
                      placeholder="Placa"
                      className="ml-4 w-2/3"
                      type="text"
                      variant="faded"
                      value={plate}
                      onChange={(e) => setPlateValue(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-center w-full mt-4">
                    <Button color="primary" onClick={onClose} className="mr-2">
                      Cancelar
                    </Button>
                    <Button
                      color="primary"
                      onClick={editPlate}
                      disabled={loading}
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
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
      />
      <ModalExito
        modalControl={{
          isOpen: isOpenExitoModal,
          onOpen: onOpenExitoModal,
          onClose: onCloseExitoModal,
          onOpenChange: onOpenChangeExitoModal,
        }}
        message={message}
      />
    </section>
  );
}
