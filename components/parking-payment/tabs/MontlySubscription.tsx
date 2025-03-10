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
import UseInformationList from "@/app/hooks/parking-payment/UseInformationList";
import { initialPaymentData } from "@/app/libs/initialStates";
import { toast } from "sonner";
import UseValidate from "@/app/hooks/parking-payment/UseValidate";

export default function Mensualidad() {
  const { paymentData, setPaymentData } = usePaymentContext();
  const [plateError, setPlateError] = useState<string | null>(null);
  const { services, isLoading } = UseServices("Mensualidad");
  const { listInformation } = UseInformationList();
  const [plate, setPlate] = useState("");
  const [debouncedPlate, setDebouncedPlate] = useState("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const { validate, loadingValidate } = UseValidate();
  const [isProrrateoChecked, setIsProrrateoChecked] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [schedulingZone, setSchedulingZone] = useState<string>("");
  const [identificationCode, setIdentificationCode] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [validFrom, setValidFrom] = useState<string>(""); // Válido Desde
  const [validTo, setValidTo] = useState<string>(""); // Válido Hasta
  const [startDateTime, setStartDatetime] = useState<string>("");
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);
  const [numberMonths, setNumberMonths] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [identificationCodeError, setIdentificationCodeError] = useState<
    string | null
  >(null);
  const { hasPermission } = UsePermissions();
  const canViewSelect = useMemo(() => hasPermission(32), [hasPermission]);
  const canEditStartDate = useMemo(() => hasPermission(34), [hasPermission]);
  const canEditEndDate = useMemo(() => hasPermission(35), [hasPermission]);
  const [debouncedIdentificationCode, setDebouncedIdentificationCode] =
    useState(identificationCode);
  const [localPlate, setLocalPlate] = useState("");
  const formatWithSlashes = (value: string): string => {
    const cleanedValue = value.replace(/\D/g, "");
    return cleanedValue
      .slice(0, 8)
      .replace(/(\d{2})(\d{2})?(\d{4})?/, (_, day, month, year) =>
        [day, month, year].filter(Boolean).join("/")
      );
  };

  useEffect(() => {
    if (!identificationCode) return;

    const loadingToastId = toast.loading("Validando cédula...");

    const handler = setTimeout(() => {
      setDebouncedIdentificationCode(identificationCode);
      toast.dismiss(loadingToastId); // Cierra el toast después de los 4 segundos
    }, 4000);

    return () => {
      clearTimeout(handler);
      toast.dismiss(loadingToastId);
    };
  }, [identificationCode]);

  useEffect(() => {
    if (debouncedIdentificationCode) {
      handleConsult();
    }
  }, [debouncedIdentificationCode]);

  useEffect(() => {
    if (!plate) return;

    const loadingToastId = toast.loading("Validando placa...");

    const handler = setTimeout(() => {
      setDebouncedPlate(plate);
      toast.dismiss(loadingToastId);
    }, 4000);

    return () => {
      clearTimeout(handler);
      toast.dismiss(loadingToastId);
    };
  }, [plate]);

  useEffect(() => {
    if (debouncedPlate) {
      validatePlate();
    }
  }, [debouncedPlate]);

  const validatePlate = async () => {
    try {
      const response = await validate(
        "Mensualidad", // customType
        "CC", // identificationType
        identificationCode, // identificationCode
        debouncedPlate, // plate
        "", // discountCode
        false, // isApportionment
        numberMonths // monthsForPay
      );

      console.log("Respuesta de validación:", response);

      if (response.isSuccess) {
        setPaymentData({
          ...paymentData,
          plate: response.plate,
          vehicleKind: response.vehicleKind,
          subtotal: response.subtotal,
          total: response.total,
          IVAPercentage: response.IVAPercentage,
          IVATotal: response.IVATotal,
          validationDetail: response.validationDetail,
          totalCost: response.total,
        });
        const startDateFormatted = formatDate(
          response.validationDetail?.requestedMonthlySubscriptionStartDatetime
        );
        const endDateFormatted = formatDate(
          response.validationDetail?.requestedMonthlySubscriptionEndDatetime
        );

        setValidFrom(startDateFormatted);
        setValidTo(endDateFormatted);

        const tipo = `${response.concept} - ${response.validationDetail?.lastMonthlySubscriptionVehicleKind || ""}`;

        setPaymentData((prev: any) => ({
          ...prev,
          vehicleKind: tipo,
          validTo: formatDate(
            response.validationDetail?.requestedMonthlySubscriptionEndDatetime
          ),
        }));

        toast.success(response.messageTitle || "Validación exitosa");
      } else {
        toast.error(response.messageBody || "Error en la validación");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al consultar la información");
    }
  };
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const validateDate = (value: string) => {
    if (!value) return;

    try {
      dateValidationSchema.parse({ date: value });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    }
  };
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatWithSlashes(e.target.value);
    setStartDate(formattedValue);
    validateDate(formattedValue);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatWithSlashes(e.target.value);
    setEndDate(formattedValue);
    validateDate(formattedValue);
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

  const handleNumberMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(e.target.value));
    setNumberMonths(value);

    try {
      numberMonthsSchema.parse({ numberMonths: value });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      }
    }
  };

  const handleConsult = async () => {
    setLoading(true);
    const loadingToastId = toast.loading("Consultando cédula...");
    try {
      const data = await listInformation(identificationCode);
      toast.dismiss(loadingToastId);
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

        toast.success("Cédula validada correctamente.");
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
        toast.success("Cédula no encontrada.");
      }
    } catch (error) {
      setIdentificationCodeError("Error al consultar la información.");
      toast.dismiss(loadingToastId);
      toast.error("Error al consultar la información.");
    } finally {
      setLoading(false);
    }
  };
  const handleProrrateoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProrrateoChecked(e.target.checked);
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
              classNames={{
                popoverContent: "min-w-[190px] ",
                listboxWrapper: "min-w-[190px] ",
                trigger: "whitespace-normal  text-left",
              }}
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
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between ">
              <label className="text-base font-bold mr-20">N° de meses</label>
              <Input
                value={String(numberMonths)}
                onChange={handleNumberMonthsChange}
                variant="bordered"
                className="w-12 mb-2"
                isDisabled={isProrrateoChecked}
              />
            </div>
            <div className="flex flex-col gap-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="prorrateo"
                    checked={isProrrateoChecked}
                    onChange={handleProrrateoChange}
                  />
                  <label
                    className="text-base font-bold place-items-end"
                    htmlFor="prorrateo"
                  >
                    Prorrateo
                  </label>
                </div>
              </div>
            </div>
          </div>
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
              {/* <Button
                color="primary"
                className="ml-2"
                onPress={handleConsult}
                disabled={loading}
              >
                {loading ? <Spinner size="lg" /> : "Consultar"}
              </Button> */}
            </div>
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
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())} // Convierte en mayúsculas
              placeholder="Ingrese la placa"
            />
          </div>
          <div className="min-h-[0.2rem] text-red-500 text-xs">
            {plateError}
          </div>
        </div>

        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between mb-2">
            <label className="text-base font-bold">Nuevo Válido Desde</label>
            <Input
              className="w-1/2"
              variant="bordered"
              readOnly={!canEditStartDate}
              value={validFrom}
              placeholder="dd/mm/yyyy"
              onChange={handleStartDateChange}
            />
          </div>
          <div className="min-h-[0.2rem] text-red-500 text-xs ">
            {startDateError}
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <label className="text-base font-bold ">Nuevo Válido Hasta</label>
          <Input
            className="w-1/2"
            variant="bordered"
            readOnly={!canEditEndDate}
            value={validTo}
            placeholder="dd/mm/yyyy"
            onChange={handleEndDateChange}
          />
        </div>

        <div className="min-h-[1rem]"></div>
      </form>
    </article>
  );
}
