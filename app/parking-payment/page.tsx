"use client";
import { Card, CardHeader } from "@nextui-org/card";
import { Tab, Tabs } from "@nextui-org/tabs";
import VisitanteQr from "./views/QrVisitor";
import Mensualidad from "./views/MontlySubscription";
import QrPerdido from "./views/QrLost";
import { useState } from "react";
import { UserData } from "@/types";
import { UseAuthContext } from "../context/AuthContext";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import UseListsPaymentMethods from "./hooks/UseListsPaymentMethods";
import { Input } from "@nextui-org/input";
import { useDisclosure } from "@nextui-org/modal";
import { ModalConfirmation } from "@/components/modales";
import { printInvoice } from "../libs/utils";
import CardPropierties from "@/components/cardPropierties";

export default function ParkingPayment() {
  const { user } = UseAuthContext();
  const { namePaymentType } = UseListsPaymentMethods("namePaymentType");
  const [subHeaderTitle, setSubHeaderTitle] = useState("Visitante (QR)");

  const [isVisible, setIsVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [userData, setUserData] = useState<UserData>({
    IVAPercentage: 0,
    IVATotal: 0,
    concept: "",
    datetime: "",
    deviceId: 0,
    discountCode: "",
    discountTotal: 0,
    grossTotal: 0,
    identificationCode: "",
    identificationType: "",
    isSuccess: false,
    messageBody: "",
    messageTitle: "",
    optionalFields: [],
    plate: "",
    plateImage: "",
    requiredFields: [],
    status: 0,
    subtotal: 0,
    total: 0,
    validationDetail: {
      validationDatetime: "- -",
      timeInParking: "",
      processId: 0,
      incomeDatetime: "- -",
      paidDateTime: "",
      expectedOutComeDatetime: "",
    },
    vehicleKind: "",
  });

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

  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const onConfirmAction = () => {
    try {
      printInvoice();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenConfirmation = (
    msg: string,
    title: string,
    action: () => void
  ) => {
    setConfirmationMessage(msg);
    setConfirmationTitle(title);
    onOpenModalConfirmation();
  };

  const handleConfirmPayment = () => {
    console.log("Pago confirmado");
    handleOpenConfirmation(
      "¿Deseas continuar con el siguiente paso?",
      "Confirmación Adicional",
      () => {
        onOpenChangeModalConfirmation();
        console.log("Proceso continuado");
      }
    );
  };

  return (
    <section className="flex flex-col lg:flex-row gap-1 justify-center items-center">
      <CardPropierties>
        <CardHeader className="flex flex-col gap-1">
          <h1 className="font-bold text-3xl text-center my-3">Procesos</h1>
        </CardHeader>
        <Tabs
          className="mx-auto"
          color="primary"
          onSelectionChange={(key) => setSubHeaderTitle(key.toString())}
        >
          <Tab title={"Visitante QR"} key="Visitante QR">
            <VisitanteQr userData={userData} setUserData={setUserData} />
          </Tab>
          <Tab title={"Mensualidad"} key="Mensualidad">
            <Mensualidad />
          </Tab>
          <Tab title={"QR perdido"} key="QR perdido">
            <QrPerdido />
          </Tab>
        </Tabs>
      </CardPropierties>

      <CardPropierties>
        <CardHeader className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl text-center">Datos de cobro</h1>
          <h1 className="font-bold text-xl text-center">{subHeaderTitle}</h1>
        </CardHeader>
        <form className="flex flex-col">
          <div className="items-start m-4">
            <div className="text-base mb-1 flex gap-4 justify-between">
              <strong>Punto de pago:</strong>
              {userData?.validationDetail.incomeDatetime.split(" ")[0]}
            </div>
            <div className="text-base mb-1 flex gap-4 justify-between">
              <strong>Cajero:</strong>
              {user.name} - {user.lastName}
            </div>
            <div className="text-base mb-1 flex gap-4 justify-between">
              <strong>Placa:</strong>
              {userData?.plate}
            </div>
            <div className="text-base mb-1 flex gap-4 justify-between">
              <strong>Tipo de vehículo:</strong>
              {userData?.vehicleKind}
            </div>
            <div className="text-base mb-1 flex gap-4 justify-between">
              <strong>Fecha de entrada:</strong>
              {userData?.validationDetail.incomeDatetime.split(" ")[0]}
            </div>
            <div className="text-base mb-1 flex gap-4 justify-between">
              <strong>Fecha de salida:</strong>
              {new Date().toISOString().split("T")[0]}
            </div>
            <div className="text-base mb-1 flex gap-4 justify-between">
              <strong>Valor a pagar:</strong>
              {userData?.total && `$${userData.total}`}
            </div>
          </div>
        </form>
      </CardPropierties>

      <CardPropierties>
        <CardHeader className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl text-center">Datos de pago</h1>
          <h1 className="font-bold text-xl text-center">{subHeaderTitle}</h1>
        </CardHeader>
        <form className="flex flex-col">
          <div className="flex flex-col place-items-end mb-1 my-2 gap-2">
            <Checkbox
              className="-mt-5"
              color="primary"
              onChange={() => setIsVisible((prev) => !prev)}
            >
              <p className="text-gray-600 my-2 px-4 mb-2">
                Facturación electrónica
              </p>
            </Checkbox>
            {isVisible && (
              <div className="flex gap-4 justify-between px-4">
                <label className="text-lg font-bold my-auto">
                  Número De Factura Electrónica
                </label>
                <Input
                  variant="underlined"
                  className="w-1/1"
                  onChange={(e) => {
                    setUserData((prev) => ({
                      ...prev,
                      identificationCode: e.target.value,
                    }));
                  }}
                />
              </div>
            )}
            <div className="text-base mb-1 mt-2 flex gap-4 justify-between px-4">
              <strong>TOTAL:</strong>
              {userData?.total && `$${userData.total}`}
            </div>

            <div className="flex gap-4 justify-between px-4">
              <label className="text-lg font-bold my-auto">Medio de pago</label>
              <Select
                className="w-52"
                size="sm"
                label="Seleccionar"
                onChange={(value) => {
                  const selectedPaymentMethod = namePaymentType.find(
                    (item) => item.namePaymentType === value
                  )?.namePaymentType;

                  setPaymentMethod(selectedPaymentMethod || "");
                }}
              >
                {namePaymentType.map((item, index) => (
                  <SelectItem
                    color="primary"
                    key={index}
                    value={item.namePaymentType}
                  >
                    {item.namePaymentType}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex gap-4 justify-between px-4">
              <label className="text-lg font-bold my-auto">Recibido</label>
              <Input
                variant="underlined"
                className="w-1/1"
                onChange={(e) => {
                  setUserData((prev) => ({
                    ...prev,
                    identificationCode: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="flex gap-4 justify-between px-4">
              <label className="text-lg font-bold my-auto">Devolución</label>
              <span> </span>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <Button
              color="primary"
              size="lg"
              onClick={() => onOpenModalConfirmation()}
            >
              Realizar pago
            </Button>
          </div>
        </form>
      </CardPropierties>

      <ModalConfirmation
        modalControl={{
          isOpen: isOpenModalConfirmation,
          onOpen: onOpenModalConfirmation,
          onClose: onCloseModalConfirmation,
          onOpenChange: onOpenChangeModalConfirmation,
        }}
        message={
          "Su pago se va a realizar en *****, ¿esta seguro de realizar el pago?"
        }
        title={"Metodo de pago"}
        onConfirm={() => {
          onOpenModalConfirmationDos();
        }}
      />

      <ModalConfirmation
        modalControl={{
          isOpen: isOpenModalConfirmationDos,
          onOpen: onOpenModalConfirmationDos,
          onClose: onCloseModalConfirmationDos,
          onOpenChange: onOpenChangeModalConfirmationDos,
        }}
        message={"¿Desea imprimir factura?"}
        title={"Imprimir factura"}
        onConfirm={() => {
          onConfirmAction();
          onCloseModalConfirmation();
        }}
      />
    </section>
  );
}
