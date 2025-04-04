"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, DateValue, DateRangePicker, Input, Button } from "@nextui-org/react";
import withPermission from "@/app/withPermission";
import { TablePagination } from "@/components/Pagination";
import { getLocalTimeZone, parseAbsoluteToLocal } from "@internationalized/date";
import { useRouter, useSearchParams } from "next/navigation";
import { ITEMS_PER_PAGE } from "@/config/constants";
import { exportToExcel } from "@/app/libs/utils";

type Outcome = {
  id: number;
  datetime: string;
  identificationMethod: string;
  identificationId: string;
  vehicleKind: string;
  plate: string;
};

type OutcomesClientProps = {
  outcomes: Outcome[];
  pages: number;
};


function OutcomesClient({ outcomes, pages }: OutcomesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const [plate, setPlate] = useState(searchParams.get("plate") ?? "");
  const [dateRange, setDateRange] = useState<any>({
    start: fromParam
      ? parseAbsoluteToLocal(new Date(fromParam).toISOString())
      : parseAbsoluteToLocal(new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()),
    end: toParam
      ? parseAbsoluteToLocal(new Date(toParam).toISOString())
      : parseAbsoluteToLocal(new Date().toISOString()),
  });

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

  useEffect(() => {
    if (!fromParam || !toParam) {
      setDateRange({
        start: parseAbsoluteToLocal(new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()),
        end: parseAbsoluteToLocal(new Date().toISOString()),
      });
      handleFilter()
    }
  }, [])

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

  return (
    <section className="h-full">
      <div className="flex justify-between items-center flex-col xl:flex-row overflow-hidden">
        <h1 className="text-4xl font-bold my-3 h-20 text-center items-center content-center">
          Salidas
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
          exportToExcel(outcomes, "salidas");
        }} color="danger" variant="bordered" className="ml-4">
          Exportar a excel
        </Button>
        <Table
          shadow="none"
          aria-label="Tabla de ingresos"
          selectionMode="none"
          color="primary"
          classNames={{
            wrapper: "min-h-[530px] max-h-[530px] overfow-y-auto",
            td: "h-14",
          }}
          className=""
          isHeaderSticky
        >
          <TableHeader>
            <TableColumn key="id" align="center">
              Id
            </TableColumn>
            <TableColumn key="datetime" align="center">
              Fecha
            </TableColumn>
            <TableColumn key="identificationMethod" align="center">
              Tipo
            </TableColumn>
            <TableColumn key="identificationId" align="center">
              Código
            </TableColumn>
            <TableColumn key="vehicleKind" align="center">
              Tipo Vehículo
            </TableColumn>
            <TableColumn key="plate" align="center">
              Placa
            </TableColumn>
          </TableHeader>
          <TableBody items={outcomes} emptyContent="No hay registros disponibles">
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{formatDate(item.datetime)}</TableCell>
                <TableCell>{item.identificationMethod}</TableCell>
                <TableCell>{item.identificationId}</TableCell>
                <TableCell>{item.vehicleKind}</TableCell>
                <TableCell>{item.plate}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Component */}
      <div className="flex justify-center my-6">
        <TablePagination
          pages={pages}
        />
      </div>
    </section>
  );
}

export default withPermission(OutcomesClient, 3);
