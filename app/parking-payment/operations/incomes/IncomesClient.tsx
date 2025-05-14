"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter, redirect } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Accordion, AccordionItem, Spinner, select } from "@nextui-org/react";
import { DateInput, DateRangePicker, Input } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { getLocalTimeZone, parseAbsoluteToLocal } from "@internationalized/date";
import { PencilIcon, PrinterIcon } from "@/components/icons";
import { Connector } from "@/app/libs/Printer";
import { toast } from "sonner";
import { useTransition } from "react";
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
import { CONSTANTS, ITEMS_PER_PAGE } from "@/config/constants";
import { exportToExcel } from "@/app/libs/utils";
import { generateReport, getIncomeForPrint, updateIncome } from "@/actions/incomes";
import { Image as ImageIcon } from "@mui/icons-material";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";

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


type IncomesClientProps = {
  incomes: Income[];
  pages: number
};

function IncomesClient({ incomes, pages }: IncomesClientProps) {

  const [isPending, startTransition] = useTransition()

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

  const pageParam = parseInt(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState(pageParam);

  // sincroniza cuando cambia en la URL
  useEffect(() => {
    const newPage = parseInt(searchParams.get("page") || "1");
    setCurrentPage(newPage);
  }, [searchParams]);

  // función para paginación
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    startTransition(() => {
      router.push(`/parking-payment/operations/incomes?${params.toString()}`);
    });
  };

  const [selectedImage, setSelectedImage] = useState<Income>({
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
  });

  const [filterDateRange, setFilterDateRange] = useState<any>({
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
    handleFilter(); return () => {
      console.log("Cleaning");
    }
  }, [])



  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const handlePlateChange = (value: string) => {
    const formattedPlate = value.toUpperCase().slice(0, 6);
    // Verificar si es una moto basado en el patrón colombiano
    const isMotorcycle = (
      formattedPlate.length === 5 || // Si tiene 5 caracteres es moto
      /^[A-Z]{3}\d{2}[A-Z]$/.test(formattedPlate) || // Patrón de 3 letras, 2 números y 1 letra
      /[A-Z]$/.test(formattedPlate) // Termina en letra
    );
    const vehicleKind = isMotorcycle ? "MOTO" : "CARRO";
    setIncomeEdit((prev) => ({
      ...prev,
      plate: formattedPlate,
      vehicleKind,
    }));
  };

  const [exportDateRange, setExportDateRange] = useState<any>({
    start: parseAbsoluteToLocal(new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    end: parseAbsoluteToLocal(new Date(new Date().setHours(23, 59, 59, 999)).toISOString()),
  });

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (plate) params.set("plate", plate);
    else params.delete("plate");

    if (filterDateRange.start)
      params.set("from", filterDateRange.start.toDate(getLocalTimeZone()).toISOString());
    if (filterDateRange.end)
      params.set("to", filterDateRange.end.toDate(getLocalTimeZone()).toISOString());

    params.set("page", "1");

    startTransition(() => {
      router.push(`/parking-payment/operations/incomes?${params.toString()}`);
    });
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
    const toastId = toast.loading("Actualizando ingreso...");
    try {
      const formattedData = {
        ...incomeEdit,
        datetime: tryDate.toDate(),
      };
      await updateIncome(formattedData);
      toast.success("Ingreso actualizado con éxito.", {
        id: toastId,
      });
      onCloseEdit();
      handleFilter(); // Refresca la URL
    } catch (error) {
      console.error("Error al actualizar el ingreso:", error);
      toast.error("Hubo un error al actualizar el ingreso.", {
        id: toastId,
      });
    }
  };

  const {
    handleSubmit: handleEditSubmit,
  } = useForm<Income>({});

  const {
    isOpen: isOpenImage,
    onOpen: openImageModal,
    onOpenChange: onOpenChangeImage,
    onClose: closeImageModal,
  } = useDisclosure();

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onOpenChange: onOpenChangeEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const handlePrint = async (row: Income) => {
    const loadingToastId = toast.loading("Imprimiendo ticket de ingreso...");

    try {
      const printData = await getIncomeForPrint(row.id);
      console.log(printData, row)
      const impresora = new Connector(CONSTANTS.PRINTER_NAME);
      await impresora.imprimirIngreso(printData);
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

  const selectImage = (item: Income) => {
    if (!item.plateImage) return;
    const cleanedText = item.plateImage.replace("C:/COINS/img", `${CONSTANTS.APIURL}/images`)
    setSelectedImage({
      ...item,
      plateImage: cleanedText,
    })
    openImageModal()
  }

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

  const generateIncomesReport = async () => {
    const startDate: Date = exportDateRange.start.toDate(getLocalTimeZone());
    const endDate: Date = exportDateRange.end.toDate(getLocalTimeZone());
    const toastId = toast.loading("Generando informe...");
    try {

      const report = await generateReport({
        from: startDate.toISOString(),
        to: endDate.toISOString(),
      })
      if (report) {
        exportToExcel(report, `REPORTE_INGRESOS__${startDate.toISOString().split("T")[0]}_${endDate.toISOString().split("T")[0]}.xlsx`);
      }
      toast.success("Informe generado correctamente.", {
        id: toastId,
      });
    } catch (error) {
      console.error("Error al generar el informe", error);
      toast.error("Error al generar el informe", {
        id: toastId,
      });
    }
  }

  const savePlate = async () => {
    const toastId = toast.loading("Guardando placa...");

    axios.put(`${CONSTANTS.APIURL}/income/${selectedImage.id}`, {
      plate: selectedImage.plate
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get("auth_token")}`
      },
    })
      .then((response) => {
        toast.success("Placa guardada correctamente.", {
          id: toastId,
        });
        closeImageModal()
        handleFilter()
      })
      .catch((error) => {
        toast.error("Error al guardar la placa.", {
          id: toastId,
        });
      })

  }

  return isLoading ? (
    <section className="h-full">
      <div className="flex justify-between items-center flex-col xl:flex-row overflow-hidden">
        <h1 className="text-4xl font-bold h-20 text-center items-center content-center">
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
        <h1 className="text-4xl font-bold h-20 text-center items-center content-center">
          Entradas
        </h1>


        <div className="flex my-3 gap-4 items-center justify-center h-min flex-wrap md:flex-nowrap">
          <DateRangePicker
            lang="es-ES"
            hideTimeZone
            label="Rango de Fechas"
            size="md"
            value={filterDateRange}
            onChange={setFilterDateRange}
            classNames={{
              inputWrapper: "border border-primary",
            }}
          />
          <Input
            label="Placa"
            maxLength={6}
            size="md"
            value={plate}
            classNames={{
              inputWrapper: "border border-primary",
            }}
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


      <Accordion className="px-4 py-2 mb-4">
        <AccordionItem key="1" aria-label="Generar Informes" title="Generar Informes" variant="splitted" className="py-3">
          <div className="flex gap-4 items-center justify-start flex-wrap md:flex-nowrap">
            <DateRangePicker
              lang="es-ES"
              hideTimeZone
              label="Rango de Fechas para Informe"
              size="md"
              value={exportDateRange}
              onChange={setExportDateRange}
              classNames={{
                inputWrapper: "border border-primary",
              }}
            />
            <Button
              className="bg-primary text-white my-auto"
              size="lg"
              variant="shadow"
              onPress={generateIncomesReport}
            >
              Generar Informe
            </Button>
          </div>
        </AccordionItem>
      </Accordion>

      {/* NextUI Table Implementation with Paginated Data */}
      <div className="w-full overflow-auto">
        <Table
          aria-label="Tabla de ingresos"
          selectionMode="none"
          shadow="none"
          color="primary"
          classNames={{
            wrapper: "min-h-[530px] max-h-[530px] overfow-y-auto",
            td: "h-14",
          }}
          isHeaderSticky

        >
          <TableHeader>
            <TableColumn key="id" align="center">Id</TableColumn>
            <TableColumn key="datetime" align="center">Fecha</TableColumn>
            <TableColumn key="identificationMethod" align="center">Tipo</TableColumn>
            <TableColumn key="identificationId" align="center">Código</TableColumn>
            <TableColumn key="vehicleKind" align="center">Tipo Vehículo</TableColumn>
            <TableColumn key="plate" align="center">Placa</TableColumn>
            <TableColumn key="actions" align="center">Acciones</TableColumn>
            <TableColumn key={"plateImage"} align="center">Imágen</TableColumn>
          </TableHeader>
          <TableBody
            items={incomes}
            emptyContent="No hay registros disponibles"
            isLoading={isPending}
            loadingContent={
              <div className="w-full h-full bg-transparent/10 py-6 flex justify-center items-center">
                <Spinner color="primary" size="lg" label="Cargando ingresos..." />
              </div>
            }
          >
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
                        <PencilIcon fill={isDark ? "#000" : "#FFF"} color="#FFF" size={20} />
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
                <TableCell>
                  <Button onPress={() => selectImage(item)}>
                    <ImageIcon />
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Component */}
      <div className="flex justify-center my-6">
        <TablePagination
          pages={pages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
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
                          isDisabled
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
                          isDisabled
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

      <Modal isOpen={isOpenImage} onOpenChange={onOpenChangeImage}>
        <ModalContent>
          {() => (
            <div className="flex flex-col items-start w-full p-4">
              <ModalHeader className="flex justify-between w-full p-0">
                <h1 className="text-center text-2xl font-bold mb-2">Imagen</h1>
              </ModalHeader>
              <ModalBody className="flex w-full p-0">
                <hr className="separator mt-0 mb-6 w-full" />
                <div className="flex flex-col space-y-6">
                  <div className="flex items-center w-full">
                    <div className="flex flex-col w-full gap-4 justify-center items-center">
                      <Image
                        src={selectedImage?.plateImage || ""}
                        width={400}
                        height={400}
                        alt="Imagen de placa"
                      />
                      <div className="flex items-center justify-around gap-4">
                        <Input label="Placa" value={selectedImage?.plate} maxLength={6} onChange={(e) => {
                          setSelectedImage((prev) => ({
                            ...prev,
                            plate: e.target.value.toUpperCase()
                          }));

                        }} />
                        <Button size="lg" color="primary" onPress={savePlate}>Guardar</Button>
                      </div>
                    </div>
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

export default withPermission(IncomesClient, 2);