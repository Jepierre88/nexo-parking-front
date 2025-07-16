"use client";

import {
    Input,
    Button,
    Select,
    SelectItem,
    Spinner,
    Switch,
} from "@nextui-org/react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { CONSTANTS } from "@/config/constants";
import withPermission from "@/app/withPermission";

type FormData = {
    plate: string;
    identificationNumber: string;
    zoneId: number;
    serviceId: number;
    specialRate: number;
    isActive: boolean;
};

type Option = { id: number; name?: string };

const SpecialRateClient = () => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
    } = useForm<FormData>({
        defaultValues: {
            plate: "",
            identificationNumber: "",
            zoneId: 0,
            serviceId: 0,
            specialRate: 0,
            isActive: true,
        },
    });

    const selectedZoneId = useWatch({ control, name: "zoneId" });
    const selectedServiceId = useWatch({ control, name: "serviceId" });

    const [zones, setZones] = useState<Option[]>([]);
    const [services, setServices] = useState<Option[]>([]);
    const [loading, setLoading] = useState(false);
    const [checkingPlate, setCheckingPlate] = useState(false);
    const [loadingZones, setLoadingZones] = useState(false);
    const [loadingServices, setLoadingServices] = useState(false);

    const fetchZones = async () => {
        setLoadingZones(true);
        try {
            const res = await axios.get(`${CONSTANTS.APIURL}/zones`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("auth_token")}`,
                },
            });
            setZones(res.data?.data || []);
        } catch (err: any) {
            toast.error("Error al cargar zonas disponibles");
        } finally {
            setLoadingZones(false);
        }
    };

    const fetchServices = async () => {
        setLoadingServices(true);
        try {
            const res = await axios.get(`${CONSTANTS.APIURL}/services2`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("auth_token")}`,
                },
            });
            setServices(res.data?.data || []);
        } catch (err: any) {
            toast.error("Error al cargar servicios disponibles");
        } finally {
            setLoadingServices(false);
        }
    };

    useEffect(() => {
        fetchZones();
        fetchServices();
    }, []);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        const toastId = toast.loading("Registrando tarifa especial...");
        try {
            setCheckingPlate(true);
            const { data: existing } = await axios.get(
                `${CONSTANTS.APIURL}/privateSpecialRate/by-plate`,
                {
                    params: { plate: data.plate },
                    headers: { Authorization: `Bearer ${Cookies.get("auth_token")}` },
                }
            );
            if (existing?.data) {
                toast.error("Ya existe una tarifa activa para esta placa", { id: toastId });
                return;
            }
            await axios.post(`${CONSTANTS.APIURL}/privateSpecialRate`, data, {
                headers: { Authorization: `Bearer ${Cookies.get("auth_token")}` },
            });
            toast.success("Tarifa especial creada exitosamente", { id: toastId });
            reset();
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Error al crear tarifa especial",
                { id: toastId }
            );
        } finally {
            setLoading(false);
            setCheckingPlate(false);
        }
    };

    return (
        <section className="max-w-2xl mx-auto p-6 mt-6 bg-white dark:bg-zinc-900 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4 text-center">Tarifa Especial Privada</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Placa"
                        isRequired
                        {...register("plate", { required: true })}
                    />
                    <Input
                        label="Número de identificación"
                        isRequired
                        {...register("identificationNumber", { required: true })}
                    />
                    <Select
                        label="Zona"
                        isRequired
                        isLoading={loadingZones}
                        onChange={(e) => setValue("zoneId", Number(e.target.value))}
                        selectedKeys={selectedZoneId ? [String(selectedZoneId)] : []}
                    >
                        {zones.map((zone) => (
                            <SelectItem key={zone.id} value={zone.id}>
                                {zone.name || `Zona ${zone.id}`}
                            </SelectItem>
                        ))}
                    </Select>
                    <Select
                        label="Servicio"
                        isRequired
                        isLoading={loadingServices}
                        onChange={(e) => setValue("serviceId", Number(e.target.value))}
                        selectedKeys={selectedServiceId ? [String(selectedServiceId)] : []}
                    >
                        {services.map((svc) => (
                            <SelectItem key={svc.id} value={svc.id}>
                                {svc.name || `Servicio ${svc.id}`}
                            </SelectItem>
                        ))}
                    </Select>
                    <div className="flex items-center gap-2 mt-2">
                        <Switch
                            isSelected={watch("isActive")}
                            onValueChange={(val) => setValue("isActive", val)}
                        >
                            Activo
                        </Switch>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Button
                        color="primary"
                        type="submit"
                        isDisabled={loading || checkingPlate}
                    >
                        {loading ? <Spinner size="sm" color="white" /> : "Registrar"}
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default withPermission(SpecialRateClient, 44);
