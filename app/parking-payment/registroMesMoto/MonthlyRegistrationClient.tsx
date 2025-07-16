"use client";

import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Spinner,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import { CONSTANTS } from "@/config/constants";

type FormData = {
  plate?: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  identificationNumber: string;
  phoneNumber?: string;
  zoneId: number;
};

type ZoneOption = {
  id: number;
  name: string;
};

const defaultValues: FormData = {
  plate: "",
  firstName: "",
  secondName: "",
  firstLastName: "",
  secondLastName: "",
  identificationNumber: "",
  phoneNumber: "",
  zoneId: 0,
};

const MonthlyRegistrationClient = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {},
    control,
  } = useForm<FormData>({
    defaultValues,
  });

  const selectedZoneId = useWatch({ control, name: "zoneId" });

  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState<ZoneOption[]>([]);
  const [loadingZones, setLoadingZones] = useState(false);

  const fetchZones = async () => {
    setLoadingZones(true);
    try {
      const res = await axios.get(`${CONSTANTS.APIURL}/zones`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("auth_token")}`,
        },
      });

      console.log("Respuesta zonas:", res.data); // 👈 útil para debug

      setZones(res.data?.data || []);
    } catch (error) {
      toast.error("Error al cargar zonas disponibles");
    } finally {
      setLoadingZones(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const toastId = toast.loading("Registrando mensualidad...");
    try {
      const response = await axios.post(
        `${CONSTANTS.APIURL}/monthlyPersonRegistration`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
      );

      toast.success(response.data.message || "Registro exitoso", {
        id: toastId,
      });
      reset(defaultValues);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Ocurrió un error al registrar la mensualidad",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-6 mt-4 bg-white dark:bg-zinc-900 rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Registro de Persona para Mensualidad
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Placa"
            maxLength={6}
            {...register("plate", { required: true })}
          />
          <Input
            label="Primer Nombre"
            isRequired
            {...register("firstName", { required: true })}
          />
          <Input label="Segundo Nombre" {...register("secondName")} />
          <Input
            label="Primer Apellido"
            isRequired
            {...register("firstLastName", { required: true })}
          />
          <Input label="Segundo Apellido" {...register("secondLastName")} />
          <Input
            label="Número de Identificación"
            isRequired
            {...register("identificationNumber", { required: true })}
          />
          <Input label="Teléfono" {...register("phoneNumber")} />

          <Select
            label="Zona"
            isRequired
            isLoading={loadingZones}
            onChange={(e) => setValue("zoneId", Number(e.target.value))}
            selectedKeys={selectedZoneId ? [String(selectedZoneId)] : []}
          >
            {(Array.isArray(zones) ? zones : []).map((zone) => (
              <SelectItem key={String(zone.id)} value={String(zone.id)}>
                {zone.name || `Zona ${zone.id}`}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            color="primary"
            type="submit"
            size="lg"
            isDisabled={loading}
          >
            {loading ? <Spinner color="white" size="sm" /> : "Registrar"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default MonthlyRegistrationClient;
