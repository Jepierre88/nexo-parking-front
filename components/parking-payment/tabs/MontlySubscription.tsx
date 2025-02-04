import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useEffect, useMemo, useState } from "react";
import { usePaymentContext } from "@/app/context/PaymentContext";
import UsePermissions from "@/app/hooks/UsePermissions";
import { montleSubscription } from "@/app/schemas/validationSchemas";
import { z } from "zod";
import { dateValidationSchema } from "@/app/schemas/validationSchemas";
import { numberMonthsSchema } from "@/app/schemas/validationSchemas";
import UseServices from "@/app/hooks/parking-payment/UseServices";
import { Button } from "@nextui-org/button";
import UseInformationList from "@/app/hooks/parking-payment/UseInformationList";
import { Spinner } from "@nextui-org/react";
import { initialPaymentData } from "@/app/libs/initialStates";

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

  const [numberMonths, setNumberMonths] = useState<number>(1);
  const [numberMonthsError, setNumberMonthsError] = useState<
    number | undefined
  >();
  const [numberMonthsErrorMessage, setNumberMonthsErrorMessage] = useState<
    string | null
  >(null);

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
    return dateString ? "" : "";
  };

  useEffect(() => {
    setFirstName("");
    setLastName("");
    setPaymentData(initialPaymentData);
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

  const handleNumberMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setNumberMonths(value);

    try {
      numberMonthsSchema.parse({ numberMonths: value });
      setNumberMonthsError(undefined);
      setNumberMonthsErrorMessage(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setNumberMonthsError(value);
        setNumberMonthsErrorMessage(err.errors[0].message);
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
      <div className="min-h-[0.3rem]"></div>
      <form className="flex flex-col gap-0">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-2">
          <label className="text-base font-bold">Tipo de mensualidad</label>
          {canViewSelect && (
            <Select
              className="w-full sm:w-1/2"
              size="sm"
              variant="bordered"
              label="Seleccionar"
            >
              {services.map((service) => (
                <SelectItem
                  key={service.id}
                  value={service.id}
                  className="whitespace-normal break-words"
                >
                  {service.name}
                </SelectItem>
              ))}
            </Select>
          )}
        </div>

        <div className="min-h-[0.2rem]"></div>

        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between mb-2">
            <label className="text-base font-bold">N° de meses</label>
            <Input
              type="number"
              value={String(numberMonths)}
              onChange={handleNumberMonthsChange}
              variant="bordered"
              className="w-1/2"
            />
          </div>
          {/* <div className="h-2">
                  {errors.password && (
                    <MessageError message={errors.password.message} />
                  )}
                </div> */}
          <div className="h-2">{numberMonthsErrorMessage}</div>
        </div>

        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between mb-2 ">
            <label className="text-base font-bold ">Cedula</label>
            <div className="flex items-center w-1/2">
              <Input
                className="w-full"
                variant="bordered"
                value={identificationCode}
                onChange={(e) => setIdentificationCode(e.target.value)}
              />
              <Button
                color="primary"
                className="ml-2"
                onPress={handleConsult}
                disabled={loading}
              >
                {loading ? <Spinner size="lg" /> : "Consultar"}
              </Button>
            </div>
          </div>
          <div className="min-h-[0.2rem] text-red-500 text-xs">
            {identificationCodeError}
          </div>
        </div>
        <div className="flex flex-col gap-0">
          <div className="flex  items-center justify-between mb-2">
            <label className="text-base font-bold">Nombres</label>
            <Input
              className="w-1/2"
              variant="bordered"
              value={firstName}
              readOnly
            />
          </div>
          <div className="min-h-[0.1rem] text-red-500 text-xs"></div>
        </div>
        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between mb-2">
            <label className="text-base font-bold">Apellidos</label>
            <Input
              className="w-1/2"
              variant="bordered"
              value={lastName}
              readOnly
            />
          </div>
          <div className="min-h-[0.2rem] text-red-500 text-xs"></div>
        </div>

        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between mb-2 ">
            <label className="text-base font-bold">Placa</label>
            <Input
              className="w-1/2"
              variant="bordered"
              value={paymentData.plate}
              onChange={handlePlateChange}
            />
          </div>
          <div className="min-h-[0.2rem] text-red-500 text-xs">
            {plateError}
          </div>
        </div>

        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between mb-2">
            <label className="text-base font-bold">Válido Desde</label>
            <Input
              className="w-1/2"
              variant="bordered"
              readOnly={!canEditStartDate}
              value={startDate}
              placeholder="dd/mm/yyyy"
              onChange={handleStartDateChange}
            />
          </div>
          <div className="min-h-[0.2rem] text-red-500 text-xs ">
            {startDateError}
          </div>
        </div>

        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between mb-2">
            <label className="text-base font-bold ">Válido Hasta</label>
            <Input
              className="w-1/2"
              variant="bordered"
              readOnly={!canEditEndDate}
              value={endDate}
              placeholder="dd/mm/yyyy"
              onChange={handleEndDateChange}
            />
          </div>
          <div className="min-h-[0.8] text-red-500 text-xs">{endDateError}</div>
        </div>

        <h1 className="font-bold text-2xl text-center">Última mensualidad</h1>
        <div className="min-h-[0.3rem]"></div>

        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between mb-2">
            <label className="text-base font-bold">Tipo</label>
            <Input
              className="w-1/2 uppercase"
              variant="bordered"
              value={schedulingZone}
              readOnly
            />
          </div>
        </div>

        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between mb-2">
            <label className="text-base font-bold my-auto md:text-nowrap">
              Válido hasta
            </label>
            <Input
              className="w-1/2"
              variant="bordered"
              readOnly
              value={startDateTime}
              placeholder="dd/mm/yyyy"
            />
          </div>
        </div>
        <div className="min-h-[1rem]"></div>
      </form>
    </article>
  );
}
