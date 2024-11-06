"use client";
import React, { useState, useEffect } from "react";
import {
  NextUIProvider,
  Input,
  CardHeader,
  Checkbox,
  RadioGroup,
  Radio,
  DateInput,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { TrashIcon, LoaderIcon } from "@/components/icons";
import CardPropierties from "@/components/cardPropierties";
import ICONOCARRO from "@/public/iconoCarroOscuro.png";
import ICONOMOTO from "@/public/iconoMotoOscuro.png";
import Image from "next/image";
import { UserData } from "@/types";
import { UseAuthContext } from "@/app/context/AuthContext";
import { ModalError, ModalExito } from "@/components/modales";
import { useDisclosure } from "@nextui-org/react";
import { parseAbsoluteToLocal } from "@internationalized/date";

const Home = () => {
  const [placaIn, setPlacaIn] = useState("");
  const [placaOut, setPlacaOut] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = UseAuthContext();
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

  const [vehicleType, setVehicleType] = useState("CARRO");

  const {
    isOpen: isOpenErrorModal,
    onOpen: onOpenErrorModal,
    onClose: onCloseErrorModal,
    onOpenChange: onOpenChangeErrorModal,
  } = useDisclosure();

  const {
    isOpen: isOpenExitoModal,
    onOpen: onOpenExitoModal,
    onClose: onCloseExitoModal,
    onOpenChange: onOpenChangeExitoModal,
  } = useDisclosure();

  const [currentDate, setCurrentDate] = useState(
    parseAbsoluteToLocal(new Date().toISOString())
  );

  const handleInputChangeIn = (e: any) => {
    const placa = e.target.value;

    if (placa.length > 6) {
      setMessage("La placa debe tener exactamente 6 caracteres.");
      onOpenErrorModal();
      return;
    }

    if (placa != "") {
      if (!/^[A-Za-z0-9]+$/.test(placa)) {
        setMessage("La placa solo puede contener letras y números.");
        onOpenErrorModal();
        return;
      }

      setPlacaIn(placa);
      setIsLoading(true);

      const lastChar = placa.charAt(placa.length - 1).toUpperCase();
      if (!isNaN(lastChar)) {
        setVehicleType("CARRO");
      } else {
        setVehicleType("MOTO");
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      setPlacaIn(placa);
    }
  };

  const handleGenerateEntry = () => {
    if (placaIn === "") {
      setMessage("La placa no puede estar vacía.");
      onOpenErrorModal();
      return;
    }

    setMessage("Vehículo registrado exitosamente.");
    onOpenExitoModal();
    setPlacaIn("");
    console.log("Entrada generada:", placaIn);
  };

  return (
    <NextUIProvider>
      <div className="flex flex-col md:flex-row justify-between p-4 space-y-4 md:space-y-0">
        <CardPropierties className="flex-1 md:mr-2">
          <CardHeader className="flex flex-col gap-2">
            <h1 className="font-bold text-3xl text-center md:text-3xl">
              Ingresos De Vehículos
            </h1>
          </CardHeader>
          <form className="flex flex-col p-4">
            <div className="flex flex-col items-center justify-center gap-4 mb-4">
              <Input
                value={placaIn}
                type="text"
                label="Registro/Consulta de placa vehícular:"
                onChange={handleInputChangeIn}
                variant="bordered"
                placeholder="Ingresar Placa"
                labelPlacement="outside"
                className="w-full md:w-3/4"
                size="lg"
                style={{
                  height: "80px",
                  fontSize: "1.2em",
                }}
                endContent={
                  <LoaderIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
              />

              <RadioGroup
                className="mt-5"
                label="Detalles de ingreso"
                orientation="horizontal"
                value={vehicleType}
                onChange={() => {}}
              >
                <Radio value="CARRO">
                  <Image
                    src={ICONOCARRO}
                    alt="iconoCarroOscuro"
                    width={50}
                    height={50}
                  />
                </Radio>

                <Radio value="MOTO">
                  <Image
                    src={ICONOMOTO}
                    alt="iconoMotoOscuro"
                    width={40}
                    height={40}
                  />
                </Radio>
              </RadioGroup>

              <DateInput
                granularity="second"
                label="Fecha y Hora de ingreso"
                value={currentDate}
                onChange={setCurrentDate}
                className="w-full md:w-1/2"
              />

              <Button
                color="primary"
                size="lg"
                onClick={handleGenerateEntry}
                style={{ width: "250px" }}
              >
                Registrar Vehículo
              </Button>
            </div>
          </form>
        </CardPropierties>

        <CardPropierties className="flex-1 md:mr-2">
          <CardHeader className="flex flex-col gap-2">
            <h1 className="font-bold text-3xl text-center md:text-3xl">
              Salidas De Vehículos
            </h1>
          </CardHeader>
          <form className="flex flex-col items-center p-4">
            <div className="flex flex-col items-center justify-center gap-4 mb-4 w-full">
              {[
                {
                  label: "Punto de pago:",
                  value: userData?.validationDetail.incomeDatetime.split("")[0],
                },
                { label: "Cajero:", value: `${user.name} ${user.lastName}` },
                { label: "Placa:", value: userData?.plate },
                { label: "Tipo de vehículo:", value: userData?.vehicleKind },
                {
                  label: "Fecha de entrada:",
                  value:
                    userData?.validationDetail.incomeDatetime.split(" ")[0],
                },
                {
                  label: "Fecha de salida:",
                  value: new Date().toISOString().split("T")[0],
                },
                {
                  label: "Valor a pagar:",
                  value: userData?.total && `$${userData.total}`,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-base mb-1 flex justify-between w-full text-center"
                >
                  <strong className="text-right flex-1">{item.label}</strong>
                  <span className="flex-1">{item.value}</span>
                </div>
              ))}
            </div>
          </form>
        </CardPropierties>

        <ModalError
          modalControl={{
            isOpen: isOpenErrorModal,
            onOpen: onOpenErrorModal,
            onClose: onCloseErrorModal,
            onOpenChange: onOpenChangeErrorModal,
          }}
          message={message}
        />

        <ModalExito
          modalControl={{
            isOpen: isOpenExitoModal,
            onOpen: onOpenExitoModal,
            onClose: onCloseExitoModal,
            onOpenChange: onOpenChangeExitoModal,
          }}
          message={message}
        />
      </div>
    </NextUIProvider>
  );
};

export default Home;
