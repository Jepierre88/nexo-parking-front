import { DateInput } from "@nextui-org/date-input";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useEffect, useState } from "react";
import { usePaymentContext } from "@/app/context/PaymentContext";
import UsePermissions from "@/app/hooks/UsePermissions";
import {
  montleSubscription,
  validateIdentificationCode,
} from "@/app/schemas/validationSchemas";
import { z } from "zod";
import UseServices from "@/app/hooks/parking-payment/UseServices";
import { Button } from "@nextui-org/button";
import UseInformationList from "@/app/hooks/parking-payment/UseInformationList";
import { Spinner } from "@nextui-org/react";

export default function Mensualidad() {
  const { paymentData, setPaymentData } = usePaymentContext();
  const [plateError, setPlateError] = useState<string | null>(null);
  const { services, isLoading } = UseServices("Mensualidad");
  const { listInformation } = UseInformationList();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [schedulingZone, setSchedulingZone] = useState<string>("");
  const [identificationCode, setIdentificationCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [identificationCodeError, setIdentificationCodeError] = useState<
    string | null
  >(null);
  useEffect(() => {
    setFirstName("");
    setLastName("");
    setSchedulingZone("");
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
      validateIdentificationCode.parse({ identificationCode });
      setIdentificationCodeError(null);
      const data = await listInformation(identificationCode);
      if (data.length > 0) {
        const customer = data[0]; // Usar el primer resultado
        setFirstName(`${customer.firstName} ${customer.secondName || ""}`);
        setLastName(
          `${customer.firstLastName} ${customer.secondLastName || ""}`
        );
        setSchedulingZone(`${customer.schedulingZone || ""}`);
      } else {
        setFirstName("");
        setLastName("");
        setSchedulingZone("");
        setIdentificationCodeError(
          "No se encontró información para la cédula."
        );
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setIdentificationCodeError(err.errors[0].message);
      } else {
        setIdentificationCodeError(
          err.message || "Error al consultar la información."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = () => {
    setIdentificationCodeError(null);
  };

  const PermissionedSelect = ({
    permission,
    children,
  }: {
    permission: number;
    children: React.ReactNode;
  }) => {
    const { hasPermission } = UsePermissions();
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
      setHasAccess(hasPermission(permission));
    }, [hasPermission, permission]);

    if (!hasAccess) return null;
    return <>{children}</>;
  };

  return (
    <article className="flex flex-col gap-2 justify-center h-full">
      <h2 className="font-bold text-2xl text-center">Datos de mensualidad</h2>
      <form className="flex flex-col gap-1">
        <PermissionedSelect permission={32}>
          <div className="flex gap-4 justify-between px-4">
            <label className="text-base font-bold my-auto md:text-nowrap">
              Tipo de mensualidad
            </label>
            <Select
              className="w-1/2"
              size="sm"
              variant="bordered"
              label="Seleccionar"
              radius="lg"
            >
              {isLoading ? (
                <SelectItem key={"loading"}>Cargando...</SelectItem>
              ) : (
                services.map((service) => (
                  <SelectItem key={service.id}>{service.name}</SelectItem>
                ))
              )}
            </Select>
          </div>
        </PermissionedSelect>

        <div className="flex gap-4 justify-between px-4 ">
          <div className="flex gap-4 justify-between ">
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
        </div>

        <div className="flex gap-4 justify-between px-4 ">
          <div className="flex gap-4 justify-between  ">
            <label className="text-base font-bold my-auto md:text-nowrap">
              Cedula
            </label>
            <Input
              className="w-full"
              variant="underlined"
              value={identificationCode}
              onChange={(e) => setIdentificationCode(e.target.value)}
              onFocus={handleFocus}
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

        <div className="flex gap-4 justify-between ">
          <label className="text-base font-bold text-nowrap my-auto">
            Válido hasta
          </label>
          <DateInput
            className="w-1/2"
            variant="underlined"
            aria-label="Fecha"
          />
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
          <label className="text-base font-bold text-nowrap my-auto">
            Válido hasta
          </label>
          <DateInput
            className="w-1/2"
            variant="underlined"
            aria-label="Fecha"
          />
        </div>
      </form>
    </article>
  );
}
