"use client";
import React, { useState, useMemo } from "react";
import {
  NextUIProvider,
  Input,
  CardHeader,
  RadioGroup,
  Radio,
  DateInput,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { useDisclosure } from "@nextui-org/react";
import {
  CalendarDate,
  CalendarDateTime,
  parseAbsoluteToLocal,
  ZonedDateTime,
} from "@internationalized/date";

import CardPropierties from "@/components/parking-payment/cardPropierties";
import ICONOCARRO from "@/public/iconoCarroOscuro.png";
import ICONOMOTO from "@/public/iconoMotoOscuro.png";
import { PaymentData } from "@/types";
import Income from "@/types/Income";
import { UseAuthContext } from "@/app/context/AuthContext";
import { ModalError, ModalExito } from "@/components/modales";
import { vehicleEntrySchema } from "@/app/schemas/validationSchemas";
import axios from "axios";
import withPermission from "@/app/withPermission";
import { Connector } from "@/app/libs/Printer";
import ActionButton from "@/components/actionButtonProps";
import { toast } from "sonner";
import UsePermissions from "@/app/hooks/UsePermissions";

const ingresoSalida = () => {
  const { hasPermission } = UsePermissions();
  const canViewDate = useMemo(() => hasPermission(28), [hasPermission]);
  const [placaIn, setPlacaIn] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleType, setVehicleType] = useState("CARRO");
  const [currentDate, setCurrentDate] = useState(
    parseAbsoluteToLocal(new Date().toISOString())
  );
  const { user } = UseAuthContext();

  const [paymentData, setPaymentData] = useState<PaymentData>({
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
      paidDatetime: "",
      expectedOutcomeDatetime: "",
    },
    vehicleKind: "",
    extraServices: [],
  });

  const handleCurrentDateChange = (
    value: CalendarDate | CalendarDateTime | ZonedDateTime | any
  ) => {
    if (value) {
      setCurrentDate(value);
    }
  };

  const INCOME_CONDITION_TYPE = {
    visitor: "Visitor",
  };

  const validatePlaca = (placa: string, checkEmpty: boolean = true) => {
    if (checkEmpty && placa.trim() === "") {
      toast.error("La placa no puede estar vacía.");
      return false;
    }

    const validationSchemas = vehicleEntrySchema.safeParse({ placa });
    if (!validationSchemas.success) {
      toast.error(validationSchemas.error.issues[0].message);
      setPlacaIn((prevPlaca) => prevPlaca.slice(0, -1));
      return false;
    }

    return true;
  };

  const handleInputChangeIn = (e: any) => {
    const placa = e.target.value.toUpperCase();
    setPlacaIn(placa);

    if (placa.trim() !== "") {
      const lastChar = placa.charAt(placa.length - 1).toUpperCase();
      setVehicleType(isNaN(Number(lastChar)) ? "MOTO" : "CARRO");
      validatePlaca(placa, false);
    }
  };

  const handlePrint = async (row: Income) => {
    const loadingToastId = toast.loading("Imprimiendo ticket de ingreso...");

    try {
      const impresora = new Connector("EPSON");
      await impresora.imprimirIngreso(row);
      toast.success("Ticket impreso correctamente.", {
        id: loadingToastId,
      });
    } catch (error) {
      toast.error("Error al imprimir el ticket.", {
        id: loadingToastId,
      });
      console.error("Error imprimiendo la factura:", error);
    }
  };

  const handleGenerateEntry = async () => {
    if (!validatePlaca(placaIn)) {
      return;
    }

    const loadingToastId = toast.loading("Registrando vehículo...");
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/access-control/visitor-service/generateContingency`,
        {
          plate: placaIn,
          vehicleKind: vehicleType,
          datetime: currentDate.toDate().toISOString(),
          identificationType: "QR",
          incomeConditionType: INCOME_CONDITION_TYPE.visitor,
        }
      );

      await handlePrint(response.data);
      toast.success("Vehículo registrado con éxito.", {
        id: loadingToastId,
      });
      setPlacaIn("");
    } catch (error) {
      toast.error("Error al registrar el vehículo.", {
        id: loadingToastId,
      });
      console.error("Error registrando el vehículo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-full">
      <div className="flex justify-between items-center h-full flex-row overflow-hidden">
        <CardPropierties className="flex-1 md:mr-2">
          <CardHeader className="flex flex-col gap-2">
            <h1 className="font-bold text-3xl text-center md:text-3xl">
              Ingreso
            </h1>
          </CardHeader>
          <form className="flex flex-col p-4">
            <div className="flex flex-col items-center justify-center gap-4 mb-4">
              <Input
                className="w-full md:w-3/4"
                label="Registro/Consulta de placa vehícular:"
                labelPlacement="outside"
                placeholder="Placa"
                size="lg"
                style={{
                  fontSize: "1.2em",
                }}
                type="text"
                maxLength={6}
                value={placaIn}
                variant="bordered"
                onChange={handleInputChangeIn}
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
                    alt="iconoCarroOscuro"
                    height={50}
                    src={ICONOCARRO}
                    width={50}
                  />
                </Radio>
                <Radio value="MOTO">
                  <Image
                    alt="iconoMotoOscuro"
                    height={50}
                    src={ICONOMOTO}
                    width={50}
                  />
                </Radio>
              </RadioGroup>
              <DateInput
                className="w-full md:w-2/3"
                hideTimeZone
                granularity="second"
                label="Fecha y Hora de ingreso"
                value={currentDate}
                onChange={handleCurrentDateChange}
                isDisabled={!canViewDate}
              />

              <Button
                color="primary"
                size="lg"
                style={{ width: "250px" }}
                onPress={handleGenerateEntry}
                isLoading={isLoading}
              >
                Registrar Vehículo
              </Button>
            </div>
          </form>
        </CardPropierties>

        <CardPropierties className="flex-1 md:mr-2">
          <CardHeader className="flex flex-col gap-2">
            <h1 className="font-bold text-3xl text-center md:text-3xl">
              Salida
            </h1>
          </CardHeader>
          <form className="flex flex-col items-center p-4">
            <div className="flex flex-col items-center justify-center gap-4 mb-4 w-full">
              {[
                {
                  label: "Punto de pago:",
                  value:
                    paymentData?.validationDetail.incomeDatetime.split("")[0],
                },
                { label: "Cajero:", value: `${user.name} ${user.lastName}` },
                { label: "Placa:", value: paymentData?.plate },
                { label: "Tipo de vehículo:", value: paymentData?.vehicleKind },
                {
                  label: "Fecha de entrada:",
                  value:
                    paymentData?.validationDetail.incomeDatetime.split(" ")[0],
                },
                {
                  label: "Fecha de salida:",
                  value: new Date().toISOString().split("T")[0],
                },
                {
                  label: "Valor a pagar:",
                  value: paymentData?.total && `$${paymentData.total}`,
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
      </div>
    </section>
  );
};

export default withPermission(ingresoSalida, 7);
