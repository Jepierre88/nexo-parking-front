"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { GridColDef } from "@mui/x-data-grid";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import { DateRangePicker, Input } from "@nextui-org/react";
import { useTheme } from "next-themes";

import { UseTransactions } from "../../../hooks/transactions/Usetransactions";

import { Connector } from "@/app/libs/Printer";
import Invoice from "@/types/Invoice";
import { PrinterIcon } from "@/components/icons";
import CustomDataGrid from "@/components/customDataGrid";
import { title } from "@/components/primitives";
import withPermission from "@/app/withPermission";
import { toast } from "sonner";
import { ActionTooltips, CustomTooltip } from "@/components/customTooltip";

function transaction({ }) {
  ////////////////////////////////////////////////////////////////
  ///////////////FALTA HOOK DE TRANSACCIONES//////////////////////
  ////////////////////////////////////////////////////////////////
  const { transactions, getTransactions, getTransactionForPrint, loading } =
    UseTransactions();
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [plate, setPlate] = useState("");

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

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

  const handleDateRangeChange = (range: any) => {
    setDateRange(range);
  };

  const handleFilter = () => {
    if (dateRange.start && dateRange.end) {
      getTransactions(dateRange.start.toDate(getLocalTimeZone()), plate);
    }
  };

  // const handlePrint = async (id: number) => {
  // 	try {
  // 		// Mantén la tabla sin cargar mientras se imprime la factura
  // 		const factura: Invoice = await getTransactionForPrint(id);
  // 		console.log("Factura:", factura);

  // 		const impresora = new Connector("EPSON");

  // 		toast.promise(impresora.imprimirFacturaTransaccion(factura), {
  // 			success: "Factura impresa correctamente",
  // 			error: "Error al imprimir la factura",
  // 			loading: "Imprimiendo factura...",
  // 		});

  // 		// Notifica al usuario que la impresión se completó
  // 		console.log("Impresión completada con éxito");
  // 	} catch (error) {
  // 		console.error("Error al imprimir la factura:", error);
  // 	}
  // };

  const handlePrint = async (id: number) => {
    const loadingToastId = toast.loading("Imprimiendo factura...");

    try {
      // Obtiene la factura
      const factura: Invoice = await getTransactionForPrint(id);
      console.log("Factura:", factura);

      const impresora = new Connector("EPSON");

      // Intenta imprimir la factura
      impresora
        .imprimirFacturaTransaccion(factura)
        .then(() => {
          // Actualiza la notificación a éxito cuando la impresión termine
          toast.success("Factura impresa correctamente", {
            id: loadingToastId,
          });
          console.log("Impresión completada con éxito");
        })
        .catch((error) => {
          // Actualiza la notificación a error si falla la impresión
          toast.error("Error al imprimir la factura", {
            id: loadingToastId,
          });
          console.error("Error al imprimir la factura:", error);
        });
    } catch (error) {
      console.error("Error al obtener la factura:", error);
      // Actualiza la notificación a error si falla al obtener la factura
      toast.error("Error al obtener la factura para imprimir", {
        id: loadingToastId,
      });
    }
  };

  const columns: GridColDef[] = [
    {
      field: "transactionConcept",
      headerName: "Servicio",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 170,
    },
    {
      field: "datetime",
      headerName: "Fecha",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      valueFormatter: (value) => {
        const date = new Date(value);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hour = String(date.getHours());
        const minute = String(date.getMinutes());
        const second = String(date.getSeconds());

        return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
      },
    },
    {
      field: "identificationMethod",
      headerName: "Tipo",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
    },
    {
      field: "code",
      headerName: "Código",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 150,
    },
    {
      field: "vehicleType",
      headerName: "Vehículo",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
    },
    {
      field: "vehiclePlate",
      headerName: "Placa",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 200,
    },
    {
      field: "vehicleParkingTime",
      headerName: "Tiempo de parqueo",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      renderCell: (params) => (
        <div className="flex h-full justify-center items-center w-full overflow-hidden">
          <CustomTooltip content={ActionTooltips.PRINT}>
            <Button
              color="default"
              radius="none"
              variant="light"
              className="h-full"
              onPress={() => handlePrint(params.row.id)}
            >
              <PrinterIcon
                fill={isDark ? "#000" : "#FFF"}
                size={28}
                stroke={isDark ? "#FFF" : "#000"}
              />
            </Button>
          </CustomTooltip>
        </div>
      ),
    },
  ];

  return (
    <section className="h-full">
      <div className="flex justify-between items-center flex-col xl:flex-row overflow-hidden">
        <h1 className="text-4xl font-bold my-3 h-20 text-center items-center content-center">
          Transacciones
        </h1>
        <div className="flex my-3 gap-4 items-center justify-center h-min flex-wrap md:flex-nowrap">
          <DateRangePicker
            hideTimeZone
            label="Rango de Fechas"
            value={dateRange}
            onChange={handleDateRangeChange}
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
            variant="shadow"
            isDisabled={loading}
            onPress={handleFilter}
          >
            Filtrar
          </Button>
        </div>
      </div>
      <CustomDataGrid
        columns={columns}
        loading={loading}
        rows={transactions || []}
      />
    </section>
  );
}
export default withPermission(transaction, 5);
