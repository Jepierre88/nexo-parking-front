'use client'
import { useClosures } from "@/app/hooks/parking-payment/UseClosures";
import UseConfigurationData from "@/app/hooks/UseConfigurationData";
import UsePermissions from "@/app/hooks/UsePermissions";
import { exportToExcel, formatDate } from "@/app/libs/utils";
import withPermission from "@/app/withPermission";
import { ActionTooltips, CustomTooltip } from "@/components/customTooltip";
import { LargeEyeIcon, LargeSendIcon, PrinterIcon } from "@/components/icons";
import { TablePagination } from "@/components/Pagination";
import { Closure, ClosureDetails, Encabezado } from "@/types/Closure";
import Income from "@/types/Income";
import { Transaction } from "@/types/Closure";
import { CalendarDate, CalendarDateTime, getLocalTimeZone, parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";
import { Button, DateInput, DateRangePicker, Input, Modal, ModalBody, ModalContent, ModalHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import Cookies from "js-cookie";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Connector } from "@/app/libs/Printer";
import { CONSTANTS } from "@/config/constants";
import { AxiosError } from "axios";


function PaymentClosureClient({ closures, pages }: {
  closures: Closure[],
  pages: number,
}) {

  const [isPending, startTransition] = useTransition()

  const { resolvedTheme } = useTheme();

  const router = useRouter();

  const { hasPermission, isLoading } = UsePermissions()
  const canPrinterClosure = useMemo(() => hasPermission(25), [hasPermission]);
  const canSeeClouse = useMemo(() => hasPermission(24), [hasPermission]);
  const canSendClouse = useMemo(() => hasPermission(42), [hasPermission]);
  const { configuration, getConfiguration } = UseConfigurationData();



  const searchParams = useSearchParams()

  const [closureData, setClosureData] = useState<
    [Encabezado, Transaction[], ClosureDetails] | null
  >(null);
  const [isDark, setIsDark] = useState(false);
  const [loadingClose, setLoadingClose] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentClosureId, setCurrentClosureId] = useState<number | null>(null);
  const [message, setMessage] = useState("");




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
      router.push(`/parking-payment/operations/parkingClosure?${params.toString()}`);
    });

  };
  const [filterDateRange, setFilterDateRange] = useState<any>({
    start: fromParam
      ? parseAbsoluteToLocal(new Date(fromParam).toISOString())
      : parseAbsoluteToLocal(new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()),
    end: toParam
      ? parseAbsoluteToLocal(new Date(toParam).toISOString())
      : parseAbsoluteToLocal(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()),
  });

  useEffect(() => {
    getConfiguration()
    // if (!fromParam || !toParam) {
    //   setFilterDateRange({
    //     start: parseAbsoluteToLocal(new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()),
    //     end: parseAbsoluteToLocal(new Date().toISOString()),
    //   });
    //   handleFilter()
    // }
    handleFilter()
    return () => {
      console.log("Cleaning");
    }
  }, [])


  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onOpenChange: onOpenChangeModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const {
    isOpen: isOpenClose,
    onOpen: onOpenClose,
    onOpenChange: onOpenChangeClose,
    onClose: onCloseClose,
  } = useDisclosure();

  const {
    isOpen: isOpenPartialClosure,
    onOpen: onOpenPartialClosure,
    onOpenChange: onOpenChangePartialClosure,
    onClose: onClosePartialClosure
  } = useDisclosure()


  const {
    register: registerModal,
    handleSubmit: handleSubmitModal,
    reset: resetModal,
    getValues: getValuesModal,
  } = useForm();
  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: editReset,
    formState: { errors: editErrors },
  } = useForm<Income>({});



  const getDeviceName = () => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      return userData.deviceNme || "Dispositivo desconocido";
    }
    return "Dispositivo desconocido";
  };

  const getCashier = () => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      return `${userData.name} ${userData.lastName}`;
    }
    return "Usuario Desconocido";
  };

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (filterDateRange.start)
      params.set("from", filterDateRange.start.toDate(getLocalTimeZone()).toISOString());
    if (filterDateRange.end)
      params.set("to", filterDateRange.end.toDate(getLocalTimeZone()).toISOString());

    // Reset to page 1 when filtering
    params.set("page", "1");

    startTransition(() => {
      router.push(`/parking-payment/operations/parkingClosure?${params.toString()}`);
    })
  };
  const { postClosure, getClosureDetails, sendEmail, postPartialClosure } = useClosures();

  const handleClose = async () => {
    const cashier = getCashier();
    setLoadingClose(true);
    try {
      const result = await postClosure(cashier);
      if (result) {
        toast.success("Cierre realizado con éxito");
        onCloseClose();
        handleFilter()
      } else {
        toast.error("Error al realizar el cierre");
      }
    } catch (error) {
      toast.error("Error al realizar el cierre");
    } finally {
      setLoadingClose(false);
    }
  };
  const handlePartialClosure = async () => {
    const cashier = getCashier();
    setLoadingClose(true);
    try {
      const result = await postPartialClosure(cashier);
      if (result) {
        const impresora = new Connector(CONSTANTS.PRINTER_NAME);
        await impresora.imprimirCierre(result);
        toast.success("Cierre realizado con éxito");
        onClosePartialClosure();
      } else {
        toast.error("Error al realizar el cierre");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error("Por favo inicie sesión de nuevo");
          router.push("/auth/login")
        }
      }
      toast.error("Error al realizar el cierre");
    } finally {
      setLoadingClose(false);
      handleFilter();
    }
  };
  const handleViewDetails = async (id: number) => {
    try {
      const closureDetails = await getClosureDetails(id);
      if (closureDetails) {
        setClosureData(closureDetails);
        onOpen();
      } else {
        toast.error("No se encontraron detalles del cierre");
      }
    } catch (error) {
      console.error("Error al obtener detalles:", error);
      toast.error("Error al obtener los detalles del cierre");
    }
  };

  const handleSendEmail = async () => {
    const email = getValuesModal("recoveryEmail");
    if (!currentClosureId) {
      toast.error("No se ha seleccionado un cierre");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Enviando correo...");
    try {
      const result = await sendEmail(currentClosureId, email);
      if (result) {
        toast.success("Informe enviado con éxito", {
          id: toastId,
        });
        resetModal();
        setTimeout(() => {
          toast.dismiss(toastId);
          setTimeout(() => {
            onCloseModal();
          }, 500);
        }, 1500);
      } else {
        toast.error("Error al enviar el correo", {
          id: toastId,
        });
      }
    } catch (error) {
      setMessage("Error al enviar el correo");
      toast.error("Error al enviar el correo", {
        id: toastId,
      });
    } finally {
      // setCurrentClosureId(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpenModal) {
      resetModal();
      setMessage("");
    }
  }, [isOpenModal]);


  const handlePrint = async (id: number) => {
    const loadingToastId = toast.loading("Obteniendo datos del cierre");

    try {

      const closureDetails = await getClosureDetails(id);
      if (!closureDetails) {
        toast.error("No se encontraron datos para imprimir.", {
          id: loadingToastId,
        });
        return;
      }

      const impresora = new Connector(CONSTANTS.PRINTER_NAME);
      await impresora.imprimirCierre(closureDetails);

      toast.success("Cierre impreso correctamente.", {
        id: loadingToastId,
      });
    } catch (e) {
      console.error("Error al imprimir el cierre", e);
      toast.error("Error al imprimir el cierre.", {
        id: loadingToastId,
      });
    }
  };

  if (isLoading) return null
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
            value={filterDateRange}
            classNames={{
              inputWrapper: "border border-primary",
            }}
            onChange={setFilterDateRange}
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
      <div className="w-full overflow-auto">
        <div className="justify-between items-center flex my-2">
          <Button
            className="bg-primary relative z-10 text-white"
            color="primary"
            variant="flat"
            isDisabled={loading}
            onPress={onOpenClose}
          >
            Realizar cierre
          </Button>
          <Button
            className="relative z-10"
            color="primary"
            variant="bordered"
            isDisabled={loading}
            onPress={onOpenPartialClosure}
          >
            Realizar cierre parcial
          </Button>
        </div>
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
            <TableColumn key="id" align="center">Id del cierre</TableColumn>
            <TableColumn key="cashier" align="center">Realizó el cierre</TableColumn>
            <TableColumn key="datetime" align="center">Fecha de cierre</TableColumn>
            <TableColumn key="initialConsecutive" align="center">Corte inicial</TableColumn>
            <TableColumn key="finalConsecutive" align="center">Corte final</TableColumn>
            <TableColumn key="deviceName" align="center">Punto de pago</TableColumn>
            <TableColumn key="actions" align="center">Acciones</TableColumn>
          </TableHeader>
          <TableBody items={closures} emptyContent="No hay registros disponibles" isLoading={isPending}
            loadingContent={
              <div className="w-full h-full bg-transparent/10 py-6 flex justify-center items-center">
                <Spinner color="primary" size="lg" label="Cargando cierres..." />
              </div>
            }>
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.cashier}</TableCell>
                <TableCell>{formatDate(new Date(item.datetime || ""))}</TableCell>
                <TableCell>{item.initialConsecutive}</TableCell>
                <TableCell>{item.finalConsecutive}</TableCell>
                <TableCell>{getDeviceName()}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <CustomTooltip content={ActionTooltips.VIEW}>
                      <Button
                        className="w-auto h-auto flex items-center justify-center p-0 min-w-0"
                        color="default"
                        variant="light"
                        isDisabled={!canSeeClouse}
                        size="sm"
                        onPress={() => {
                          handleViewDetails(item.id);
                          onOpen();
                        }}
                      >
                        <LargeEyeIcon fill={isDark ? "#FFF" : "#000"} />
                      </Button>
                    </CustomTooltip>
                    <CustomTooltip content={ActionTooltips.PRINT}>
                      <Button
                        className="w-auto h-auto flex items-center justify-center p-0 min-w-0"
                        color="default"
                        radius="none"
                        variant="light"
                        isDisabled={!canPrinterClosure}
                        onPress={() => {
                          handlePrint(item.id)
                        }
                        }
                      >
                        <PrinterIcon
                          fill={isDark ? "#000" : "#FFF"}
                          stroke={isDark ? "#FFF" : "#000"}
                        />
                      </Button>
                    </CustomTooltip>
                    <CustomTooltip content={ActionTooltips.SEND_EMAIL}>
                      <Button
                        className="w-auto h-auto flex items-center justify-center p-0 min-w-0"
                        color="default"
                        variant="light"
                        isDisabled={!canSendClouse}
                        onPress={() => {
                          setCurrentClosureId(item.id);
                          onOpenModal();
                        }}
                      >
                        <LargeSendIcon fill={isDark ? "#000" : "#fff"}
                          stroke={isDark ? "#FFF" : "#000"} />
                      </Button>
                    </CustomTooltip>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center my-6">
        <TablePagination
          pages={pages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
      <Modal isOpen={isOpenClose} onOpenChange={onOpenChangeClose}>
        <ModalContent>
          <ModalHeader className="flex justify-center items-center">
            Confirmación del cierre
          </ModalHeader>
          <hr className="separator" />

          <ModalBody className="my-2">
            <div className="flex items-center gap-2 w-full">
              <span className=" text-base">{getCashier()}</span>
              <span className=" text-base">
                ¿Desea realizar el cierre?
              </span>
            </div>
            <div className="flex justify-end gap-4 w-full mt-6">
              <Button
                color="primary"
                disabled={loadingClose}
                onPress={handleClose}
              >
                {loadingClose ? "Cargando..." : "Generar cierre"}
              </Button>
              <Button color="primary" variant="ghost" onPress={onCloseClose}>
                Cancelar
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="full"
        // scrollBehavior="inside"
        classNames={{
          base: "max-h-[96vh] w-full md:w-[90vw] lg:w-[80vw]", // ✅ Controla el ancho en pantallas grandes
          body: "p-0 overflow-y-auto", // ✅ Controla el alto del contenido para evitar recortes
          wrapper: "flex items-center justify-center", // ✅ Centra el modal correctamente
        }}
      >
        <ModalContent>
          {() => (
            // <div className="flex flex-col w-full p-4 flex-grow min-h-0">
            <ModalBody className="flex flex-col w-full flex-grow min-h-0 overflow-y-auto px-12 py-4">
              {closureData && (
                <div className="flex flex-col w-full space-y-4">
                  {/* Encabezado */}
                  <div className="text-center">
                    <p>Nit:</p>
                    <p>Dirección:</p>
                    <p className="font-bold">Cierre de Ventas</p>
                    <hr className="my-2" />
                    <p>Máquina: {getDeviceName()}</p>
                    <p>
                      DESDE:{" "}
                      {new Date(closureData[0].fromDatetime).toLocaleString()}
                    </p>

                    <p>
                      HASTA:{" "}
                      {new Date(closureData[0].toDatetime).toLocaleString()}
                    </p>
                  </div>

                  {/* Transacciones */}
                  {closureData[1].map((transaccion, index) => (
                    <div key={index} className="border-b pb-4">
                      <h3 className="font-bold">
                        Transacciones {transaccion.transactionType}
                      </h3>
                      <div className="overflow-x-auto max-w-full">
                        <table className="w-full text-sm md:text-base">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left w-1/2">Item</th>
                              <th className="text-center w-1/4">Cant</th>
                              <th className="text-right w-1/4">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transaccion.items.map((item, idx) => (
                              <tr key={idx}>
                                <td className="text-left">{item.code}</td>
                                <td className="text-center">{item.cnt}</td>
                                <td className="text-right">
                                  {item.total.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                            <tr className="font-bold border-t">
                              <td colSpan={2} className="text-right">
                                Total:
                              </td>
                              <td className="text-right">
                                {transaccion.total.toLocaleString()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}

                  {/* Dinero Recibido */}
                  <div className="border-b pb-4">
                    <h3 className="font-bold">Dinero Recibido</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left w-1/2">Item</th>
                            <th className="text-center w-1/4">Cant</th>
                            <th className="text-right w-1/4">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {closureData[2].amountReceived.map((monto, idx) => (
                            <tr key={idx}>
                              <td className="text-left">{monto.item}</td>
                              <td className="text-center">
                                {monto.cantidad}
                              </td>
                              <td className="text-right">
                                {monto.total.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                          <tr className="font-bold border-t">
                            <td colSpan={2} className="text-right">
                              Total:
                            </td>
                            <td className="text-right">
                              {closureData[2].totalAmountReceived.toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Dinero Devolución */}
                  <div className="border-b pb-4">
                    <h3 className="font-bold">Dinero Devolución</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left w-1/2">Item</th>
                            <th className="text-center w-1/4">Cant</th>
                            <th className="text-right w-1/4">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {closureData[2].amountToReturn.map(
                            (devolucion, idx) => (
                              <tr key={idx}>
                                <td className="text-left">
                                  {devolucion.item}
                                </td>
                                <td className="text-center">
                                  {devolucion.cantidad}
                                </td>
                                <td className="text-right">
                                  {devolucion.total.toLocaleString()}
                                </td>
                              </tr>
                            )
                          )}
                          <tr className="font-bold border-t">
                            <td colSpan={2} className="text-right">
                              Total:
                            </td>
                            <td className="text-right">
                              {closureData[2].totalAmountToReturn.toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Medios de Pago */}
                  <div className="pb-4">
                    <h3 className="font-bold">Medio de Pago</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left w-1/2">Item</th>
                            <th className="text-center w-1/4">Cant</th>
                            <th className="text-right w-1/4">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {closureData[2].paymentMethods.map(
                            (metodo, idx) => (
                              <tr key={idx}>
                                <td className="text-left">{metodo.item}</td>
                                <td className="text-center">
                                  {metodo.cantidad}
                                </td>
                                <td className="text-right">
                                  {metodo.total.toLocaleString()}
                                </td>
                              </tr>
                            )
                          )}
                          <tr className="font-bold border-t">
                            <td colSpan={2} className="text-right">
                              Total:
                            </td>
                            <td className="text-right">
                              {closureData[2].totalPaymentMethods.toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button color="primary" variant="ghost" onPress={onClose}>
                      Cerrar
                    </Button>
                  </div>
                </div>
              )}
            </ModalBody>
            // </div>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenModal} onOpenChange={onOpenChangeModal}>
        <ModalContent>
          <ModalHeader className="flex justify-center items-center">
            Correo que recibirá el cierre
          </ModalHeader>
          <hr className="separator" />
          <ModalBody className="my-2">
            <p className="tracking-tighter">
              Ingresa el correo electrónico para enviar el informe del cierre.
            </p>
            <Input
              placeholder="Correo Electrónico"
              type="email"
              value={configuration?.informationConfig?.automaticemailClosure}
              disabled
              {...registerModal("recoveryEmail", { required: true })}
            />
            <div className="h-2">
              {message && <p className="text-center text-red-500">{message}</p>}
            </div>
            <div className="flex justify-end gap-4 w-full">
              <Button
                color="primary"
                disabled={loadingReset}
                onPress={handleSendEmail}
              >
                {loadingReset ? "Cargando..." : "Continuar"}
              </Button>
              <Button color="primary" variant="ghost" onPress={onCloseModal}>
                Cancelar
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>


      <Modal isOpen={isOpenPartialClosure} onOpenChange={onOpenChangePartialClosure}>
        <ModalContent>
          <ModalHeader className="flex justify-center items-center">
            Confirmación del cierre parcial
          </ModalHeader>
          <hr className="separator" />

          <ModalBody className="my-2">
            <div className="flex items-center gap-2 w-full">
              <span className=" text-base">{getCashier()}</span>
              <span className=" text-base">
                ¿Desea realizar el cierre parcial?
              </span>
            </div>
            <div className="flex justify-end gap-4 w-full mt-6">
              <Button
                color="primary"
                disabled={loadingClose}
                onPress={handlePartialClosure}
              >
                {loadingClose ? "Cargando..." : "Generar cierre parcial"}
              </Button>
              <Button color="primary" variant="ghost" onPress={onClosePartialClosure}>
                Cancelar
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

    </section>
  );
}

export default withPermission(PaymentClosureClient, 6);