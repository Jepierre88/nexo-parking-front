import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useEffect, useMemo, useState } from "react";
import { usePaymentContext } from "@/app/context/PaymentContext";
import UsePermissions from "@/app/hooks/UsePermissions";
import { montleSubscription } from "@/app/schemas/validationSchemas";
import { z } from "zod";
import { dateValidationSchema } from "@/app/schemas/validationSchemas";
import UseServices from "@/app/hooks/parking-payment/UseServices";
import { Button } from "@nextui-org/button";
import UseInformationList from "@/app/hooks/parking-payment/UseInformationList";
import { Spinner } from "@nextui-org/react";
import { format, parseISO } from "date-fns";

export default function Mensualidad() {
  const { paymentData, setPaymentData } = usePaymentContext();
  const [plateError, setPlateError] = useState<string | null>(null);
  const { services, isLoading } = UseServices("Mensualidad");
  const { listInformation } = UseInformationList();

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [schedulingZone, setSchedulingZone] = useState<string>("");
  const [identificationCode, setIdentificationCode] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [startDateTime, setStartDatetime] = useState<string>("");
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [identificationCodeError, setIdentificationCodeError] = useState<
    string | null
  >(null);

  const { hasPermission } = UsePermissions();
  const canViewSelect = useMemo(() => hasPermission(32), [hasPermission]);
  const canEditStartDate = useMemo(() => hasPermission(34), [hasPermission]);
  const canEditEndDate = useMemo(() => hasPermission(35), [hasPermission]);

  const formatWithSlashes = (value: string): string => {
    const cleanedValue = value.replace(/\D/g, "");
    return cleanedValue
      .slice(0, 8)
      .replace(/(\d{2})(\d{2})?(\d{4})?/, (_, day, month, year) =>
        [day, month, year].filter(Boolean).join("/")
      );
  };

  const validateDate = (
    value: string,
    setError: (msg: string | null) => void
  ) => {
    if (!value) {
      setError(null);
      return;
    }

    try {
      dateValidationSchema.parse({ date: value });
      setError(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      }
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatWithSlashes(e.target.value);
    setStartDate(formattedValue);
    validateDate(formattedValue, setStartDateError);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatWithSlashes(e.target.value);
    setEndDate(formattedValue);
    validateDate(formattedValue, setEndDateError);
  };

  const formatDate = (dateString: string | null): string => {
    return dateString ? format(parseISO(dateString), "dd/MM/yyyy") : "";
  };

  useEffect(() => {
    setFirstName("");
    setLastName("");
    setPaymentData(() => ({
      plate: "",
    }));
    setSchedulingZone("");
    setEndDate("");
    setEndDate("");
    setStartDatetime("");
  }, [identificationCode]);

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const plate = e.target.value.toUpperCase();
    try {
      montleSubscription.parse({ placa: plate });
      setPlateError(null);
      setPaymentData({
        ...paymentData,
        plate,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setPlateError(err.errors[0].message);
      }
    }
  };

  const handleConsult = async () => {
    setLoading(true);
    try {
      const data = await listInformation(identificationCode);
      if (data.length > 0) {
        const customer = data[0];
        setSelectedService(customer.service || null);
        setFirstName(`${customer.firstName} ${customer.secondName || ""}`);
        setLastName(
          `${customer.firstLastName} ${customer.secondLastName || ""}`
        );
        setSchedulingZone(customer.schedulingZone || "");
        //cambiar por la del validate
        setStartDate(formatDate(customer.schedulingStartDatetime));
        setEndDate(formatDate(customer.schedulingEndDatetime));
        setStartDatetime(formatDate(customer.schedulingEndDatetime));
      } else {
        setFirstName("");
        setLastName("");
        setSchedulingZone("");
        setStartDate("");
        setEndDate("");
        setStartDatetime("");
        setIdentificationCodeError(
          "No se encontró información para la cédula."
        );
      }
    } catch (error) {
      setIdentificationCodeError("Error al consultar la información.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="flex flex-col gap-2 justify-center h-full">
      <h2 className="font-bold text-2xl text-center">Datos de mensualidad</h2>
      <form className="flex flex-col gap-1">
        <div className="flex gap-4 justify-between px-4">
          <label className="text-base font-bold my-auto md:text-nowrap">
            Tipo de mensualidad
          </label>
          {canViewSelect && (
            <Select
              className="w-1/2"
              size="sm"
              variant="bordered"
              label="Seleccionar"
            >
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </Select>
          )}
        </div>
        <div className="flex gap-4 justify-between px-4">
          <label className="text-base font-bold my-auto md:text-nowrap">
            N° de meses
          </label>
          <Input
            className="w-1/2"
            type="number"
            variant="underlined"
            defaultValue="1"
          />
        </div>

        <div className="flex gap-4 justify-between px-4 ">
          <label className="text-base font-bold my-auto ">Cedula</label>
          <Input
            className="w-1/2"
            variant="underlined"
            value={identificationCode}
            onChange={(e) => setIdentificationCode(e.target.value)}
          />
          {identificationCodeError && (
            <p className="absolute text-red-500 text-sm mt-1">
              {identificationCodeError}
            </p>
          )}
          <Button color="primary" onPress={handleConsult} disabled={loading}>
            {loading ? <Spinner size="lg" /> : "Consultar"}
          </Button>
        </div>

        <div className="flex gap-4 justify-between px-4 ">
          <label className="text-base font-bold text-nowrap my-auto">
            Nombres
          </label>
          <Input
            className="w-1/2"
            variant="underlined"
            value={firstName}
            readOnly
          />
        </div>
        <div className="flex gap-4 justify-between px-4">
          <label className="text-base font-bold text-nowrap my-auto">
            Apellidos
          </label>
          <Input
            className="w-1/2"
            variant="underlined"
            value={lastName}
            readOnly
          />
        </div>
        <div className="flex gap-4 justify-between px-4 ">
          <label className="text-base font-bold text-nowrap my-auto">
            Placa
          </label>
          <div className="w-1/2 ">
            <Input
              className="w-full"
              value={paymentData.plate}
              variant="underlined"
              onChange={handlePlateChange}
            />
            {plateError && (
              <p className="absolute text-red-500 text-sm mt-1">{plateError}</p>
            )}
          </div>
        </div>
        <div className="flex gap-4 justify-between px-4">
          <label className="text-base font-bold my-auto md:text-nowrap">
            Válido Desde
          </label>
          <Input
            className="w-1/2"
            readOnly={!canEditStartDate}
            value={startDate}
            placeholder="dd/mm/yyyy"
            onChange={handleStartDateChange}
          />
          {startDateError && (
            <p className="text-red-500 text-sm">{startDateError}</p>
          )}
        </div>

        <div className="flex gap-4 justify-between px-4">
          <label className="text-base font-bold my-auto md:text-nowrap">
            Válido Hasta
          </label>
          <Input
            className="w-1/2"
            readOnly={!canEditEndDate}
            value={endDate}
            placeholder="dd/mm/yyyy"
            onChange={handleEndDateChange}
          />
          {endDateError && (
            <p className="text-red-500 text-sm">{endDateError}</p>
          )}
        </div>
        <h2 className="font-bold text-2xl text-center">Última mensualidad</h2>

        <div className="flex gap-4 justify-between px-4">
          <label className="text-base font-bold text-nowrap my-auto">
            Tipo
          </label>
          <Input
            className="w-1/2 uppercase"
            variant="underlined"
            value={schedulingZone}
            readOnly
          />
        </div>
        <div className="flex gap-4 justify-between px-4">
          <label className="text-base font-bold my-auto md:text-nowrap">
            Válido hasta
          </label>
          <Input
            className="w-1/2"
            readOnly
            value={startDateTime}
            placeholder="dd/mm/yyyy"
          />
        </div>
      </form>
    </article>
  );
}
