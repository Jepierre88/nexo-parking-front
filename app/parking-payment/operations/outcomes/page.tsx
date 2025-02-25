"use client";
import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { GridColDef } from "@mui/x-data-grid";
import {
  ModalContent,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalBody,
} from "@nextui-org/modal";

import UseIncomes from "@/app/hooks/incomes/UseIncomes";
import { title } from "@/components/primitives";
import CustomDataGrid from "@/components/customDataGrid";
import {
  DateValue,
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import { DatePicker, DateRangePicker, Input } from "@nextui-org/react";
import withPermission from "@/app/withPermission";
import UseOutcomes from "@/app/hooks/outcomes/UseOutcomes";

function Outcomes() {
  const { outComes, getOutComes } = UseOutcomes();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);

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
  const handleDateRangeChange = (
    range: { start: DateValue; end: DateValue } | null
  ) => {
    if (range) {
      setDateRange({
        start: range.start,
        end: range.end,
      });
    }
  };

  const [plate, setPlate] = useState("");

  const handleFilter = () => {
    setLoading(true);

    getOutComes(
      dateRange.start.toDate(getLocalTimeZone()),
      dateRange.end.toDate(getLocalTimeZone())
    ).finally(() => {
      setLoading(false);
    });
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
  ];

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
            showMonthAndYearPickers
            className="text-sm"
            label="Rango de Fechas"
            size="md"
            value={dateRange}
            onChange={handleDateRangeChange}
          />
          <Input
            label={"Placa"}
            maxLength={6}
            size="md"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            // onChange={(e) => setPlate(e.target.value.toUpperCase())}
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
      <CustomDataGrid columns={columns} rows={outComes} loading={loading} />
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
                    <label className="text-xl font-bold text-nowrap w-1/3">
                      Placa
                    </label>
                    <Input className="ml-4 w-2/3" placeholder=" " type="text" />
                  </div>
                  <div className="flex justify-center w-full mt-4">
                    <Button onPress={onClose}>Cancelar</Button>
                    <Button onPress={() => console.log("Guardar datos")}>
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
export default withPermission(Outcomes, 3);
