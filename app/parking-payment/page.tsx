"use client";

import { CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useEffect, useState } from "react";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";

import { UseAuthContext } from "../context/AuthContext";
import UseListsPaymentMethods from "../hooks/parking-payment/UseListsPaymentMethods";
import { usePaymentContext } from "../context/PaymentContext";

import QrPerdido from "../../components/parking-payment/tabs/QrLost";
import Mensualidad from "../../components/parking-payment/tabs/MontlySubscription";
import VisitanteQr from "../../components/parking-payment/tabs/QrVisitor";
import { ModalConfirmation } from "@/components/modales";

import CardPropierties from "@/components/parking-payment/cardPropierties";
import ExtraServices from "@/components/parking-payment/ExtraServicesCard";

import axios from "axios";
import { formatDate } from "../libs/utils";
import { Form, Tooltip } from "@nextui-org/react";
import { CartIcon } from "@/components/icons";
import withPermission from "../withPermission";
import PaymentGenerate from "@/types/PaymentGenerate";
import { initialPaymentData } from "../libs/initialStates";
import { toast } from "sonner";
import Invoice from "@/types/Invoice";
import { UseTransactions } from "../hooks/transactions/Usetransactions";
import { Connector } from "../libs/Printer";
import Cookies from "js-cookie";
import { useMemo } from "react";
import UsePermissions from "../hooks/UsePermissions";
import { CONSTANTS } from "@/config/constants";
import Factura from "@/types/Invoice";
import { set } from "react-hook-form";
import ElectronicBillDialog from "@/components/parking-payment/ElectronicBillDialog";



const EXACTS_VALUES_KEYS = [
  "Transferencia",
  "Pasarela"
]

function ParkingPayment({ }) {
  const { user } = UseAuthContext();
  const [selectedTab, setSelectedTab] = useState<string>("Visitante");
  const { namePaymentType } = UseListsPaymentMethods("namePaymentType");
  const { getTransactionForPrint } = UseTransactions();
  const [vehicleType, setVehicleType] = useState<string>("");
  const [disableMoneyReceived, setDisableMoneyReceived] = useState<boolean>(false);
  // Estados principales del componente
  const [subHeaderTitle, setSubHeaderTitle] = useState("Visitante (QR)");
  const [cardSize, setCard] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [moneyReceived, setMoneyReceived] = useState<number>(0);
  const [cashBack, setCashBack] = useState<number>(0);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const { hasPermission } = UsePermissions();
  const canViewCart = useMemo(() => hasPermission(37), [hasPermission]);
  const [resetKey, setResetKey] = useState(0);

  const { state, dispatch, paymentData, setPaymentData } = usePaymentContext();

  const {
    isOpen: isOpenModalConfirmation,
    onOpen: onOpenModalConfirmation,
    onClose: onCloseModalConfirmation,
    onOpenChange: onOpenChangeModalConfirmation,
  } = useDisclosure();

  const {
    isOpen: isOpenModalConfirmationDos,
    onOpen: onOpenModalConfirmationDos,
    onClose: onCloseModalConfirmationDos,
    onOpenChange: onOpenChangeModalConfirmationDos,
  } = useDisclosure();

  const {
    isOpen: isOpenStatusModal,
    onOpen: onOpenStatusModal,
    onClose: onCloseStatusModal,
  } = useDisclosure();

  // useEffect para actualizar 'moneyReceived' cuando 'totalCost' se actualice
  useEffect(() => {
    // Si el método de pago seleccionado está en los valores exactos, establecer el dinero recibido igual al total
    if (EXACTS_VALUES_KEYS.includes(paymentMethod)) {
      setMoneyReceived(paymentData.totalCost || 0);
      setDisableMoneyReceived(true); // Deshabilitar el campo para que no se pueda modificar
    } else {
      setMoneyReceived(0); // Reiniciar el dinero recibido si el método de pago no está en los valores exactos
      setDisableMoneyReceived(false); // Habilitar el campo para que se pueda modificar
    }
  }, [paymentMethod, paymentData.totalCost]); // Este useEffect se ejecutará cuando paymentMethod o totalCost cambien



  useEffect(() => {
    if (!paymentData.identificationCode || paymentData.identificationCode === "") {
      setMoneyReceived(0);
    }

    if (paymentData?.totalCost) {
      const totalCost = paymentData.totalCost ?? 0;
      setCashBack(Math.max(0, moneyReceived - totalCost));
    }
  }, [paymentData.identificationCode, paymentData?.totalCost, moneyReceived]);

  useEffect(() => {
    if (paymentData?.status === 110) {
      onOpenStatusModal();
      // setPaymentData({ ...paymentData, identificationCode: "" })
    }
  }, [paymentData?.status]);

  const clearCart = () => {
    dispatch({ type: "CLEAR_PAYMENTS" });
  };
  const saveMonthlyPayment = async (data: any, shouldPrint: boolean) => {
    setLoadingPayment(true);

    toast.promise(
      axios
        .post(
          `${CONSTANTS.APIURL}/MonthlySubscription/Generate`,
          data
        )
        .then(async (response: any) => {
          console.log("Pago mensual registrado:", response.data);
          setPaymentData(initialPaymentData);

          if (shouldPrint && response.data.isSuccess) {
            const printInvoice = async () => {
              try {
                const factura: Factura | null = await getTransactionForPrint(
                  response.data.centralConsecutive
                );
                console.log("FACTURA", factura);
                if (!factura) {
                  toast.error("No se pudo obtener la información de la factura.");
                  return;
                }
                const impresora = new Connector(CONSTANTS.PRINTER_NAME);
                await impresora.imprimirFacturaTransaccion(factura);
                toast.success("Factura impresa exitosamente.");
              } catch (error) {
                console.error("Error al imprimir la factura:", error);
                toast.error("Error al imprimir la factura.");
              }
            };
            await printInvoice();
          }

          setResetKey(resetKey + 1);
          return "Pago mensual registrado correctamente";
        }),
      {
        loading: "Procesando el pago mensual...",
        success: "Pago mensual registrado correctamente",
        error: (error) => {
          setPaymentData(initialPaymentData);
          setPaymentMethod("");
          console.error("Error al registrar el pago mensual:", error);
          return "Error al registrar el pago mensual. Intenta de nuevo.";
        },
        finally: () => {
          setLoadingPayment(false);
          onCloseModalConfirmationDos();
        },
      }
    );
  };
  const handlePayment = async (shouldPrint: boolean) => {
    if (subHeaderTitle === "Mensualidad") {
      const monthlyPaymentData = {
        identificationType: paymentData.identificationType || "CC",
        identificationCode: paymentData.identificationCode,
        vehicleKind: paymentData.vehicleKind?.split(" - ")[1] || "",
        plate: paymentData.plate,
        datetime: new Date().toISOString(),
        cashier: user.name || "No Asignado",
        concept: paymentData.concept,
        subtotal: paymentData.subtotal || 0,
        IVAPercentage: paymentData.IVAPercentage || 19,
        IVATotal: paymentData.IVATotal || 0,
        total: paymentData.totalCost || 0,
        monthlySubscriptionStartDatetime:
          paymentData.validationDetail
            ?.requestedMonthlySubscriptionStartDatetime,
        monthlySubscriptionEndDatetime:
          paymentData.validationDetail?.requestedMonthlySubscriptionEndDatetime,
        generationDetail: {
          paymentType:
            namePaymentType.find((e) => e.namePaymentType === paymentMethod)
              ?.id || 1,
          cashValue: moneyReceived,
          returnValue: cashBack,
        },
      };
      console.log("Datos enviados al backend:", monthlyPaymentData);
      await saveMonthlyPayment(monthlyPaymentData, shouldPrint);
      return;
    }

    const services = [];

    // Recopila servicios adicionales del carrito
    if (state?.payments) {
      state.payments.forEach((service) => {
        services.push({
          name: service.name,
          quantity: service.quantity,
          price: service.price,
          total: service.quantity * service.price,
        });
      });

      // Agrega el servicio principal (parqueadero)
      services.push({
        name: "parqueadero",
        quantity: 1,
        price: paymentData.totalParking || 0,
        total: paymentData.totalParking || 0,
      });
    }

    const dataToPay: PaymentGenerate = {
      cashier: user.name || "No Asignado",
      cashValue: moneyReceived || 0,
      concept: paymentData.concept,
      discountCode: "",
      datetime: new Date().toISOString(),
      discountTotal: 0,
      extraServices:
        paymentData.extraServices?.map(({ isLocked, ...rest }) => rest) || [],
      identificationCode: paymentData.identificationCode,
      identificationType: paymentData.identificationType || "N/A",
      IVAPercentage: paymentData.IVAPercentage || 0,
      IVATotal: Number(paymentData.subtotal?.toFixed(2) || 0),
      paymentType:
        namePaymentType.find((e) => e.namePaymentType === paymentMethod)?.id ||
        0,
      plate: paymentData.plate || "N/A",
      processId: paymentData.validationDetail?.processId || 0,
      processPaidDatetime:
        paymentData.validationDetail?.expectedOutcomeDatetime ||
        new Date().toISOString(),
      total: paymentData.totalCost || 0,
      vehicleKind: paymentData.vehicleKind || "Desconocido",
      vehicleParkingTime: paymentData.validationDetail?.timeInParking || "0",
    };

    if (paymentData.concept !== "Servicios varios") {
      dataToPay.extraServices.push({
        code: paymentData.concept,
        name: paymentData.concept,
        quantity: 1,
        unitPrice: paymentData.subtotal,
        totalPrice: paymentData.total,
        iva: paymentData.IVAPercentage,
        ivaAmount: paymentData.IVATotal,
        netTotal: paymentData.subtotal,
      });
    }

    // Enviar pago al backend
    savePayment(dataToPay, shouldPrint).then(() => {
      setMoneyReceived(0);
      setCashBack(0);
    });
  };

  // Pagar e imprimir factura
  const onConfirmAction = async () => {
    handlePayment(true); // Con impresión
  };

  // Pagar SIN imprimir factura
  const onCancelAction = async () => {
    handlePayment(false); // Sin impresión
  };

  const savePayment = async (data: any, shouldPrint: boolean) => {
    if (!paymentData.plate || paymentData.plate === "" || paymentData.plate.length < 5) {
      toast.error("El campo placa es obligatorio.");
      return;
    }
    setLoadingPayment(true);


    toast.promise(
      axios
        .post(
          `${CONSTANTS.APIURL}/generatePaymentVisitorService`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("auth_token")}`,
            },
          }
        )
        .then(async (response: any) => {
          console.log("Pago registrado:", response.data);
          setPaymentData(initialPaymentData);

          const printInvoice = async (transactionId: any) => {
            try {
              const factura: Factura | null =
                await getTransactionForPrint(transactionId);
              console.log("FACTURA", factura);

              if (!factura) {
                toast.error("No se pudo obtener la información de la factura.");
                return;
              }

              const impresora = new Connector(CONSTANTS.PRINTER_NAME);
              await impresora.imprimirFacturaTransaccion(factura);

              toast.success("Factura impresa exitosamente.");
            } catch (error) {
              console.error("Error al imprimir la factura:", error);
              toast.error("Error al imprimir la factura.");
            }
          };

          if (shouldPrint) {
            await printInvoice(response.data.transactionId);
          }

          setResetKey(resetKey + 1);
          return "Pago registrado correctamente";
        }),
      {
        loading: "Procesando el pago...",
        success: "Pago registrado correctamente",
        error: (error) => {
          setPaymentData(initialPaymentData);
          console.error("Error al registrar el pago:", error);
          return "Error al registrar el pago. Intenta de nuevo.";
        },
        finally: () => {
          setLoadingPayment(false);
          onCloseModalConfirmationDos();
        },
      }
    );
  };

  return (
    <section
      className="flex flex-col lg:flex-row flex-grow flex-1 gap-1 justify-center items-center h-full w-full"
      key={resetKey}
    >
      {/* Sección de procesos */}
      <CardPropierties>
        <CardHeader className="flex flex-col gap-1">
          <h1
            className="font-bold text-3xl text-center my-3"
            onClick={() => console.log(Cookies.get("authToken"))}
          >
            Procesos
          </h1>
        </CardHeader>
        <CardBody className="my-auto">
          {/* Tabs para diferentes tipos de procesos */}
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => {
              setSelectedTab(key.toString());
              setSubHeaderTitle(key.toString());
            }}
            color="primary"
            className="mx-auto"
          >
            <Tab key="Visitante" title={"Visitante"}>
              <VisitanteQr />
            </Tab>
            <Tab key="Mensualidad" title={"Mensualidad"}>
              <Mensualidad />
            </Tab>
            <Tab key="QR perdido" title={"QR perdido"}>
              <QrPerdido />
            </Tab>
          </Tabs>

        </CardBody>
      </CardPropierties>
      <CardPropierties>
        <CardHeader className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl text-center">Datos de cobro</h1>
          <h1 className="font-bold text-xl text-center">{subHeaderTitle}</h1>
        </CardHeader>
        <CardBody className="flex">
          <form className="flex flex-col w-full">
            <div className="items-start m-1">
              <div className="text-base text-start mb-1 flex gap-4 justify-between">
                <span className="w-full">
                  <strong>Punto de pago:</strong>
                </span>
                <span className="w-full">{user.deviceNme}</span>
              </div>
              <div className="text-base text-start mb-1 flex gap-4 justify-between">
                <span className="w-full">
                  <strong>Cajero:</strong>
                </span>
                <span className="w-full">
                  {user.name} {user.lastName}
                </span>
              </div>
              <hr className="border-t-1 border-neutral-300 my-3" />
              <div className="text-base text-start mb-1 flex gap-4 justify-between">
                <span className="w-full">
                  <strong>Placa:</strong>
                </span>
                <span className="w-full">{paymentData?.plate}</span>
              </div>
              <div className="text-base text-start mb-1 flex gap-4 justify-between">
                <span className="w-full">
                  <strong>Tipo de vehículo:</strong>
                </span>
                <span className="w-full">{paymentData?.vehicleKind}</span>
              </div>
              {subHeaderTitle !== "Mensualidad" && (
                <>
                  <div className="text-base text-start mb-1 flex gap-4 justify-between">
                    <span className="w-full">
                      <strong>Fecha de entrada:</strong>
                    </span>
                    <span className="w-full">
                      {formatDate(new Date(paymentData?.validationDetail?.incomeDatetime))}
                    </span>
                  </div>
                  <div className="text-base text-start mb-1 flex gap-4 justify-between">
                    <span className="w-full">
                      <strong>Fecha de salida:</strong>
                    </span>
                    <span className="w-full">{formatDate(new Date())}</span>
                  </div>
                  <div className="text-base text-start mb-1 flex gap-4 justify-between">
                    <span className="w-full">
                      <strong>Tiempo de parqueo:</strong>
                    </span>
                    <span className="w-full">{paymentData.validationDetail.timeInParking}</span>
                  </div>

                  <hr className="border-t-1 border-neutral-300 my-3" />
                  <div className="text-base text-start mb-1 flex gap-4 justify-between">
                    <span className="w-full">
                      <strong>Descuento parqueadero:</strong>
                    </span>
                    <span className="w-full">$</span>
                  </div>
                  <div className="text-base text-start mb-1 flex gap-4 justify-between">
                    <span className="w-full">
                      <strong>Valor parqueadero:</strong>
                    </span>
                    <span className="w-full">
                      {paymentData?.totalParking &&
                        `$${paymentData.totalParking.toLocaleString("es-CO")}`}
                    </span>
                  </div>
                </>
              )}
              <div className="text-base text-start mb-1 flex gap-4 justify-between">
                <span className="w-full">
                  <strong>Total sin IVA:</strong>
                </span>
                <span className="w-full">
                  {paymentData?.subtotal &&
                    `$${paymentData.subtotal.toLocaleString("es-CO").split(",")[0]
                    }`}
                </span>
              </div>
              <hr className="border-t-1 border-neutral-300 my-3" />
              <div className="text-base text-start mb-1 flex gap-4 justify-between">
                <span className="w-full">
                  <strong>Servicios adicionales:</strong>
                </span>
                <span className="w-full">
                  {/** TODO: Mejora en el cálculo del IVA */}
                  {paymentData?.totalServices &&
                    `$${paymentData.totalServices.toLocaleString("es-CO")}`}
                </span>
              </div>
              {subHeaderTitle === "Mensualidad" && (
                <>
                  <div className="min-h-[1rem]"></div>
                  <h1 className="font-bold text-2xl text-center">
                    Última mensualidad
                  </h1>
                  <div className="min-h-[0.3rem]"></div>
                  <div className="text-base text-start mb-1 flex gap-4 justify-between">
                    <span className="w-full">
                      <strong>Tipo:</strong>
                    </span>
                    <span className="w-full">{paymentData?.vehicleKind}</span>
                  </div>

                  <div className="text-base text-start mb-1 flex gap-4 justify-between">
                    <span className="w-full">
                      <strong>Válido hasta:</strong>
                    </span>
                    <span className="w-full">
                      {paymentData?.validationDetail
                        ?.lastMonthlySubscriptionEndDatetime
                        ? new Date(
                          paymentData.validationDetail.lastMonthlySubscriptionEndDatetime
                        ).toLocaleDateString("es-CO", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        : ""}
                    </span>
                  </div>
                </>
              )}
            </div>
          </form>
        </CardBody>
      </CardPropierties>
      <CardPropierties>
        <CardHeader className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl text-center">Datos de pago</h1>
          <h1 className="font-bold text-xl text-center">{subHeaderTitle}</h1>
        </CardHeader>
        <CardBody className="flex justify-center items-center overflow-x-hidden">
          <Form className="flex flex-col items-center justify-center w-full">
            <article className="text-3xl mb-1 mt-2 flex flex-col gap-4 justify-between px-2 w-full">
              <div className="flex gap-4 mx-auto">
                <strong>TOTAL:</strong>
                <p className="font-light tracking-tight">
                  ${paymentData.totalCost?.toLocaleString("de-DE") ?? 0}
                </p>
              </div>

              <div className="flex justify-between gap-4">
                <Checkbox className="flex-[0.4] text-xs">Facturación electrónica?</Checkbox>
                <Input className="flex-[0.6]" label={"Documento"} variant="bordered" size="sm" radius="md" />
              </div>

            </article>
            {/* <div className="flex mt-2 justify-center items-center font-light">
              <p className="text-gray-600 my-auto px-4 mb-2">
                ¿Facturación electrónica?
              </p>
              <Checkbox
                className="-mt-4"
                color="primary"
                onChange={() => setIsVisible((prev) => !prev)}
              ></Checkbox>
            </div> */}
            <div className="flex flex-col place-items-end mb-1 my-5 gap-2 w-full px-2">
              {/* <div className="flex gap-4 justify-between w-full">
                <label className="text-lg font-bold my-auto w-2/5">FE</label>
                <Input
                  className="w-3/5"
                  isDisabled={!isVisible}
                  variant={!isVisible ? "faded" : "bordered"}
                  onChange={(e) => {
                    setPaymentData((prev: any) => ({
                      ...prev,
                      identificationCode: e.target.value,
                    }));
                  }}
                />
              </div> */}

              <div className="flex gap-4 justify-between w-full">
                <label className="text-md font-bold my-auto w-2/5">
                  Medio de pago
                </label>
                <Select
                  label="Seleccionar"
                  variant="bordered"
                  className="w-3/5"
                  isRequired
                  radius="lg"
                  size="sm"
                  onChange={(e) => {
                    const selectedPaymentMethod = namePaymentType.find(
                      (item) => String(item.id) === e.target.value
                    );

                    if (selectedPaymentMethod) {
                      setPaymentMethod(selectedPaymentMethod.namePaymentType);

                      // Establecer el dinero recibido igual al total cuando "Transferencia" es seleccionado
                      if (EXACTS_VALUES_KEYS.includes(selectedPaymentMethod.namePaymentType)) {
                        setMoneyReceived(paymentData.totalCost || 0); // Esto asegura que el dinero recibido sea igual al total
                        setDisableMoneyReceived(true); // Deshabilitar el campo de ingreso de dinero
                      } else {
                        setMoneyReceived(0); // Reiniciar el dinero recibido
                        setDisableMoneyReceived(false); // Habilitar el campo para editarlo
                      }
                    } else {
                      setDisableMoneyReceived(false);
                      setPaymentMethod("");
                    }
                  }}
                >
                  {namePaymentType.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.namePaymentType}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex gap-4 justify-between w-full">
                <label className="text-lg font-bold my-auto w-2/5">
                  Recibido
                </label>
                <Input
                  className="w-3/5"
                  value={moneyReceived === 0 ? "" : moneyReceived.toString()}
                  variant="bordered"
                  startContent={<>$</>}
                  type="text"
                  isDisabled={disableMoneyReceived}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setMoneyReceived(value); // Actualiza el valor de dinero recibido cuando se cambia
                  }}
                />

              </div>
              <div className="flex gap-4 justify-between px-4">
                <label className="text-lg font-bold my-auto">
                  Devolución: ${cashBack.toLocaleString("de-DE")}
                </label>
              </div>
            </div>
          </Form>
        </CardBody>
        <CardFooter className="flex justify-center items-center">
          <Button
            color="primary"
            size="lg"
            onPress={() => {
              console.log(state.payments);
              console.log(paymentData);
              if (!paymentMethod) {
                toast.error("Por favor, selecciona un medio de pago válido");
                // TODO Modal de error para decir que se Selecciona  el tipo de pago
              } else if (moneyReceived < (paymentData.totalCost || 0)) {
                toast.error(
                  "Porfavor, ingrese el dinero para realizar el pago"
                );
              } else {
                console.log(state.payments);
                onOpenModalConfirmation();
              }
            }}
            isLoading={loadingPayment}
          >
            Realizar pago
          </Button>
        </CardFooter>
      </CardPropierties>
      <Modal
        isOpen={isOpenStatusModal}
        onOpenChange={(open) => {
          if (!open) {
            // Si se cierra el modal, limpia los datos
            setPaymentData({
              ...initialPaymentData,
              identificationCode: "",
            });
            onCloseStatusModal();
          }
        }}
        size="lg"
      >
        <ModalContent>
          <ModalHeader>
            <h1 className="flex flex-center">
              {paymentData?.messageTitle || "Información"}
            </h1>
          </ModalHeader>
          <ModalBody>
            <p>{paymentData?.messageBody || "No hay mensaje disponible."}</p>
            <Button
              color="primary"
              onPress={() => {
                setPaymentData(initialPaymentData);
                onCloseStatusModal();
              }}
            >
              Cerrar
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ModalConfirmation
        message={`Su pago se va a realizar en ${paymentMethod} ¿esta seguro de realizar el pago?`}
        modalControl={{
          isOpen: isOpenModalConfirmation,
          onOpen: onOpenModalConfirmation,
          onClose: onCloseModalConfirmation,
          onOpenChange: onOpenChangeModalConfirmation,
        }}
        title={"Metodo de pago"}
        onConfirm={() => {
          onOpenModalConfirmationDos();
        }}
      />
      <ModalConfirmation
        message={"¿Desea imprimir factura?"}
        modalControl={{
          isOpen: isOpenModalConfirmationDos,
          onOpen: onOpenModalConfirmationDos,
          onClose: onCloseModalConfirmationDos,
          onOpenChange: onOpenChangeModalConfirmationDos,
        }}
        title={"Imprimir factura"}
        onConfirm={() => {
          onConfirmAction();
          onCloseModalConfirmation();
        }}
        onCancel={() => {
          onCancelAction();
          onCloseModalConfirmation();
        }}
      />
      <div className="fixed right-4 top-20 z-30 flex flex-col">
        <div className="relative inline-block">
          {canViewCart && (
            <Tooltip
              content="Servicios adicionales"
              placement="left"
              closeDelay={100}
            >
              <Button
                isIconOnly
                radius="full"
                color="primary"
                className="flex justify-center items-center mx-auto"
                onPress={() => setShowCart(true)}
              >
                <CartIcon fill="#fff" stroke="#000" />
              </Button>
            </Tooltip>
          )}
          {/* Badge */}
          {/* {state.payments.length > 0 && (
						<span className="absolute top-0 left-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full transform translate-x-2 -translate-y-2">
							{state.payments.reduce(
								(acc, payment) => acc + payment.quantity,
								0
							)}
						</span>
					)}
				</div> */}
          {paymentData.extraServices.length > 0 && (
            <span className="absolute top-0 left-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full transform translate-x-2 -translate-y-2">
              {paymentData.extraServices.reduce(
                (acc, service) => acc + service.quantity,
                0
              )}
            </span>
          )}
        </div>
      </div>
      <ElectronicBillDialog />

      <ExtraServices showCart={showCart} setShowCart={setShowCart} />
    </section>
  );
}
export default withPermission(ParkingPayment, 4);
