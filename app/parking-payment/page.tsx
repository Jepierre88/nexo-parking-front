"use client";

// Importación de componentes de UI y hooks
import { CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useEffect, useState } from "react";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import { useDisclosure } from "@nextui-org/modal";

// Importación de contextos y hooks personalizados
import { UseAuthContext } from "../context/AuthContext";
import UseListsPaymentMethods from "../hooks/parking-payment/UseListsPaymentMethods";
import { usePaymentContext } from "../context/PaymentContext";

// Importación de componentes específicos
import QrPerdido from "../../components/parking-payment/tabs/QrLost";
import Mensualidad from "../../components/parking-payment/tabs/MontlySubscription";
import VisitanteQr from "../../components/parking-payment/tabs/QrVisitor";
import { ModalConfirmation } from "@/components/modales";
import CardPropierties from "@/components/parking-payment/cardPropierties";
import ExtraServices from "@/components/parking-payment/ExtraServicesCard";

// Librerías auxiliares
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
function ParkingPayment() {
  // Contexto de autenticación para obtener el usuario actual
  const { user } = UseAuthContext();

  // Lista de métodos de pago disponibles desde un hook personalizado
  const { namePaymentType } = UseListsPaymentMethods("namePaymentType");
  const { getTransactionForPrint } = UseTransactions();

  // Estados principales del componente
  const [subHeaderTitle, setSubHeaderTitle] = useState("Visitante (QR)"); // Controla el subtítulo según la pestaña activa
  const [isVisible, setIsVisible] = useState(false); // Controla la visibilidad del campo de facturación electrónica
  const [paymentMethod, setPaymentMethod] = useState(""); // Método de pago seleccionado
  const [moneyReceived, setMoneyReceived] = useState<number>(0); // Monto recibido del cliente
  const [cashBack, setCashBack] = useState<number>(0); // Monto de devolución
  const [showCart, setShowCart] = useState<boolean>(false); // Controla la visibilidad del carrito de servicios adicionales
  const [loadingPayment, setLoadingPayment] = useState(false); // Indica si se está procesando un pago
  const { hasPermission } = UsePermissions();
  const canViewCart = useMemo(() => hasPermission(37), [hasPermission]);
  const [resetKey, setResetKey] = useState(0); // Indica si

  // Contexto de pago, incluye estado del carrito y datos del pago
  const { state, dispatch, paymentData, setPaymentData } = usePaymentContext();

  // Hooks para manejar la apertura/cierre de modales
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

  // useEffect para calcular automáticamente la devolución
  useEffect(() => {
    if (paymentData?.totalCost) {
      const totalCost = paymentData?.totalCost ?? 0;
      setCashBack(Math.max(0, moneyReceived - totalCost));
    }
  }, [moneyReceived, paymentData?.totalCost]);

  // Función para limpiar el carrito de pagos
  const clearCart = () => {
    dispatch({ type: "CLEAR_PAYMENTS" });
  };

  // Función para pagar con impresion
  const onConfirmAction = async () => {
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
        price: paymentData.totalParking,
        total: paymentData.totalParking,
      });
    }

    // Actualiza los datos de pago con los servicios recopilados
    const updatedPaymentData = { ...paymentData, services };
    setPaymentData(updatedPaymentData);

    console.log(paymentData);

    // Estructura los datos del pago para enviarlos al backend
    const dataToPay: PaymentGenerate = {
      cashier: user.name,
      cashValue: moneyReceived,
      concept: paymentData.concept,
      discountCode: "",
      datetime: new Date().toISOString(),
      discountTotal: 0,
      // extraServices: [...paymentData.extraServices],
      extraServices: paymentData.extraServices.map(
        ({ isLocked, ...rest }) => rest
      ),
      identificationCode: paymentData.identificationCode,
      identificationType: paymentData.identificationType,
      IVAPercentage: paymentData.IVAPercentage,
      IVATotal: Number(paymentData.subtotal.toFixed(2)),
      paymentType: namePaymentType.find(
        (e) => e.namePaymentType === paymentMethod
      ).id,
      plate: paymentData.plate,
      processId: paymentData.validationDetail.processId,
      processPaidDatetime: paymentData.validationDetail.expectedOutcomeDatetime,
      total: paymentData.totalCost ?? 0,
      vehicleKind: paymentData.vehicleKind,
      vehicleParkingTime: paymentData.validationDetail.timeInParking,
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
    // Envía el pago al backend
    savePayment(dataToPay, true).then(() => {
      // Restablecer valores después del pago
      setMoneyReceived(0);
      setCashBack(0);
    });
  };

  // Función para pagar sin impresion
  // TODO organizar datos de parqueadero
  const onCancelAction = async () => {
    const dataToPay = {
      deviceId: paymentData.deviceId,
      identificationType: paymentData.identificationType,
      identificationCode: paymentData.identificationCode,
      concept: paymentData.concept,
      cashier: user.name,
      plate: paymentData.plate,
      datetime: paymentData.datetime,
      subtotal: paymentData.subtotal,
      IVAPercentage: paymentData.IVAPercentage,
      IVATotal: paymentData.IVATotal,
      total: paymentData.total,
      processId: paymentData.validationDetail.processId,
      generationDetail: {
        internalId: 1,
        internalConsecutive: "1",
        paymentType: paymentMethod,
      },
    };

    // Envía el pago al backend sin marcar como impreso
    savePayment(dataToPay, false);
  };

  // Función para guardar el pago en el backend
  const savePayment = async (data: any, print: boolean) => {
    setLoadingPayment(true); // Activa el indicador de carga

    toast.promise(
      axios
        .post(
          `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/access-control/visitor-service/generateNewPP`,
          data
        )
        .then(async (response: any) => {
          console.log("Pago registrado:", response.data);
          setPaymentData(initialPaymentData);

          if (print) {
            // Inicia el flujo de impresión
            await toast.promise(
              (async () => {
                const factura: Invoice = await getTransactionForPrint(
                  response.data.transactionId
                );
                console.log("FACTURA");
                console.log(factura);

                // Conectar e imprimir factura
                const impresora = new Connector("EPSON");
                await impresora.imprimirFacturaTransaccion(factura);

                return "Factura impresa correctamente.";
              })(),
              {
                loading: "Imprimiendo factura...",
                success: "Factura impresa exitosamente.",
                error: "Error al imprimir la factura.",
              }
            );
          }
          setResetKey(resetKey + 1);
          return "Pago registrado correctamente";
        }),
      {
        loading: "Procesando el pago...",
        success: (response: any) => {
          return "Pago registrado correctamente";
        },
        error: (error) => {
          setPaymentData(initialPaymentData);
          console.error("Error al registrar el pago:", error);
          return "Error al registrar el pago. Por favor, inténtalo de nuevo.";
        },
        finally: () => {
          console.log(initialPaymentData);
          setLoadingPayment(false); // Desactiva el indicador de carga
          onCloseModalConfirmationDos(); // Cierra el modal de confirmación
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
            className="mx-auto"
            color="primary"
            onSelectionChange={(key) => setSubHeaderTitle(key.toString())}
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
                <span className="w-full">{paymentData?.deviceId}</span>
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
              <div className="text-base text-start mb-1 flex gap-4 justify-between">
                <span className="w-full">
                  <strong>Fecha de entrada:</strong>
                </span>
                <span className="w-full">
                  {paymentData?.validationDetail?.incomeDatetime}
                </span>
              </div>
              <div className="text-base text-start mb-1 flex gap-4 justify-between">
                <span className="w-full">
                  <strong>Fecha de salida:</strong>
                </span>
                <span className="w-full">{formatDate(new Date())}</span>
              </div>
              <hr className="border-t-1 border-neutral-300 my-3" />
              <div className="text-base text-start mb-1 flex gap-4 justify-between">
                <span className="w-full">
                  <strong>Descuento parqueadero:</strong>
                </span>
                <span className="w-full">TO DO</span>
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
              <div className="text-base text-start mb-1 flex gap-4 justify-between">
                <span className="w-full">
                  <strong>Total sin IVA:</strong>
                </span>
                <span className="w-full">
                  {paymentData?.subtotal &&
                    `$${
                      paymentData.subtotal.toLocaleString("es-CO").split(",")[0]
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
            <div className="text-3xl mb-1 mt-2 flex gap-4 justify-between px-4">
              <strong>TOTAL:</strong>
              <p className="font-light tracking-tight">
                ${paymentData.totalCost ?? 0}
              </p>
            </div>
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
                      (item) => e.target.value == item.id
                    );

                    console.log(selectedPaymentMethod);

                    setPaymentMethod(
                      selectedPaymentMethod?.namePaymentType || ""
                    );
                  }}
                >
                  {namePaymentType.map((item) => (
                    <SelectItem
                      key={item.id}
                      color="primary"
                      value={item.namePaymentType}
                    >
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
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setMoneyReceived(value);
                  }}
                />
              </div>
              <div className="flex gap-4 justify-between px-4">
                <label className="text-lg font-bold my-auto">
                  Devolución: ${cashBack}
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
                toast.error("Porfavor, selecciona un medio de pago válido");
                // TODO Modal de error para decir que se seleccione el tipo de pago
              } else if (moneyReceived < (paymentData.totalCost || 0)) {
                toast.error(
                  "Porfavor, ingrese el dinero para realizar el pago"
                );
              } else {
                console.log(state.payments);
                onOpenModalConfirmation();
              }
            }}
            // onClick={() => {
            // 	addItem(2);
            // 	console.log(state.payments, state.total);
            // }}
            isLoading={loadingPayment}
          >
            Realizar pago
          </Button>
        </CardFooter>
      </CardPropierties>
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
                radius="full"
                color="primary"
                className="min-w-1 flex justify-center items-center right-4 h-14 mx-auto"
                onPress={() => setShowCart(true)}
              >
                <CartIcon fill="#fff" stroke="#000" width={24} height={24} />
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
      <ExtraServices showCart={showCart} setShowCart={setShowCart} />
    </section>
  );
}
export default withPermission(ParkingPayment, 4);
