"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { DateInput, DateRangePicker, Input } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { getLocalTimeZone, parseAbsoluteToLocal } from "@internationalized/date";
import { PencilIcon, PrinterIcon } from "@/components/icons";
import { Connector } from "@/app/libs/Printer";
import { toast } from "sonner";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { SubmitHandler, useForm } from "react-hook-form";
import Income from "@/types/Income";
import { ActionTooltips, CustomTooltip } from "@/components/customTooltip";
import UsePermissions from "@/app/hooks/UsePermissions";
import withPermission from "@/app/withPermission";
import { TablePagination } from "@/components/Pagination";
import TableSkeleton from "@/components/TableSkeleton";

const initialIncomeEdit: Income = {
  id: 0,
  identificationId: "",
  identificationMethod: "",
  incomePointId: 0,
  peopleAmount: 0,
  plate: "",
  plateImage: "",
  processId: 0,
  state: 0,
  vehicle: "",
  vehicleKind: "",
};

// Número de registros por página
const ITEMS_PER_PAGE = 10;

type IncomesClientProps = {
  initialIncomes: Income[];
};

function IncomesClient({ initialIncomes }: IncomesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  const { hasPermission, isLoading } = UsePermissions();
  const canEditIncome = useMemo(() => hasPermission(38), [hasPermission]);
  const canPrinterIncome = useMemo(() => hasPermission(13), [hasPermission]);

  const [incomeEdit, setIncomeEdit] = useState<Income>(initialIncomeEdit);
  const [plate, setPlate] = useState(searchParams.get("plate") ?? "");

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const [dateRange, setDateRange] = useState<any>({
    start: fromParam
      ? parseAbsoluteToLocal(new Date(fromParam).toISOString())
      : parseAbsoluteToLocal(new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()),
    end: toParam
      ? parseAbsoluteToLocal(new Date(toParam).toISOString())
      : parseAbsoluteToLocal(new Date().toISOString()),
  });

  const [tryDate, setTryDate] = useState<any>(
    fromParam
      ? parseAbsoluteToLocal(new Date(fromParam).toISOString())
      : parseAbsoluteToLocal(new Date().toISOString())
  );

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const handlePlateChange = (value: string) => {
    const formattedPlate = value.toUpperCase().slice(0, 6);
    const lastChar = formattedPlate.slice(-1);
    const vehicleKind = isNaN(Number(lastChar)) ? "CARRO" : "MOTO";
    setIncomeEdit((prev) => ({
      ...prev,
      plate: formattedPlate,
      vehicleKind,
    }));
  };

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (plate) params.set("plate", plate);
    else params.delete("plate");

    if (dateRange.start)
      params.set("from", dateRange.start.toDate(getLocalTimeZone()).toISOString());
    if (dateRange.end)
      params.set("to", dateRange.end.toDate(getLocalTimeZone()).toISOString());

    // Reset to page 1 when filtering
    params.set("page", "1");

    router.push(`/parking-payment/operations/incomes?${params.toString()}`);
  };

  const handleEditIncome = (data: Income) => {
    setIncomeEdit(data);
    const parsedDate = parseAbsoluteToLocal(
      new Date(data.datetime).toISOString()
    );
    setTryDate(parsedDate);
    onOpenEdit();
  };

  const handleUpdateIncome: SubmitHandler<Income> = async () => {
    try {
      const formattedData = {
        ...incomeEdit,
        datetime: tryDate.toDate(),
      };
      // Aquí iría el update real al backend
      toast.success("Ingreso actualizado con éxito.");
      onCloseEdit();
      handleFilter(); // Refresca la URL
    } catch (error) {
      console.error("Error al actualizar el ingreso:", error);
      toast.error("Hubo un error al actualizar el ingreso.");
    }
  };

  const {
    handleSubmit: handleEditSubmit,
  } = useForm<Income>({});

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onOpenChange: onOpenChangeEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const handlePrint = async (row: Income) => {
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

  const sortedIncomes = useMemo(() => {
    return initialIncomes
      .slice()
      .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
  }, [initialIncomes]);

  // Get paginated data
  const getPaginatedData = () => {
    const pageParam = searchParams.get("page");
    const currentPage = pageParam ? parseInt(pageParam) : 1;
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return sortedIncomes.slice(start, end);
  };

  const paginatedIncomes = getPaginatedData();

  // Formato de fecha para mostrar en la tabla
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return isLoading ? (
    <section className="h-full">
      <div className="flex justify-between items-center flex-col xl:flex-row overflow-hidden">
        <h1 className="text-4xl font-bold my-3 h-20 text-center items-center content-center">
          Entradas
        </h1>
        <div className="flex my-3 gap-4 items-center justify-center h-min flex-wrap md:flex-nowrap">
          <div className="h-12 bg-default-200 rounded-lg animate-pulse w-64" />
          <div className="h-12 bg-default-200 rounded-lg animate-pulse w-40" />
          <div className="h-12 bg-default-200 rounded-lg animate-pulse w-32" />
        </div>
      </div>
      <TableSkeleton columns={7} rows={10} />
    </section>
  ) : (
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

      {/* NextUI Table Implementation with Paginated Data */}
      <div className="w-full overflow-auto">
        <Table
          aria-label="Tabla de ingresos"
          selectionMode="none"
          color="primary"
        >
          <TableHeader>
            <TableColumn key="id" align="center">Id</TableColumn>
            <TableColumn key="datetime" align="center">Fecha</TableColumn>
            <TableColumn key="identificationMethod" align="center">Tipo</TableColumn>
            <TableColumn key="identificationId" align="center">Código</TableColumn>
            <TableColumn key="vehicleKind" align="center">Tipo Vehículo</TableColumn>
            <TableColumn key="plate" align="center">Placa</TableColumn>
            <TableColumn key="actions" align="center">Acciones</TableColumn>
          </TableHeader>
          <TableBody items={paginatedIncomes} emptyContent="No hay registros disponibles">
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{formatDate(item.datetime)}</TableCell>
                <TableCell>{item.identificationMethod}</TableCell>
                <TableCell>{item.identificationId}</TableCell>
                <TableCell>{item.vehicleKind}</TableCell>
                <TableCell>{item.plate}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <CustomTooltip content={ActionTooltips.EDIT}>
                      <Button
                        isIconOnly
                        radius="sm"
                        color="default"
                        variant="light"
                        isDisabled={!canEditIncome}
                        onPress={() => handleEditIncome(item)}
                      >
                        <PencilIcon fill={isDark ? "#FFF" : "#000"} size={20} />
                      </Button>
                    </CustomTooltip>
                    <CustomTooltip content={ActionTooltips.PRINT}>
                      <Button
                        isIconOnly
                        radius="sm"
                        color="default"
                        variant="light"
                        isDisabled={!canPrinterIncome}
                        onPress={() => handlePrint(item)}
                      >
                        <PrinterIcon
                          fill={isDark ? "#000" : "#FFF"}
                          size={20}
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
          pages={Math.ceil(sortedIncomes.length / ITEMS_PER_PAGE)}
        />
      </div>

      <Modal isOpen={isOpenEdit} onOpenChange={onOpenChangeEdit}>
        <ModalContent>
          {() => (
            <div className="flex flex-col items-start w-full p-4">
              <ModalHeader className="flex justify-between w-full p-0">
                <h1 className="text-center text-2xl font-bold mb-2">Ingreso</h1>
              </ModalHeader>
              <ModalBody className="flex w-full p-0">
                <hr className="separator mt-0 mb-6 w-full" />
                <form
                  className="flex flex-col space-y-6"
                  onSubmit={handleEditSubmit(handleUpdateIncome)}
                >
                  <div className="flex flex-col w-full">
                    <div className="flex items-center w-full">
                      <label className="text-lg font-bold w-1/3">Placa</label>
                      <div className="flex flex-col w-2/3">
                        <Input
                          placeholder="Digita la placa"
                          maxLength={6}
                          type="text"
                          variant="bordered"
                          value={incomeEdit.plate}
                          onChange={(e) => handlePlateChange(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center w-full">
                      <label className="text-lg font-bold w-1/3">Tipo de Vehículo</label>
                      <div className="flex flex-col w-2/3">
                        <Input
                          type="text"
                          variant="bordered"
                          value={incomeEdit.vehicleKind}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="flex items-center w-full">
                      <label className="text-lg font-bold w-1/3">Fecha y Hora</label>
                      <div className="flex flex-col w-2/3">
                        <DateInput
                          size="md"
                          lang="es-ES"
                          hideTimeZone
                          variant="bordered"
                          value={tryDate}
                          onChange={setTryDate}
                        />
                      </div>
                    </div>

                    <div className="flex justify-center mt-4">
                      <Button color="primary" size="md" type="submit" variant="ghost">
                        Guardar Datos
                      </Button>
                    </div>
                  </div>
                </form>
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}

export default withPermission(IncomesClient, 2);