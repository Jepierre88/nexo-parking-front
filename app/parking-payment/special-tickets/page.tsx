"use client";

import useSpecialTickets from "@/app/hooks/special-tickets/UseSpecialTickets";
import { Button } from "@nextui-org/button";
import { DatePicker } from "@nextui-org/date-picker";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useEffect, useState } from "react";
import {
  DateValue,
  getLocalTimeZone,
  now,
} from "@internationalized/date";
import Cookies from "js-cookie";
import { CONSTANTS } from "@/config/constants";
import { toast } from "sonner";
import { printIncome } from "@/app/utils/printIncome";
import { AxiosError } from "axios";
import { Connector } from "@/app/libs/Printer";

export default function SpecialTickets() {
  const [cantidad, setCantidad] = useState<number>(1);
  const [tipoVehiculo, setTipoVehiculo] = useState<string>("");
  const [tipoTicket, setTipoTicket] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<DateValue | null | undefined>(null); // Válido Desde
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("auth_token") || "";

  const tiposVehiculo = [
    { value: "CARRO", label: "Carro" },
    { value: "MOTO", label: "Moto" },
  ];

  const { specialTickets } = useSpecialTickets();

  const ticketsWithDateSelectable = [
    "Evento (QR)"
  ]

  const tiposTicket = specialTickets.map((service) => {
    return {
      value: service.name,
      label: service.name,
    };
  });

  useEffect(() => {
    if (!ticketsWithDateSelectable.includes(tipoTicket)) {
      const interval = setInterval(() => {
        setCurrentDate(now(getLocalTimeZone()));
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCurrentDate(now(getLocalTimeZone()));
    }
  }, [tipoTicket]);

  const getCashier = () => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      return `${userData.name} ${userData.lastName}`;
    }
    return "Usuario Desconocido";
  };


  const handleGenerateTickets = async () => {

    setLoading(true); // Establecer el estado de carga en verdader

    const data = {
      identificationType: "QR",
      quantity: cantidad,
      plate: "",
      vehicleKind: tipoVehiculo,
      incomeConditionType: tipoTicket,
      incomeConditionDetail: getCashier(),
      datetime: currentDate ? currentDate.toDate(getLocalTimeZone()).toISOString() : new Date().toISOString(), // o currentDate.toDate(getLocalTimeZone()).toISOString() si necesitas el formato ISO
    };

    console.log(data)

    const toastId = toast.loading("Generando Tickets...");

    try {
      const response = await fetch(`${CONSTANTS.APIURL}/generateManualSpecialTickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (response.status === 401) {
        Cookies.remove("auth_token");
        window.location.href = "/auth/login";
        throw new Error("No autorizado");
      }
      if (!response.ok) {
        toast.error("Error al generar los tickets", {
          id: toastId
        });
        setCantidad(1);
        setTipoVehiculo("");
        setTipoTicket("");
        setCurrentDate(null);
        throw new Error("Error al generar los tickets");
      }

      toast.success("Tickets generados correctamente", {
        id: toastId
      });



      return response.json();
    } catch (error) {
      console.error("Error al generar los tickets:", error);
      toast.error("Error al generar los tickets", {
        id: toastId
      })
      throw error;
    } finally {
      setLoading(false); // Establecer el estado de carga en falso después de la operación
    }
  };


  const handlePrintTickets = async (data: any[]) => {

    await Promise.all(
      data.map(async (ticket) => {
        try {
          const printInfo = await printIncome(ticket.id, token);
          const conector = new Connector(CONSTANTS.PRINTER_NAME);
          await conector.imprimirTicketEspecial(printInfo);
        } catch (error) {
          console.error("Error al imprimir el ticket:", error);
          if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
              toast.error("No autorizado.");
              Cookies.remove("auth_token");
              window.location.href = "/auth/login";
            } else {
              toast.error(`Error al imprimir ticket ${ticket.id}: ${error.message}`);
            }
          } else {
            toast.error(`Error inesperado al imprimir ticket ${ticket.id}`);
          }
          // No relances el error aquí
        }
      })
    )
  }

  return (
    <section className="h-full flex items-center justify-center p-6">
      <div className="bg-default-50 rounded-xl shadow-xl max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Tickets Especiales
        </h1>

        <div className="flex flex-col gap-4">
          <Input
            type="number"
            label="Cantidad de Tickets"
            value={String(cantidad)}
            onChange={(e) => setCantidad(Number(e.target.value))}
            min={1}
            variant="bordered"
          />


          <Select
            label="Tipo de Vehículo"
            placeholder="Seleccione el tipo de vehículo"
            selectedKeys={[tipoVehiculo]}
            onSelectionChange={(e) => setTipoVehiculo(e.currentKey ? e.currentKey : "")}
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
            selectedKeys={[tipoTicket]}
            onSelectionChange={(e) => {
              setTipoTicket(e.currentKey ? e.currentKey : "");
              console.log(tipoTicket)
              if (!ticketsWithDateSelectable.includes(e.currentKey ? e.currentKey : "")) {
                setCurrentDate(now(getLocalTimeZone()));
              }
            }}
            variant="bordered"
          >
            {tiposTicket.map((tipo) => (
              <SelectItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </SelectItem>
            ))}
          </Select>

          <DatePicker
            aria-label="Válido Desde"
            size="lg"
            variant="bordered"
            hideTimeZone
            isDisabled={!ticketsWithDateSelectable.includes(tipoTicket)}
            value={currentDate as any}
            onChange={(value) => {
              setCurrentDate(value);
            }}
          />

          <Button
            className="w-full mt-4"
            isLoading={loading}
            isDisabled={
              !cantidad || !tipoVehiculo || !tipoTicket || (!currentDate && ticketsWithDateSelectable.includes(tipoTicket))
            }
            onPress={() => {
              handleGenerateTickets()
                .then((data) => {
                  // ✅ Resetear los campos si se generaron los tickets correctamente
                  setCantidad(1);
                  setTipoVehiculo("");
                  setTipoTicket("");
                  setCurrentDate(null);

                  // Luego imprimir
                  handlePrintTickets(data);
                })
                .catch((error) => {
                  console.error("Error al generar los tickets:", error);
                  toast.error("Error al generar los tickets");
                });
            }}
            color="primary"
          >
            Generar Tickets
          </Button>


        </div>
      </div>
    </section>
  );
}
