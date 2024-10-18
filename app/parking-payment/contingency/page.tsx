"use client";
import React, { useState, useEffect } from "react";
import { NextUIProvider, Input } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { TrashIcon } from "@/components/icons";
const Home = () => {
  const [placa, setPlaca] = useState("");
  const [dateTime, setDateTime] = useState("");

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
    setDateTime(formattedDateTime);
  }, []);

  return (
    <NextUIProvider>
      <div style={{ padding: "50px" }}>
        <label>Placa</label>
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
              value={placa}
              type="text"
              label="Placa"
              onChange={(e) => setPlaca(e.target.value)}
              variant="bordered"
              placeholder="Ingresa la placa"
              labelPlacement="outside"
              className="max-w-xs"
              style={{ paddingLeft: "40px", paddingRight: "40px" }}
              startContent={
                <TrashIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
            />
          </div>
          <Button color="primary" size="lg">
            Generar nueva entrada
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
          <h1>Fecha y Hora de entrada:</h1>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            style={{ fontSize: "16px" }}
          />
        </div>
      </div>
    </NextUIProvider>
  );
};

export default Home;
