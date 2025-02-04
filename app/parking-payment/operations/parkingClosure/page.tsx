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
import { PrinterIcon } from "@/components/icons";
import UsePermissions from "@/app/hooks/UsePermissions";
import Closure from "@/types/Closure";
import { toast } from "sonner";
import { Connector } from "@/app/libs/Printer";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";

function parkingClosure() {
  const { hasPermission } = UsePermissions();
  const { closure, getClosure, loading } = UseClosure();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isDark, setIsDark] = useState(false);
  const canPrinterIncome = useMemo(() => hasPermission(25), [hasPermission]);
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
      field: "id",
      headerName: "ID",
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
      field: "initialConsecutive",
      headerName: "Consecutivo inicial",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "finalConsecutive",
      headerName: "Consecutivo final",
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
            className="w-1 h-full p-1 flex items-center"
            color="default"
            radius="none"
            variant="light"
            isDisabled={!canPrinterIncome}
            onPress={() => handlenPrint(params.row)}
          >
            <PrinterIcon
              fill={isDark ? "#000" : "#FFF"}
              size={28}
              stroke={isDark ? "#FFF" : "#000"}
            />
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
      <div className="flex justify-between items-center flex-col xl:flex-row overflow-hidden">
        <h1 className="text-4xl font-bold my-3 h-20 text-center items-center content-center">
          Cierres
        </h1>
        <div className="flex my-3 gap-4 items-center justify-center h-min flex-wrap md:flex-nowrap">
          <DateRangePicker
            lang="es-ES"
            hideTimeZone
            label="Rango de Fechas"
            size="md"
            value={dateRange}
            onChange={setDateRange}
          />
          <Button
            className="bg-primary text-white my-auto"
            size="lg"
            isDisabled={loading}
            variant="shadow"
            onPress={handleFilter}
          >
            Filtrar
          </Button>
        </div>
        <div className="flex my-3 gap-4 items-center justify-center h-min flex-wrap md:flex-nowrap">
          <Button className="p-6 px-16 w-2" color="primary" variant="bordered">
            Informe parcial
          </Button>
          <Button
            className="p-6 px-20 bg-primary w-2 text-white"
            color="primary"
            variant="shadow"
          >
            Realizar cierre
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
