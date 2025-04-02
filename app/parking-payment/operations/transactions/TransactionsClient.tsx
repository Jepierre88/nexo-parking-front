"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, DateValue, DateRangePicker, Input, Button } from "@nextui-org/react";
import withPermission from "@/app/withPermission";
import { TablePagination } from "@/components/Pagination";
import { getLocalTimeZone, parseAbsoluteToLocal } from "@internationalized/date";
import { useRouter, useSearchParams } from "next/navigation";
import { ITEMS_PER_PAGE } from "@/config/constants";
import Transaction from "@/types/Transaction";
import { ActionTooltips, CustomTooltip } from "@/components/customTooltip";
import { PrinterIcon } from "@/components/icons";
import { toast } from "sonner";
import { Connector } from "@/app/libs/Printer";
import { UseTransactions } from "@/app/hooks/transactions/Usetransactions";
import Factura from "@/types/Invoice";
import { useTheme } from "next-themes";
import { exportToExcel } from "@/app/libs/utils";


type TransactionsClientProps = {
  transactions: Transaction[];
};


function TransactionsClient({ transactions }: TransactionsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { getTransactionForPrint } = UseTransactions()

  const [plate, setPlate] = useState(searchParams.get("plate") ?? "");
  const [dateRange, setDateRange] = useState<any>({
    start: parseAbsoluteToLocal(new Date(searchParams.get("from") ?? new Date().toISOString()).toISOString()),
    end: parseAbsoluteToLocal(new Date(searchParams.get("to") ?? new Date().toISOString()).toISOString()),
  });

  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  // Update the URL when filters change
  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (plate) params.set("plate", plate);
    else params.delete("plate");

    if (dateRange.start) params.set("from", dateRange.start.toDate(getLocalTimeZone()).toISOString());
    if (dateRange.end) params.set("to", dateRange.end.toDate(getLocalTimeZone()).toISOString());

    params.set("page", "1"); // Reset to page 1 when filtering

    router.push(`/parking-payment/operations/outcomes?${params.toString()}`);
  };


  const handlePrint = async (id: number) => {
    const loadingToastId = toast.loading("Imprimiendo factura...");

    try {
      // Obtiene la factura
      const factura: Factura | null = await getTransactionForPrint(259801);
      console.log("Factura:", factura);

      if (!factura) {
        toast.error("No se pudo obtener la factura para imprimir", {
          id: loadingToastId,
        });
        return;
      }

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
        .catch((error: any) => {
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

  return (
    <section className="h-full">
      <div className="flex justify-between items-center flex-col xl:flex-row overflow-hidden">
        <h1 className="text-4xl font-bold my-3 h-20 text-center items-center content-center">
          Transacciones
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
            label="Placa"
            maxLength={6}
            size="md"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
          />
          <Button
            className="bg-primary text-white my-auto"
            size="lg"
            variant="shadow"
            onPress={handleFilter}
          >
            Filtrar
          </Button>
        </div>
      </div>

      {/* Table Display */}
      <div className="w-full overflow-auto">
        <Button onPress={() => {
          exportToExcel(transactions, "transacciones");
        }} color="danger" variant="bordered" className="ml-4">
          Exportar a excel
        </Button>
        <Table
          aria-label="Tabla de ingresos"
          shadow="none"
          selectionMode="none"
          color="secondary"
          classNames={{
            wrapper: "min-h-[530px] max-h-[530px] overfow-y-auto",
            td: "h-14",
          }}
          isHeaderSticky
        >
          <TableHeader>
            <TableColumn key="transactionConcept" align="center">
              Servicio
            </TableColumn>
            <TableColumn key="datetime" align="center">
              Fecha
            </TableColumn>
            <TableColumn key="identificationMethod" align="center">
              Tipo
            </TableColumn>
            <TableColumn key="code" align="center">
              Código
            </TableColumn>
            <TableColumn key="vehicleType" align="center">
              Tipo Vehículo
            </TableColumn>
            <TableColumn key="vehiclePlate" align="center">
              Placa
            </TableColumn>
            <TableColumn key="actions" align="center">
              Acciones
            </TableColumn>
          </TableHeader>
          <TableBody items={transactions} emptyContent="No hay registros disponibles">
            {(item: Transaction) => (
              <TableRow key={item.id}>
                <TableCell>{item.transactionConcept}</TableCell>
                <TableCell>{formatDate(item.datetime)}</TableCell>
                <TableCell>{item.identificationMethod}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.vehicleType}</TableCell>
                <TableCell>{item.vehiclePlate}</TableCell>
                <TableCell>
                  <div className="flex h-full justify-center items-center w-full overflow-hidden">
                    <CustomTooltip content={ActionTooltips.PRINT}>
                      <Button
                        color="default"
                        radius="none"
                        variant="light"
                        className="h-full"
                        onPress={() => handlePrint(item.id)}
                      >
                        <PrinterIcon
                          fill={isDark ? "#000" : "#FFF"}
                          size={28}
                          stroke={isDark ? "#FFF" : "#000"}
                        />
                      </Button>
                    </CustomTooltip>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Component */}
      <div className="flex justify-center my-6">
        <TablePagination
          pages={Math.ceil(transactions.length / ITEMS_PER_PAGE)}
        />
      </div>
    </section>
  );
}

export default withPermission(TransactionsClient, 5);
