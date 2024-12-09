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
  ModalFooter,
} from "@nextui-org/modal";
import { DatePicker, DateValue, Input } from "@nextui-org/react";
import { useTheme } from "next-themes";

import { title } from "@/components/primitives";
import UseIncomes from "@/app/hooks/incomes/UseIncomes";
import { ModalError, ModalExito } from "@/components/modales";
import CustomDataGrid from "@/components/customDataGrid";
import { Connector } from "@/app/libs/Printer";
import { PencilIcon, PrinterIcon } from "@/components/icons";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import Income from "@/types/Income";
import withPermission from "@/app/withPermission";

function Incomes() {
  const { incomes, getIncomes, updatePlate, loading } = UseIncomes();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  let [startDatetime, setStartDatetime] = useState<DateValue>(
    parseAbsoluteToLocal(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 1, // Resta un día
        0, // Hora
        0, // Minuto
        0, // Segundo
        0 // Milisegundo
      ).toISOString()
    )
  );
  let [endDatetime, setEndDatetime] = useState<DateValue>(
    parseAbsoluteToLocal(new Date().toISOString())
  );

  const [plate, setPlate] = useState("");
  const [id, setVehicleId] = useState<string | null>(null);
  const [plateImg, setPlateImg] = useState("");

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

  const handleFilter = () => {
    getIncomes(
      startDatetime.toDate(getLocalTimeZone()),
      endDatetime.toDate(getLocalTimeZone()),
      plate
    );
  };

  const handleClickPrint = async (row: Income) => {
    try {
      const impresora = new Connector("EPSON");
      await impresora.imprimirIngreso(row); // Llamada a la impresión
    } catch (error) {
      console.error("Error imprimiendo la factura:", error);
    }
  };
  const handleButtonClick = (id: string, plate: string, img: string) => {
    console.log(id);
    setVehicleId(id);
    setPlate(plate);
    setPlateImg(img);
    onOpen();
  };
  const [message, setMessage] = useState("");

  const editPlate = async () => {
    if (id && plate) {
      try {
        await updatePlate(id, plate);
        setPlate("");
        setVehicleId(null);
        onClose();
        setMessage("Placa actualizada con éxito");
        onOpenExitoModal();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await getIncomes(
          startDatetime.toDate(getLocalTimeZone()),
          endDatetime.toDate(getLocalTimeZone()),
          plate
        );
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
            disabled={loading}
            radius="none"
            color="default"
            variant="light"
            onPress={() =>
              handleButtonClick(
                params.row.id,
                params.row.plate,
                params.row.plateImage
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
    <section className="h-full">
      <div className="flex justify-between items-center flex-col xl:flex-row overflow-hidden">
        <h1 className="text-4xl font-bold my-3 h-20 text-center items-center content-center">
          Entradas
        </h1>

        <div className="flex my-3 gap-4 items-center justify-center h-min flex-wrap md:flex-nowrap">
          <DatePicker
            hideTimeZone
            showMonthAndYearPickers
            className="text-sm"
            lang="es-ES"
            label={"Desde"}
            size="md"
            value={startDatetime}
            onChange={setStartDatetime}
          />
          <DatePicker
            hideTimeZone
            showMonthAndYearPickers
            className="text-sm"
            label={"Hasta"}
            lang="es-ES"
            size="md"
            value={endDatetime}
            onChange={setEndDatetime}
          />
          <Input
            label={"Placa"}
            maxLength={6}
            size="md"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
          />
          <Button
            className="bg-primary text-white my-auto"
            size="lg"
            isDisabled={loading}
            variant="shadow"
            onClick={handleFilter}
            onPress={handleFilter}
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
                <div className="flex flex-col items-center w-98">
                  <Input
                    className="ml-4 w-2/3"
                    placeholder="Placa"
                    type="text"
                    value={plate}
                    variant="faded"
                    onChange={(e) => setPlate(e.target.value)}
                  />
                </div>
              </ModalBody>
              <ModalFooter className="w-full">
                <div className="flex justify-around w-full mt-4">
                  <Button
                    color="primary"
                    disabled={loading}
                    onClick={editPlate}
                  >
                    Guardar
                  </Button>
                  <Button className="mr-2" color="danger" onClick={onClose}>
                    Cancelar
                  </Button>
                </div>
              </ModalFooter>
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

export default withPermission(Incomes, 2);
