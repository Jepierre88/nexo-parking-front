"use client";
import React, { useState, useEffect } from "react";
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
import { useTheme } from "next-themes";

import { title } from "@/components/primitives";
import UseIncomes from "@/app/parking-payment/hooks/UseIncomes";
import { ModalError, ModalExito } from "@/components/modales";
import CustomDataGrid from "@/components/customDataGrid";
import { Connector } from "@/app/libs/Printer";
import { PencilIcon, PrinterIcon } from "@/components/icons";

export default function Incomes() {
  const { incomes, getIncomes, updatePlate, setIncomes, loading } =
    UseIncomes();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

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

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  // Inicialización de fechas
  const today = new Date();
  const tomorrow = new Date();

  tomorrow.setDate(today.getDate() + 1);

  const [startDate, setStartDate] = useState(today.toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState(
    today.toISOString().split("T")[1].split(".")[0],
  );
  const [endDate, setEndDate] = useState(tomorrow.toISOString().split("T")[0]);
  const [endTime, setEndTime] = useState(
    today.toISOString().split("T")[1].split(".")[0],
  );

  const handleFilter = () => {
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      console.error("Fechas no válidas");
      setIncomes([]);

      return;
    }
    console.log(startDateTime.toISOString(), endDateTime.toISOString());
    getIncomes(startDateTime, endDateTime);
  };

  const handleClickPrint = async (row: any) => {
    const conec = new Connector("EPSON");

    conec.agregarOperacion("text", "richar hola");
    conec.agregarOperacion("text", "coins");
    conec.imprimir();
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
      try {
        await updatePlate(id, plate);
        setPlateValue("");
        setVehicleId(null);
        onClose();
        setMessage("Placa actualizada con éxito");
        onOpenExitoModal();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await getIncomes();
      } catch (error) {
        console.error("Error editando la placa:", error);
        setMessage("Error editando la placa");
        onOpenErrorModal();
      }
    } else {
      console.error("ID o placa no válidos");
      setMessage("Placa no válida");
      onOpenErrorModal();
    }
  };

  const buttonDelete = () => {
    onOpenDelete();
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
      minWidth: 300,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      align: "center",
      renderCell: (params) => (
        <div className="flex h-full justify-center items-center w-full overflow-hidden">
          <Button
            className="w-1 h-full p-1 flex items-center" // Controla ancho y alto
            color="default"
            disabled={loading}
            radius="none"
            variant="light"
            onPress={() =>
              handleButtonClick(
                params.row.id,
                params.row.plate,
                params.row.plateImage,
              )
            }
          >
            <PencilIcon fill={isDark ? "#FFF" : "#000"} size={24} />
          </Button>
          <Button
            className="w-1 h-full p-1 flex items-center" // Controla ancho y alto
            color="default"
            radius="none"
            variant="light"
            onClick={() => handleClickPrint(params.row)}
          >
            <PrinterIcon
              fill={isDark ? "#000" : "#FFF"}
              size={28}
              stroke={isDark ? "#FFF" : "#000"}
            />
          </Button>
          <Button
            className="w-1 h-full p-1" // Controla ancho y alto
            color="default"
            radius="none"
            variant="light"
            onClick={() => buttonDelete()}
          >
            <PencilIcon fill={isDark ? "#FFF" : "#000"} size={24} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <section className="relative flex-col overflow-hidden h-full">
      <div className="flex gap-4 justify-between">
        <h1 className={title()}>Entradas</h1>

        <div className="flex">
          <div className="flex gap-4 flex-col w-45 mr-1">
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
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <input
                  className="text-sm font-bold border border-gray-300 rounded p-1"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button
            className=" my-auto "
            color="primary"
            disabled={loading} // Deshabilitar el botón mientras está cargando
            onClick={handleFilter}
          >
            Filtrar
          </Button>
        </div>
      </div>
      <CustomDataGrid columns={columns} loading={loading} rows={incomes} />
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
                    <Input
                      className="ml-4 w-2/3"
                      placeholder="Placa"
                      type="text"
                      value={plate}
                      variant="faded"
                      onChange={(e) => setPlateValue(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-center w-full mt-4">
                    <Button
                      color="primary"
                      disabled={loading}
                      onClick={editPlate}
                    >
                      Guardar
                    </Button>
                    <Button className="mr-2" color="primary" onClick={onClose}>
                      Cancelar
                    </Button>
                  </div>
                </div>
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
            <h1 className={`text-xl ${title()}`}>Eliminar Ingreso</h1>
          </ModalHeader>
          <ModalBody>
            <p>
              ¿Está seguro que desea eliminar el ingreso de la placa:
              <span className="ml-1 font-bold">{plate}</span>?
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
}
