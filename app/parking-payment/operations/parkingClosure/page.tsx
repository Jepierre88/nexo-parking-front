"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@nextui-org/button";
import { GridColDef, GridValueOptionsParams } from "@mui/x-data-grid";
import {
  ModalContent,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalBody,
} from "@nextui-org/modal";
import { DateRangePicker, Input } from "@nextui-org/react";
import UseClosure from "@/app/hooks/parking-payment/UseClosure";
import CustomDataGrid from "@/components/customDataGrid";
import withPermission from "@/app/withPermission";
import { LargeEyeIcon, LargeSendIcon, PrinterIcon } from "@/components/icons";
import UsePermissions from "@/app/hooks/UsePermissions";
import { toast } from "sonner";
import { Connector } from "@/app/libs/Printer";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import {
  ClosureDetails,
  Encabezado,
  Transaction,
  TransactionItem,
} from "@/types/Closure";
import { CustomTooltip, ActionTooltips } from "@/components/customTooltip";
import UseConfigurationData from "@/app/hooks/UseConfigurationData";

function parkingClosure() {
  const { hasPermission } = UsePermissions();
  const { closure, getClosure, postClosure } = UseClosure();
  const [closureData, setClosureData] = useState<
    [Encabezado, Transaction[], ClosureDetails] | null
  >(null);
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
    register: registerModal,
    handleSubmit: handleSubmitModal,
    reset: resetModal,
    getValues: getValuesModal,
  } = useForm();

  //este se cambia por el UseRecibirCirreAlCorreo
  const { postsendEmail, loading: loadingReset } = UseClosure();
  const [isDark, setIsDark] = useState(false);
  const canPrinterClosure = useMemo(() => hasPermission(25), [hasPermission]);
  const canSeeClouse = useMemo(() => hasPermission(24), [hasPermission]);
  const canSendClouse = useMemo(() => hasPermission(42), [hasPermission]);
  const [limit, setLimit] = useState("");
  const [currentClosureId, setCurrentClosureId] = useState<number | null>(null);
  const { getClosureDetails } = UseClosure();
  const [loadingClose, setLoadingClose] = useState(false);
  const { configuration, getConfiguration } = UseConfigurationData();
  useEffect(() => {
    getClosure();
  }, []);
  useEffect(() => {
    getConfiguration();
  }, []);

  useEffect(() => {
    console.log("Configuración actual:", configuration);
  }, [configuration]);
  const [message, setMessage] = useState("");
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

  const handleSendEmail = async () => {
    const email = getValuesModal("recoveryEmail");
    if (!currentClosureId) {
      toast.error("No se ha seleccionado un cierre");
      return;
    }
    setLoading(true);
    try {
      const result = await postsendEmail(currentClosureId, email);
      if (result) {
        const toastId = toast.success("Informe enviado con éxito");
        resetModal();
        setTimeout(() => {
          toast.dismiss(toastId);
          setTimeout(() => {
            onCloseModal();
          }, 500);
        }, 1500);
      } else {
        toast.error("Error al enviar el correo");
      }
    } catch (error) {
      setMessage("Error al enviar el correo");
      toast.error("Error al enviar el correo");
    } finally {
      setLoading(false);
      setCurrentClosureId(null);
    }
  };
  useEffect(() => {
    if (!isOpenModal) {
      resetModal();
      setMessage("");
    }
  }, [isOpenModal]);

  const handleViewDetails = async (row: { id: number }) => {
    try {
      const closureDetails = await getClosureDetails(row.id);
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
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id Cierre",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cashier",
      headerName: "Realizó el cierre",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "datetime",
      headerName: "Fecha de cierre",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "initialConsecutive",
      headerName: "Corte inicial",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "finalConsecutive",
      headerName: "Corte final",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "deviceName",
      headerName: "Punto de pago",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: () => getDeviceName(),
    },

    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex justify-center items-center gap-2 h-full w-full">
          <CustomTooltip content={ActionTooltips.VIEW}>
            <Button
              className="w-auto h-auto flex items-center justify-center p-0 min-w-0"
              color="default"
              variant="light"
              isDisabled={!canSeeClouse}
              size="sm"
              onPress={() => {
                handleViewDetails(params.row);
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
              onPress={() => handlenPrint(params.row)}
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
                setCurrentClosureId(params.row.id);
                onOpenModal();
              }}
            >
              <LargeSendIcon fill={isDark ? "#FFF" : "#000"} />
            </Button>
          </CustomTooltip>
        </div>
      ),
    },
  ];

  const handlenPrint = async (row: { id: number }) => {
    const loadingToastId = toast.loading("Obteniendo datos del cierre");

    try {
      if (!row.id) {
        toast.error("Id del cierre no valido.", { id: loadingToastId });
        return;
      }

      const closureDetails = await getClosureDetails(row.id);
      if (!closureDetails) {
        toast.error("No se encontraron datos para imprimir.", {
          id: loadingToastId,
        });
        return;
      }

      const impresora = new Connector("EPSON");
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

  const handleClose = async () => {
    const cashier = getCashier();
    setLoadingClose(true);
    try {
      const result = await postClosure(cashier);
      if (result) {
        toast.success("Cierre realizado con éxito");
        onCloseClose();
        await getClosure();
      } else {
        toast.error("Error al realizar el cierre");
      }
    } catch (error) {
      toast.error("Error al realizar el cierre");
    } finally {
      setLoadingClose(false);
    }
  };
  return (
    <section className="h-full">
      <div className="flex justify-between items-center flex-col xl:flex-row overflow-hidden">
        <h1 className="text-4xl font-bold my-3 h-20 text-center items-center content-center ">
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
          <Input
            label={"N° De Registros"}
            maxLength={6}
            size="md"
            value={limit}
            onChange={(e) => setLimit(e.target.value.toUpperCase())}
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
      <div className="flex items-end flex-col xl:flex-row overflow-hidden -mb-14">
        <div className="flex my-3 justify-end gap-4 items-center h-min flex-wrap md:flex-nowrap w-full">
          <Button
            className="p-6 px-20 bg-primary w-2 relative z-10 text-white"
            color="primary"
            variant="shadow"
            isDisabled={loading}
            onPress={onOpenClose}
          >
            Realizar cierre
          </Button>
        </div>
      </div>
      <CustomDataGrid columns={columns} rows={closure} loading={loading} />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
        classNames={{
          base: " max-h-[96vh]",
          body: "p-0 max-h-[98vh] overflow-y-auto",
          wrapper: "h-[90vh]",
        }}
      >
        <ModalContent>
          {() => (
            <div className="flex flex-col items-start w-full p-4">
              <ModalBody className="flex w-full">
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
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-full">
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
                              <th className="text-left">Item</th>
                              <th className="text-center">Cant</th>
                              <th className="text-right">Total</th>
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
                              <th className="text-left">Item</th>
                              <th className="text-center">Cant</th>
                              <th className="text-right">Total</th>
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
                              <th className="text-left">Item</th>
                              <th className="text-center">Cant</th>
                              <th className="text-right">Total</th>
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
            </div>
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
      <Modal isOpen={isOpenClose} onOpenChange={onOpenChangeClose}>
        <ModalContent>
          <ModalHeader className="flex justify-center items-center">
            Informe Parcial
          </ModalHeader>
          <hr className="separator" />
          <ModalBody className="my-2">
            <Input
              placeholder="Cierre del operador:"
              type="string"
              value={getCashier()}
            />
            <div className="flex justify-end gap-4 w-full">
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
      ;
    </section>
  );
}
export default withPermission(parkingClosure, 6);
