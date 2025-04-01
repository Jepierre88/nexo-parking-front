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
import {
  CalendarDate,
  CalendarDateTime,
  parseAbsoluteToLocal,
  ZonedDateTime,
} from "@internationalized/date";
import CardPropierties from "@/components/parking-payment/cardPropierties";
import ICONOCARRO from "@/public/iconoCarroOscuro.png";
import ICONOMOTO from "@/public/iconoMotoOscuro.png";
import Income from "@/types/Income";
import { vehicleEntrySchema } from "@/app/schemas/validationSchemas";
import axios from "axios";
import { Connector } from "@/app/libs/Printer";
import { toast } from "sonner";
import UsePermissions from "@/app/hooks/UsePermissions";
import UseIngresoSalida from "@/app/hooks/ingresoSalida/UseIngresoSalida";
import withPermission from "@/app/withPermission";
import { formatDate } from "@/app/libs/utils";
import { CONSTANTS } from "@/config/constants";

const enterExit = ({ }) => {
  const { hasPermission } = UsePermissions();
  const canViewDate = useMemo(() => hasPermission(28), [hasPermission]);
  // const canViewDateOutcome = useMemo(() => hasPermission(41), [hasPermission]);
  const [placaIn, setPlacaIn] = useState("");
  const [placaOut, setPlacaOut] = useState("");
  const [QRIn, setQRIn] = useState("");
  const [QROut, setQROut] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleType, setVehicleType] = useState("CARRO");
  const [vehicleTypeOut, setVehicleTypeOut] = useState("CARRO");
  const { outcomeManual, loading } = UseIngresoSalida();
  const [currentDate, setCurrentDate] = useState<any>(
    parseAbsoluteToLocal(new Date().toISOString())
  );

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

    const validationSchemas = vehicleEntrySchema.safeParse({ plate: placa });
    if (!validationSchemas.success) {
      toast.error(validationSchemas.error.issues[0].message);
      setPlacaIn((prevPlaca) => prevPlaca.slice(0, -1));
      setPlacaOut((prevPlaca) => prevPlaca.slice(0, -1));
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

  const handleInputChangeOn = (e: any) => {
    const placa = e.target.value.toUpperCase();
    setPlacaOut(placa);

    if (placa.trim() !== "") {
      const lastChar = placa.charAt(placa.length - 1).toUpperCase();
      setVehicleTypeOut(isNaN(Number(lastChar)) ? "MOTO" : "CARRO");
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

  const handleGenerateExit = async () => {
    const loadingToastId = toast.loading("Registrando salida...");

    try {
      const response = await outcomeManual(placaOut);

      if (response) {
        toast.dismiss(loadingToastId);
        console.log("Salida registrada con exito");
        setPlacaOut("");
      } else {
        toast.dismiss(loadingToastId);
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      console.error("Error al registrar la salida:", error);
    }
  };

  const handleGenerateEntry = async () => {
    if (placaIn.length !== 6) {
      toast.error("La placa debe tener exactamente 6 caracteres.");
      return;
    }

    if (!validatePlaca(placaIn)) {
      return;
    }

    const loadingToastId = toast.loading("Registrando vehículo...");
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${CONSTANTS.APIURL}/access-control/visitor-service/generateContingency`,
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
      console.error("Error registrando el vehículo:", error);
      let errorMsg = "Error al registrar el vehículo.";
      if (axios.isAxiosError(error) && error.response) {
        errorMsg =
          error.response.data?.error?.message ||
          error.response.data?.message ||
          errorMsg;
      }
      toast.error(errorMsg, { id: loadingToastId });
      setPlacaIn("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-full flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
        <CardPropierties className="flex-1 flex flex-col  items-center max-w-md mx-auto">
          <CardHeader className="flex flex-col ">
            <h1 className="font-bold text-2xl text-center">Ingreso</h1>
          </CardHeader>
          <form className="flex flex-col p-4">
            <div className="flex flex-col items-center justify-center gap-4 ">
              <div className="flex flex-col items-start w-full">
                <label className=" block font-sans text-right text-[16px] font-semibold leading-[24px]  decoration-skip-ink-none decoration-from-font mb-2 ">
                  Registrar placa
                </label>

                <Input
                  placeholder="Placa"
                  size="md"
                  type="text"
                  value={placaIn}
                  variant="bordered"
                  className="w-full"
                  onChange={handleInputChangeIn}
                />
              </div>
              <div className="flex flex-col items-start w-full">
                <label className="block font-sans text-right text-[16px] font-semibold leading-[24px]  decoration-skip-ink-none decoration-from-font mb-2">
                  QR (solo lectura)
                </label>
                <Input
                  placeholder="QR"
                  size="md"
                  type="text"
                  value={QRIn}
                  variant="bordered"
                  className="w-full"
                  onChange={handleInputChangeIn}
                  isDisabled
                />
              </div>
              <RadioGroup
                className="mt-0"
                label="Detalles de ingreso"
                orientation="horizontal"
                value={vehicleType}
                onChange={() => { }}
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
              <div className="flex flex-col items-start w-full">
                <label className="block font-sans text-right text-[16px] font-semibold leading-[24px]  decoration-skip-ink-none decoration-from-font mb-2">
                  Fecha y hora de ingreso
                </label>
                <DateInput
                  className="w-full "
                  hideTimeZone
                  style={{ width: "280px" }}
                  granularity="second"
                  value={currentDate}
                  onChange={handleCurrentDateChange}
                  isDisabled={!canViewDate}
                />
              </div>
              <Button
                color="primary"
                size="md"
                style={{ width: "220px" }}
                onPress={handleGenerateEntry}
                isLoading={isLoading}
              >
                Registrar Ingreso
              </Button>
            </div>
          </form>
        </CardPropierties>
        <CardPropierties className="flex-1 flex flex-col items-center max-w-md mx-auto">
          <CardHeader className="flex flex-col">
            <h1 className="font-bold text-2xl text-center">Salida</h1>
          </CardHeader>
          <form className="flex flex-col p-4">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex flex-col items-start w-full">
                <label className="block font-sans text-right text-[16px] font-semibold leading-[24px]  decoration-skip-ink-none decoration-from-font mb-2">
                  Consultar placa
                </label>

                <Input
                  placeholder="Placa"
                  size="md"
                  type="text"
                  value={placaOut}
                  variant="bordered"
                  className="w-full"
                  onChange={handleInputChangeOn}
                />
              </div>

              <div className="flex flex-col items-start w-full ">
                <label className="block font-sans text-right text-[16px] font-semibold leading-[24px]  decoration-skip-ink-none decoration-from-font mb-2">
                  QR (solo lectura)
                </label>
                <Input
                  placeholder="QR"
                  size="md"
                  type="text"
                  maxLength={6}
                  value={QROut}
                  variant="bordered"
                  className="w-full"
                  onChange={handleInputChangeOn}
                  isDisabled
                />
              </div>
              <RadioGroup
                className="mt-0"
                label="Detalles de ingreso"
                orientation="horizontal"
                value={vehicleTypeOut}
                onChange={() => { }}
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
              {/* <div className="flex flex-col items-start w-full">
                <label className="block font-sans text-right text-[16px] font-semibold leading-[24px]  decoration-skip-ink-none decoration-from-font mb-2">
                  Fecha y hora de ingreso
                </label>
                <DateInput
                  className="w-full"
                  hideTimeZone
                  size="md"
                  granularity="second"
                  onChange={handleCurrentDateChange}
                  isDisabled={!canViewDateIncome}
                />
              </div> */}
              <div className="flex flex-col items-start w-full">
                <label className="block font-sans text-right text-[16px] font-semibold leading-[24px]  decoration-skip-ink-none decoration-from-font mb-2">
                  Fecha y hora de salida
                </label>
                <DateInput
                  className="w-full !text-black"
                  hideTimeZone
                  size="md"
                  granularity="second"
                  value={currentDate}
                  onChange={handleCurrentDateChange}
                  isReadOnly

                // isDisabled={!canViewDateOutcome}
                />

                {/* <div className="w-full">{formatDate(new Date())}</div> */}
              </div>
              <Button
                className="w-full"
                color="primary"
                size="md"
                style={{ width: "240px" }}
                onPress={handleGenerateExit}
                isLoading={loading}
              >
                Registrar Salida
              </Button>
            </div>
          </form>
        </CardPropierties>
      </div>
    </section>
  );
};

export default withPermission(enterExit, 7);
