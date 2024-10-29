"use client";
import React, { useState, useEffect } from "react";
import {
  NextUIProvider,
  Input,
  CardHeader,
  Checkbox,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { TrashIcon, LoaderIcon } from "@/components/icons";
import CardPropierties from "@/components/cardPropierties";

const Home = () => {
  const [placaIn, setPlacaIn] = useState("");
  const [placaOut, setPlacaOut] = useState("");
  const [dateTimeIn, setDateTimeIn] = useState("");
  const [dateTimeOut, setDateTimeOut] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const now = new Date();
    const formattedDateTime = now
      .toLocaleString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "")
      .replace(" ", "T");
    setDateTimeIn(formattedDateTime);
    setDateTimeOut(formattedDateTime);
  }, []);

  const handleInputChangeIn = (e: any) => {
    setPlacaIn(e.target.value);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChangeOut = (e: any) => {
    setPlacaOut(e.target.value);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleGenerateEntry = () => {
    console.log("Entrada generada:", placaIn, dateTimeIn);
  };

  const handleGenerateExit = () => {
    console.log("Salida generada:", placaOut, dateTimeOut);
  };

  return (
    <NextUIProvider>
      <div className="flex content-between">
        <CardPropierties>
          <CardHeader className="flex flex-col gap-2">
            <h1 className="font-bold text-3xl text-center">
              Ingresos De Vehículos
            </h1>
          </CardHeader>
          <form className="flex flex-col" style={{ padding: "50px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <div style={{ position: "relative", marginBottom: "20px" }}>
                <Input
                  value={placaIn}
                  type="text"
                  label="Registro/Consulta de placa vehícular:"
                  onChange={handleInputChangeIn}
                  variant="bordered"
                  placeholder="Ingresar Placa"
                  labelPlacement="outside"
                  className="max-w-xs"
                  style={{
                    paddingLeft: "40px",
                    paddingRight: "40px",
                    height: "70px",
                    fontSize: "1.2em",
                    display: "flex",
                  }}
                  startContent={
                    isLoading ? (
                      <LoaderIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    ) : (
                      <></>
                    )
                  }
                  endContent={
                    <LoaderIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                />
              </div>
              <Button color="primary" size="lg" onClick={handleGenerateEntry}>
                Registrar Vehículo
              </Button>
            </div>
            <Checkbox
              className="flex bg-center -mt-5 "
              color="primary"
              onChange={() => setIsVisible((prev) => !prev)}
            >
              <p className="text-gray-600 my-2 px-4 mb-2">
                ¿Pagar día completo?
              </p>
            </Checkbox>
            <RadioGroup label="Detalles de ingreso">
              <Radio value="">
                <></>
              </Radio>
            </RadioGroup>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <label htmlFor="dateTimeIn">Fecha y Hora de entrada:</label>
              <input
                id="dateTimeIn"
                type="datetime-local"
                value={dateTimeIn}
                onChange={(e) => setDateTimeIn(e.target.value)}
                style={{ fontSize: "16px" }}
              />
            </div>
          </form>
        </CardPropierties>

        <CardPropierties>
          <CardHeader className="flex flex-col gap-2">
            <h1 className="font-bold text-3xl text-center">Salidas manuales</h1>
          </CardHeader>
          <form className="flex flex-col" style={{ padding: "50px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <div style={{ position: "relative", marginBottom: "20px" }}>
                <Input
                  value={placaOut}
                  type="text"
                  label="Placa"
                  onChange={handleInputChangeOut}
                  variant="bordered"
                  placeholder="Ingresa la placa"
                  labelPlacement="outside"
                  className="max-w-xs"
                  style={{ paddingLeft: "40px", paddingRight: "40px" }}
                  startContent={
                    isLoading ? (
                      <LoaderIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    ) : (
                      <TrashIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    )
                  }
                />
              </div>
              <Button color="primary" size="lg" onClick={handleGenerateExit}>
                Generar Salida
              </Button>
            </div>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <label htmlFor="dateTimeOut">Fecha y Hora de salida:</label>
              <input
                id="dateTimeOut"
                type="datetime-local"
                value={dateTimeOut}
                onChange={(e) => setDateTimeOut(e.target.value)}
                style={{ fontSize: "16px" }}
              />
            </div>
          </form>
        </CardPropierties>
      </div>
    </NextUIProvider>
  );
};

export default Home;
