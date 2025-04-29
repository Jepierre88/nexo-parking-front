"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useState } from "react";

export default function SpecialTickets() {
  const [cantidad, setCantidad] = useState<number>(1);
  const [tipoVehiculo, setTipoVehiculo] = useState<string>("");
  const [tipoTicket, setTipoTicket] = useState<string>("");

  const tiposVehiculo = [
    { value: "CARRO", label: "Carro" },
    { value: "MOTO", label: "Moto" },
    { value: "BICICLETA", label: "Bicicleta" },
  ];

  const tiposTicket = [
    { value: "CORTESIA", label: "Cortesía" },
    { value: "EVENTO", label: "Evento" },
    { value: "ESPECIAL", label: "Especial" },
  ];

  const handleImprimir = () => {
    // Aquí irá la lógica de impresión
    console.log({
      cantidad,
      tipoVehiculo,
      tipoTicket,
    });
  };

  return (
    <section className="h-full flex items-center justify-center p-6">
      <div className="bg-default-50 rounded-xl shadow-xl max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Tickets Especiales</h1>
        
        <div className="flex flex-col gap-4">
          <Input
            type="number"
            label="Cantidad de Tickets"
            placeholder="Ingrese la cantidad"
            value={String(cantidad)}
            onChange={(e) => setCantidad(Number(e.target.value))}
            min={1}
            variant="bordered"
          />

          <Select
            label="Tipo de Vehículo"
            placeholder="Seleccione el tipo de vehículo"
            value={tipoVehiculo}
            onChange={(e) => setTipoVehiculo(e.target.value)}
            variant="bordered"
          >
            {tiposVehiculo.map((tipo) => (
              <SelectItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Tipo de Ticket"
            placeholder="Seleccione el tipo de ticket"
            value={tipoTicket}
            onChange={(e) => setTipoTicket(e.target.value)}
            variant="bordered"
          >
            {tiposTicket.map((tipo) => (
              <SelectItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </SelectItem>
            ))}
          </Select>

          <Button 
            color="primary"
            className="w-full mt-4"
            onPress={handleImprimir}
          >
            Imprimir Tickets
          </Button>
        </div>
      </div>
    </section>
  );
}