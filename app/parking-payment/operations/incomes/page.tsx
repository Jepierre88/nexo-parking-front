"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@nextui-org/button";
import { GridColDef } from "@mui/x-data-grid";
import { DateInput, DateRangePicker, Input } from "@nextui-org/react";
import { useTheme } from "next-themes";
import UsePermissions from "@/app/hooks/UsePermissions";
import UseIncomes from "@/app/hooks/incomes/UseIncomes";
import CustomDataGrid from "@/components/customDataGrid";
import { PencilIcon, PrinterIcon } from "@/components/icons";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
  parseDate,
} from "@internationalized/date";
import withPermission from "@/app/withPermission";
import { Connector } from "@/app/libs/Printer";
import Income from "@/types/Income";
import { toast } from "sonner";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { title } from "@/components/primitives";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from "@internationalized/date";

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

function Incomes() {
  const [tryDate, setTryDate] = useState<any>(
    parseAbsoluteToLocal(new Date().toISOString())
  );

  const handleCurrentDateChangeTRY = (
    value: CalendarDate | CalendarDateTime | ZonedDateTime | any
  ) => {
    if (value) {
      setTryDate(value);
    }
  };

  const { incomes, getIncomes, updatePlate, updateIncome } = UseIncomes();
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const { hasPermission } = UsePermissions();
  const canEditIncome = useMemo(() => hasPermission(38), [hasPermission]);
  const canPrinterIncome = useMemo(() => hasPermission(13), [hasPermission]);
  const [income, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
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
  const [incomeEdit, setIncomeEdit] = useState<Income>(initialIncomeEdit);

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

  const handleFilter = async () => {
    setLoading(true);
    try {
      if (dateRange.start && dateRange.end) {
        await getIncomes(
          dateRange.start.toDate(getLocalTimeZone()),
          dateRange.end.toDate(getLocalTimeZone()),
          plate
        );
        toast.success("Datos filtrados con éxito.");
      } else {
        toast.error("Por favor selecciona un rango de fechas válido.");
      }
    } catch (error) {
      console.error("Error al filtrar los datos:", error);
      toast.error("Hubo un error al filtrar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditIncome = (data: Income) => {
    setIncomeEdit(data);
    const parsedDate = parseAbsoluteToLocal(
      new Date(data.datetime).toISOString()
    );
    setTryDate(parsedDate);
    onOpenEdit();
  };

  const handleUpdateIncome: SubmitHandler<Income> = async (data) => {
    try {
      const formattedData = {
        ...incomeEdit,
        datetime: tryDate.toDate(),
      };
      await updateIncome(formattedData);

      toast.success("Ingreso actualizado con éxito.");
      onCloseEdit();
      await handleFilter();
    } catch (error) {
      console.error("Error al actualizar el ingreso:", error);
      toast.error("Hubo un error al actualizar el ingreso.");
    } finally {
      setLoading(false);
    }
  };
  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: editReset,
    formState: { errors: editErrors },
  } = useForm<Income>({});

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onOpenChange: onOpenChangeEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

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
      headerName: "Tipo Vehículo",
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
      align: "center",
      renderCell: (params) => (
        <div className="flex h-full justify-center items-center w-full overflow-hidden">
          <Button
            className="w-1 h-full p-1 flex items-center"
            radius="none"
            color="default"
            variant="light"
            isDisabled={!canEditIncome}
            onPress={() => handleEditIncome(params.row)}
          >
            <PencilIcon fill={isDark ? "#FFF" : "#000"} size={24} />
          </Button>

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

  const sortedIncomes = useMemo(() => {
    return incomes
      .slice()
      .sort(
        (a, b) =>
          new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
      );
  }, [incomes]);
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
            onPress={handleFilter}
          >
            Filtrar
          </Button>
        </div>
      </div>
      <CustomDataGrid
        columns={columns}
        loading={loading}
        rows={sortedIncomes}
      />

      <Modal
        aria-describedby="user-modal-description"
        aria-labelledby="user-modal-title"
        isOpen={isOpenEdit}
        onOpenChange={onOpenChangeEdit}
      >
        <ModalContent>
          <div className="flex flex-col items-start w-full p-4">
            <ModalHeader className="flex justify-between w-full">
              <h1 className={`text-2xl  font-bold ${title()}`}>INGRESO</h1>
            </ModalHeader>
            <ModalBody className="flex flex-col w-full mt-4 gap-4">
              <form
                className="flex flex-grow flex-col items-start w-full gap-4"
                onSubmit={handleEditSubmit(handleUpdateIncome)}
              >
                {/*Editar Entrada*/}
                <div className="flex flex-col itms-star w-98">
                  <div className="flex flex-col mt-2 mb-2 w-96">
                    <div className="flex items-center mt-2 mb-2 w-96">
                      <label className="text-xl font-bold text-nowrap w-1/3">
                        Placa
                      </label>
                      <Input
                        className="ml-4 w-2/3"
                        placeholder="Digite la placa"
                        maxLength={6}
                        type="text"
                        variant="bordered"
                        value={incomeEdit.plate}
                        onChange={(e) => {
                          handlePlateChange(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex items-center w-full">
                      <label className="text-xl font-bold w-1/3">
                        Tipo de Vehículo
                      </label>
                      <Input
                        className="ml-4 w-2/3"
                        placeholder="Digite el tipo de vehículo"
                        type="text"
                        variant="bordered"
                        value={incomeEdit.vehicleKind}
                        onChange={(e) => {
                          handlePlateChange(e.target.value);
                        }}
                        readOnly
                      />
                    </div>
                    <div className="flex items-center w-full">
                      <label className="text-xl font-bold w-1/3">
                        Fecha y Hora
                      </label>
                      <DateInput
                        className="ml-4 w-2/3"
                        lang="es-ES"
                        hideTimeZone
                        variant="bordered"
                        label="Rango de Fechas"
                        size="md"
                        value={tryDate}
                        onChange={handleCurrentDateChangeTRY}
                      />
                    </div>
                    <div className="flex justify-end w-full mt-4">
                      <Button color="primary" size="sm" type="submit">
                        Guardar Datos
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </ModalBody>
          </div>
        </ModalContent>
      </Modal>
    </section>
  );
}

export default withPermission(Incomes, 2);
