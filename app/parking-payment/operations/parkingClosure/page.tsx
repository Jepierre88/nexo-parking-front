"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { GridColDef } from "@mui/x-data-grid";
import {
  ModalContent,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalBody,
} from "@nextui-org/modal";
import { DateRangePicker, Input } from "@nextui-org/react";
import UseClosure from "@/app/hooks/parking-payment/UseClosure";
import { title } from "@/components/primitives";
import CustomDataGrid from "@/components/customDataGrid";

import withPermission from "@/app/withPermission";
import { LargeEyeIcon, LargeSendIcon, PrinterIcon } from "@/components/icons";
import UsePermissions from "@/app/hooks/UsePermissions";
import Closure from "@/types/Closure";
import { toast } from "sonner";
import { Connector } from "@/app/libs/Printer";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import { Select, SelectItem } from "@nextui-org/select";

function parkingClosure() {
  const { hasPermission } = UsePermissions();
  const { closure, getClosure, loading } = UseClosure();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isDark, setIsDark] = useState(false);
  const canPrinterIncome = useMemo(() => hasPermission(25), [hasPermission]);
  const canSeeClouse = useMemo(() => hasPermission(24), [hasPermission]);
  const canSendClouse = useMemo(() => hasPermission(42), [hasPermission]);

  useEffect(() => {
    getClosure();
  }, []);
  const [dateRange, setDateRange] = useState<any>({
    start: parseAbsoluteToLocal(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 1
      ).toISOString()
    ),
    end: parseAbsoluteToLocal(new Date().toISOString()),
  });
  const columns: GridColDef[] = [
    {
      field: "datetime",
      headerName: "Fecha de cierre",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Realizo el cierre",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "initialConsecutive",
      headerName: "Corte inicial",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "finalConsecutive",
      headerName: "Corte final",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "paymentPoint",
      headerName: "Punto de pago",
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
        <div className="flex justify-center items-center gap-2">
          <Button
            className="w-auto h-auto flex items-center justify-center p-0 min-w-0"
            color="default"
            variant="light"
            isDisabled={!canSeeClouse}
            size="sm"
          >
            <LargeEyeIcon fill={isDark ? "#FFF" : "#000"} />
          </Button>
          <Button
            className="w-auto h-auto flex items-center justify-center p-0 min-w-0"
            color="default"
            radius="none"
            variant="light"
            isDisabled={!canPrinterIncome}
            onPress={() => handlenPrint(params.row)}
          >
            <PrinterIcon
              fill={isDark ? "#000" : "#FFF"}
              stroke={isDark ? "#FFF" : "#000"}
            />
          </Button>
          <Button
            className="w-auto h-auto flex items-center justify-center p-0 min-w-0"
            color="default"
            variant="light"
            isDisabled={!canSendClouse}
          >
            <LargeSendIcon fill={isDark ? "#FFF" : "#000"} />
          </Button>
        </div>
      ),
    },
  ];
  const handlenPrint = async (row: Closure) => {
    const loadingToastId = toast.loading("Imprimiendo ticket de ingreso...");

    try {
      const impresora = new Connector("EPSON");
      await impresora.imprimirCierre(row);
      toast.success("Ticket impreso correctamente.", {
        id: loadingToastId,
      });
    } catch (e) {
      toast.error("Error al imprimir el ticket.", {
        id: loadingToastId,
      });
      console.error("Error al imprimir la factura", e);
    }
  };
  const handleFilter = async () => {
    try {
      if (dateRange.start && dateRange.end) {
        await getClosure(
          dateRange.start.toDate(getLocalTimeZone()),
          dateRange.end.toDate(getLocalTimeZone())
        );
        toast.success("Datos filtrados con éxito.");
      } else {
        toast.error("Por favor selecciona un rango de fechas válido.");
      }
    } catch (error) {
      console.error("Error al filtrar los datos:", error);
      toast.error("Hubo un error al filtrar los datos.");
    }
  };
  return (
    <section className="h-full">
      <h1 className="text-4xl font-bold  h-12 ">Cierres</h1>
      <div className="flex my-4 gap-4 items-end justify-start h-min flex-wrap md:flex-nowrap">
        <div className="flex flex-col items-start">
          <label className=" text-black font-bold">Fecha de cierre:</label>
          <DateRangePicker
            lang="es-ES"
            hideTimeZone
            value={dateRange}
            onChange={setDateRange}
            className="w-[350px] min-w-[350px] max-w-[350px]"
            size="md"
          />
        </div>
        <div className="flex flex-col items-start">
          <label className=" text-black font-bold">Realizó el cierre:</label>
          <Select
            className="w-[320px] min-w-[320px] max-w-[320px] "
            variant="bordered"
            lang="es-ES"
            radius="md"
            size="md"
            classNames={{ trigger: "bg-gray-100" }}
          >
            <SelectItem key="opcion1">Opción 1</SelectItem>
            <SelectItem key="opcion2">Opción 2</SelectItem>
            <SelectItem key="opcion3">Opción 3</SelectItem>
          </Select>
        </div>

        <Button
          className="bg-primary  text-white px-2 py-2 text-sm w-[100px] min-w-0"
          size="md"
          isDisabled={loading}
          variant="shadow"
          onPress={handleFilter}
        >
          Filtrar
        </Button>
      </div>
      <div className="flex items-end flex-col xl:flex-row overflow-hidden -mb-14">
        <div className="flex my-3 justify-end gap-4 items-center h-min flex-wrap md:flex-nowrap w-full">
          <Button
            className="p-6 px-20 bg-primary w-2 text-white"
            color="primary"
            variant="shadow"
          >
            Realizar cierre
          </Button>
          <Button
            className="p-6 px-20 w-2 text-black font-bold"
            color="primary"
            variant="bordered"
          >
            Informe parcial
          </Button>
        </div>
      </div>

      <CustomDataGrid columns={columns} rows={closure} loading={loading} />
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
                <h1 className={`text-2xl ${title()}`}>
                  Esto generará una impresión con los siguientes resúmenes:
                </h1>
              </ModalHeader>
              <ModalBody className="flex w-full">
                <div className="flex-grow" />
                <div className="flex flex-col items-center w-full">
                  <div className="flex flex-col items-center w-98">
                    <label className="text-xl font-bold text-nowrap w-1/3">
                       Transacciones efectivo.
                      <br />
                       Transacciones transferencia.
                      <br />
                       Dinero recibido.
                      <br />
                       Dinero devolución.
                      <br /> Medio de pago.
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
export default withPermission(parkingClosure, 6);
