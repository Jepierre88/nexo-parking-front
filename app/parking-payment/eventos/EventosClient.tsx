"use client";

import { useState, useEffect } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { CONSTANTS } from "@/config/constants";
import axios from "axios";
import { vehicleEntrySchema } from "@/app/schemas/validationSchemas";
import withPermission from "@/app/withPermission";

function EventosClientComponent() {
  const [placa, setPlaca] = useState("");
  const [qr, setQR] = useState("");
  const [isValidPlate, setIsValidPlate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [zoneData, setZoneData] = useState<null | { usedDiscounts: number; quantityDiscounts: number }>(null);
  const [zoneError, setZoneError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  const token = Cookies.get("auth_token") || "";

  const validatePlate = (value: string) => {
    const result = vehicleEntrySchema.safeParse({ plate: value });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return false;
    }
    return true;
  };

  const handlePlacaChange = (e: any) => {
    const value = e.target.value.toUpperCase();
    setPlaca(value);
    setIsValidPlate(validatePlate(value));
  };

  const fetchZoneData = async () => {
    try {
      const userCookie = Cookies.get("user");
      if (!userCookie) throw new Error("Usuario no encontrado en cookies");

      const { zoneId } = JSON.parse(userCookie);
      const res = await axios.get(`${CONSTANTS.APIURL}/zones`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userZone = res.data.find((z: any) => z.id === zoneId);
      if (userZone) {
        setZoneData({
          usedDiscounts: userZone.usedDiscounts,
          quantityDiscounts: userZone.quantityDiscounts,
        });
        setZoneError(null);
      } else {
        setZoneError("Zona no encontrada");
      }
    } catch (err) {
      setZoneError("Error al cargar datos de zona");
    }
  };

  useEffect(() => {
    fetchZoneData();
  }, []);

  const handleAsignarEvento = async () => {
    setLoading(true);
    const toastId = toast.loading("Asignando evento...");

    if (!placa.trim() && !qr.trim()) {
      toast.error("Debe ingresar una placa o un QR", { id: toastId });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${CONSTANTS.APIURL}/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plate: placa.trim() || undefined,
          qr: qr.trim() || undefined,
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.messageBody || "Error desconocido");

      setDiscountCode(result.discountCode);
      toast.success(result.messageTitle || "Evento asignado", { id: toastId });
      setPlaca("");
      setQR("");
      setIsValidPlate(false);
      fetchZoneData();
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-full flex items-center justify-center p-6">
      <div className="bg-default-50 rounded-xl shadow-xl max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Asignar Evento</h1>

        <div className="mb-4 text-center">
          {zoneData ? (
            <span className="font-semibold">
              Eventos disponibles: {zoneData.usedDiscounts} / {zoneData.quantityDiscounts}
            </span>
          ) : (
            <span className="text-red-500">{zoneError || "Cargando datos de zona..."}</span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="Placa"
            placeholder="Ej: ABC123"
            value={placa}
            onChange={handlePlacaChange}
            variant="bordered"
          />

          <Input
            label="Código QR"
            placeholder="Escanea o pega el código"
            value={qr}
            onChange={(e) => setQR(e.target.value)}
            variant="bordered"
          />

          <Button
            isLoading={loading}
            color="primary"
            onPress={handleAsignarEvento}
            className="w-full"
          >
            Asignar Evento
          </Button>
        </div>

        {discountCode && (
          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-success">Código asignado:</p>
            <p className="text-lg font-bold">{discountCode}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// Permiso 44 para eventos
const EventosClient = withPermission(EventosClientComponent, 44);
export default EventosClient;
