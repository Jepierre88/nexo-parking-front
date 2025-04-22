import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useEffect, useMemo, useRef, useState } from "react";
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
import UseValidateMonthlySubscription from "@/app/hooks/parking-payment/UseValidateMonthlySubscription";
import { Checkbox } from "@nextui-org/checkbox";
import { DateInput, DatePicker } from "@nextui-org/react";
import { CalendarDate, DateValue, parseDate } from "@internationalized/date";

export default function Mensualidad() {
  const { paymentData, setPaymentData } = usePaymentContext();
  const [plateError] = useState<string | null>(null);
  const { services } = UseServices("Mensualidad");
  const { listInformation } = UseInformationList();
  const [plate, setPlate] = useState("");
  const [debouncedPlate, setDebouncedPlate] = useState("");
  const { validate, loadingValidate } = UseValidateMonthlySubscription();
  const [isProrrateoChecked, setIsProrrateoChecked] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [schedulingZone, setSchedulingZone] = useState<string>("");
  const [identificationCode, setIdentificationCode] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  // const [validFrom, setValidFrom] = useState<Date | undefined>(undefined); // Válido Desde
  // const [validTo, setValidTo] = useState<Date | undefined>(undefined); // Válido Hasta
  const [validFrom, setValidFrom] = useState<DateValue | null | undefined>(null); // Válido Desde
  const [validTo, setValidTo] = useState<DateValue | null | undefined>(null); // Válido Hasta


  const dateChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [
    lastMonthlySubscriptionEndDatetime,
    setLastMonthlySubscriptionEndDatetime,
  ] = useState<string>("");
  const [startDateTime, setStartDatetime] = useState<string>("");
  const [moneyReceived, setMoneyReceived] = useState<number>(0);
  const [startDateError, setStartDateError] = useState<string | null>(null);
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
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [debouncedNumberMonths, setDebouncedNumberMonths] = useState<number>(numberMonths);

  const userChangedDatesRef = useRef(false);



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

    const handler = setTimeout(() => {
      setDebouncedIdentificationCode(identificationCode);
    }, 1000); // 1 segundo de debounce

    return () => clearTimeout(handler);
  }, [identificationCode]);

  useEffect(() => {
    if (debouncedIdentificationCode) {
      handleConsult();
    }
  }, [debouncedIdentificationCode]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPlate(plate);
    }, 1000); // 1 segundo de debounce

    return () => {
      clearTimeout(handler);
    };
  }, [plate]);
  useEffect(() => {
    if (
      isProrrateoChecked &&
      validFrom &&
      validTo &&
      userChangedDatesRef.current
    ) {
      // Limpiar timeout anterior si existe
      if (dateChangeTimeoutRef.current) {
        clearTimeout(dateChangeTimeoutRef.current);
      }

      // Iniciar nuevo debounce
      dateChangeTimeoutRef.current = setTimeout(() => {
        userChangedDatesRef.current = false; // Reset bandera
        validatePlate(); // Ejecuta validación con los nuevos valores
      }, 1500); // Puedes ajustar el tiempo si lo prefieres
    }
  }, [validFrom, validTo]);



  useEffect(() => {
    if (debouncedPlate) validatePlate();
  }, [debouncedPlate, selectedServiceType, identificationCode]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedNumberMonths(numberMonths);
    }, 1000); // 1 segundo de debounce

    return () => clearTimeout(handler);
  }, [numberMonths]);

  useEffect(() => {
    if (debouncedIdentificationCode && debouncedPlate && debouncedNumberMonths > 0) {
      validatePlate();
    }
  }, [debouncedIdentificationCode, debouncedPlate, debouncedNumberMonths]);

  const validatePlate = async () => {
    try {
      if (!selectedServiceType) {
        toast.error("Selecciona  el tipo de mensualidad primero");
        return;
      }

      if (!identificationCode) {
        toast.error("Ingrese la cédula primero");
        return;
      }

      console.log("Datos a validar:", {
        selectedServiceType,
        identificationCode,
        plate: debouncedPlate,
        numberMonths,
      });
      const response = await validate(
        selectedServiceType,
        "CC",
        identificationCode,
        debouncedPlate,
        "",
        isProrrateoChecked,
        numberMonths,
        validFrom?.toDate("America/Bogota").toISOString() ?? undefined,
        validTo?.toDate("America/Bogota").toISOString() ?? undefined,
      );

      console.log("Respuesta de validación:", response);

      if (response.isSuccess) {
        console.log("Datos de validación:", response.validationDetail);
        // Actualizar las fechas directamente con el formato para input type="date"
        const startIso = response.validationDetail?.requestedMonthlySubscriptionStartDatetime?.split("T")[0];
        const endIso = response.validationDetail?.requestedMonthlySubscriptionEndDatetime?.split("T")[0];

        if (startIso && endIso) {
          setValidFrom(parseDate(startIso)); // YYYY-MM-DD ✅
          setValidTo(parseDate(endIso));     // YYYY-MM-DD ✅
        }



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
          identificationCode: response.identificationCode,
          concept: response.concept,
          lastMonthlySubscriptionEndDatetime: response.lastMonthlySubscriptionEndDatetime,
          validFrom: startDate,
          validTo: endDate,
        });

        const startDateIso = response.validationDetail?.requestedMonthlySubscriptionStartDatetime?.split("T")[0];
        const endDateIso = response.validationDetail?.requestedMonthlySubscriptionEndDatetime?.split("T")[0];
        const endDateLastIso = response.validationDetail?.lastMonthlySubscriptionEndDatetime?.split("T")[0];

        if (startDateIso && endDateIso) {
          setValidFrom(parseDate(startDateIso));
          setValidTo(parseDate(endDateIso));
        }

        if (endDateLastIso) {
          setLastMonthlySubscriptionEndDatetime(formatDate(endDateLastIso)); // solo para mostrar
        }

        const tipo = `${response.concept} - ${response.validationDetail?.lastMonthlySubscriptionVehicleKind || ""}`;

        setPaymentData((prev: any) => ({
          ...prev,
          vehicleKind: tipo,
          validFrom: startDateIso,
          validTo: endDateIso,
          lastMonthlySubscriptionEndDatetime: endDateLastIso,
        }));


        toast.success(response.messageTitle || "Validación exitosa");
      } else {
        toast.error(response.messageBody || "Error en la validación");
      }
    } catch (error: any) {
      console.log("Error al validar la placa:", error);
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

  // Eliminar la función formatWithSlashes ya que no la necesitaremos

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    // setValidFrom(parseDate(new Date(selectedDate).toISOString()));
    validateDate(selectedDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setValidTo(parseDate(new Date(selectedDate).toISOString()));
    validateDate(selectedDate);
  };

  useEffect(() => {
    setFirstName("");
    setLastName("");
    setPaymentData(initialPaymentData);
    setSchedulingZone("");
    setEndDate("");
    setEndDate("");
    setStartDatetime("");
    setMoneyReceived(0);
  }, [identificationCode]);

  const handleNumberMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setNumberMonths(0);
      return;
    }

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
      const customer = await listInformation(identificationCode);
      toast.dismiss(loadingToastId);
      if (customer) {
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

          <Select
            className="w-full sm:w-1/2"
            size="sm"
            variant="bordered"
            label="Seleccionar"
            value={selectedServiceType}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const service = services.find((item) => item.id === selectedId);

              if (!service) {
                toast.error("Selecciona  el tipo de mensualidad");
                return;
              }

              console.log("Servicio seleccionado (concept):", service);

              setSelectedServiceType(service.name);

              // Asegurar que `setPaymentData` recibe el estado más reciente
              setPaymentData((prev: any) => {
                const updatedPaymentData = {
                  ...prev,
                  selectedService: service,
                  customType: service,
                  concept: service.name,
                };

                return updatedPaymentData;
              });
            }}
          >
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </Select>
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
                  <Checkbox
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
            <label className="text-base font-bold">Cédula</label>
            <div className="flex items-center w-1/2">
              <Input
                className="w-full"
                variant="bordered"
                value={identificationCode}
                onChange={(e) => {
                  setIdentificationCode(e.target.value);
                  setPaymentData((prev: any) => ({
                    ...prev,
                    identificationCode: e.target.value,
                  }));
                }}
                placeholder="Ingrese la identificación"
              />
            </div>
          </div>
        </div>

        <div className="flex  items-center justify-between mb-2">
          <label className="text-base font-bold">Nombres</label>
          <Input
            className="w-1/2"
            variant="bordered"
            value={firstName}
            isDisabled
          />
        </div>

        <div className="flex items-center justify-between mb-2">
          <label className="text-base font-bold">Apellidos</label>
          <Input
            className="w-1/2"
            variant="bordered"
            value={lastName}
            isDisabled
          />
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
            <DatePicker
              className="w-1/2"
              variant="bordered"
              isDisabled={!isProrrateoChecked}
              value={validFrom as any}
              onChange={(value) => {
                userChangedDatesRef.current = true;
                setValidFrom(value);
              }}
            />
          </div>
          <div className="min-h-[0.2rem] text-red-500 text-xs ">
            {startDateError}
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <label className="text-base font-bold">Nuevo Válido Hasta</label>
          <DatePicker
            className="w-1/2"
            variant="bordered"
            isDisabled={!isProrrateoChecked}
            value={validTo as any}
            onChange={(value) => {
              userChangedDatesRef.current = true;
              setValidTo(value);
            }}
          />
        </div>

        <div className="min-h-[1rem]"></div>
      </form>
    </article>
  );
}
