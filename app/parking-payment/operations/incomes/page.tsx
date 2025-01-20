"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { GridColDef } from "@mui/x-data-grid";
import { DateRangePicker, Input } from "@nextui-org/react";
import { useTheme } from "next-themes";

import UseIncomes from "@/app/hooks/incomes/UseIncomes";
import CustomDataGrid from "@/components/customDataGrid";
import { PencilIcon, PrinterIcon } from "@/components/icons";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import withPermission from "@/app/withPermission";
import { Connector } from "@/app/libs/Printer";
import Income from "@/types/Income";
import { toast } from "sonner";

function Incomes() {
  const { incomes, getIncomes, updatePlate, loading } = UseIncomes();
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  // Rango de Fechas
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

  const [plate, setPlate] = useState("");

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const handleFilter = () => {
    if (dateRange.start && dateRange.end) {
      getIncomes(
        dateRange.start.toDate(getLocalTimeZone()),
        dateRange.end.toDate(getLocalTimeZone()),
        plate
      );
    }
  };

  // Configuración de columnas para DataGrid
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
            className="w-1 h-full p-1 flex items-center"
            disabled={loading}
            radius="none"
            color="default"
            variant="light"
          >
            <PencilIcon fill={isDark ? "#FFF" : "#000"} size={24} />
          </Button>
          <Button
            className="w-1 h-full p-1 flex items-center"
            color="default"
            radius="none"
            variant="light"
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

  const handlenPrint = async (row: Income) => {
    const loadingToastId = toast.loading("Imprimiendo ticket de ingreso...");

    try {
      const impresora = new Connector("EPSON");
      await impresora.imprimirIngreso(row);
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

  return (
    <section className="h-full">
      <div className="flex justify-between items-center flex-col xl:flex-row overflow-hidden">
        <h1 className="text-4xl font-bold my-3 h-20 text-center items-center content-center">
          Entradas
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
            onPress={() => {}}
          >
            Filtrar
          </Button>
        </div>
      </div>
      <CustomDataGrid columns={columns} loading={loading} rows={incomes} />
    </section>
  );
}

export default withPermission(Incomes, 2);
