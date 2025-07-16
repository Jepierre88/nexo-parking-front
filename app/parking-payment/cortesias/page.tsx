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
import { vehicleEntrySchema } from "@/app/schemas/validationSchemas";
import axios from "axios";


export default function Cortesias() {
    const [cantidad, setCantidad] = useState<number>(1);
    const [tipoVehiculo, setTipoVehiculo] = useState<string>("");
    const [tipoTicket, setTipoTicket] = useState<string>("");
    const [currentDate, setCurrentDate] = useState<DateValue | null | undefined>(null); // Válido Desde
    const [loading, setLoading] = useState(false);

    // Estado para los datos de la zona
    const [zoneData, setZoneData] = useState<{ usedDiscounts: number; quantityDiscounts: number } | null>(null);
    const [zoneLoading, setZoneLoading] = useState(true);
    const [zoneError, setZoneError] = useState<string | null>(null);

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

    // Consultar la API para obtener los datos de la zona
    const fetchZone = async () => {
        // Obtener zoneId del usuario desde la cookie
        const userCookie = Cookies.get("user");
        if (!userCookie) {
            setZoneError("No se encontró información de usuario");
            setZoneLoading(false);
            return;
        }
        const userData = JSON.parse(userCookie);
        const zoneId = userData.zoneId;
        if (!zoneId) {
            setZoneError("No se encontró zoneId en el usuario");
            setZoneLoading(false);
            return;
        }
        try {
            setZoneLoading(true);
            const res = await axios.get(`${CONSTANTS.APIURL}/zones`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const myZone = res.data.find((zone: any) => zone.id === zoneId);
            if (myZone) {
                setZoneData({
                    usedDiscounts: myZone.usedDiscounts || 0,
                    quantityDiscounts: myZone.quantityDiscounts || 0,
                });
                setZoneError(null);
            } else {
                setZoneError("No se encontró la zona del usuario");
            }
        } catch (err: any) {
            setZoneError("Error al obtener datos de la zona");
        } finally {
            setZoneLoading(false);
        }
    };

    useEffect(() => {
        fetchZone();
    }, [token]);

    const getCashier = () => {
        const userCookie = Cookies.get("user");
        if (userCookie) {
            const userData = JSON.parse(userCookie);
            return `${userData.name} ${userData.lastName}`;
        }
        return "Usuario Desconocido";
    };


    const handleAssignCourtesy = async () => {
        setLoading(true);
        const toastId = toast.loading("Asignando cortesía...");

        const body: { plate?: string; qr?: string } = {};
        if (placaIn.trim()) body.plate = placaIn.trim();
        if (QRIn.trim()) body.qr = QRIn.trim();

        if (!body.plate && !body.qr) {
            toast.error("Debe ingresar una placa o un QR", { id: toastId });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${CONSTANTS.APIURL}/courtesy`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result?.messageBody || "Error asignando cortesía");

            toast.success(result.messageTitle || "Cortesía asignada", { id: toastId });
            setPlacaIn("");
            setQRIn("");
            setIsPlacaValid(false);
            // Actualizar el contador de cortesías
            fetchZone();
        } catch (err: any) {
            toast.error(`Error: ${err.message}`, { id: toastId });
        } finally {
            setLoading(false);
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


    const validatePlaca = (placa: string, checkEmpty: boolean = true) => {
        if (checkEmpty && placa.trim() === "") {
            toast.error("La placa no puede estar vacía.");
            return false;
        }

        const validationSchemas = vehicleEntrySchema.safeParse({ plate: placa });
        if (!validationSchemas.success) {
            toast.error(validationSchemas.error.issues[0].message);
            setPlacaIn((prevPlaca) => prevPlaca.slice(0, -1));
            return false;
        }

        return true;
    };
    const [placaIn, setPlacaIn] = useState("");
    const [vehicleType, setVehicleType] = useState("CARRO");
    const [vehicleTypeOut, setVehicleTypeOut] = useState("CARRO");
    const [isPlacaValid, setIsPlacaValid] = useState(false);

    const handleInputChangeIn = (e: any) => {
        const placa = e.target.value.toUpperCase();
        setPlacaIn(placa);

        if (placa.trim() !== "") {
            const lastChar = placa.charAt(placa.length - 1).toUpperCase();
            setVehicleType(isNaN(Number(lastChar)) ? "MOTO" : "CARRO");
            const valid = validatePlaca(placa, false);
            setIsPlacaValid(valid);
        } else {
            setIsPlacaValid(false);
        }
    };

    const [QRIn, setQRIn] = useState("");

    return (
        <section className="h-full flex items-center justify-center p-6">
            <div className="bg-default-50 rounded-xl shadow-xl max-w-md w-full p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Asignación de cortesias
                </h1>
                {/* Contador de cortesías */}
                <div className="mb-4 text-center">
                    {zoneLoading ? (
                        <span>Cargando cortesías...</span>
                    ) : zoneError ? (
                        <span className="text-red-500">{zoneError}</span>
                    ) : zoneData ? (
                        <span className="font-semibold">Cortesías restantes: {zoneData.usedDiscounts} / {zoneData.quantityDiscounts}</span>
                    ) : null}
                </div>

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
                <div className="flex flex-col items-start w-full p-2">
                    <label className="block font-sans text-right text-[16px] font-semibold leading-[24px]  decoration-skip-ink-none decoration-from-font mb-2">
                        QR
                    </label>
                    <Input
                        placeholder="QR"
                        size="md"
                        type="text"
                        variant="bordered"
                        className="w-full"
                        value={QRIn}
                        onChange={(e) => setQRIn(e.target.value)}
                    />

                </div>
                <Button
                    className="w-full mt-4"
                    isLoading={loading}

                    onPress={async () => {
                        try {
                            await handleAssignCourtesy();

                            // ✅ Resetear campos si la cortesía fue asignada correctamente
                            setCantidad(1);
                            setPlacaIn("");
                            setTipoTicket("");
                            setCurrentDate(null);
                            setIsPlacaValid(false);
                        } catch (error) {
                            console.error("Error al generar la cortesía:", error);
                            toast.error("Error al generar la cortesía");
                        }
                    }}

                    color="primary"
                >
                    Generar Cortesia
                </Button>
            </div>
        </section>
    );
}
