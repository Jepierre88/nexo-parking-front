import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import axios from "axios";
import { useEffect, useState } from "react";
import { Checkbox } from "@nextui-org/checkbox";

import UseServices from "../../../app/hooks/parking-payment/UseServices";

import { data, PaymentData } from "@/types";
import { usePaymentContext } from "@/app/context/PaymentContext";
import { initialPaymentData } from "@/app/libs/initialStates";
import { toast } from "sonner";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { animals } from "@/app/libs/data";
import { custom } from "zod";


export default function VisitanteQr() {
  const { state, dispatch, paymentData, setPaymentData } = usePaymentContext();
  const [hasValidated, setHasValidated] = useState(false);
  const [debouncedIdentificationCode, setDebouncedIdentificationCode] = useState(paymentData.identificationCode);

  const getCompanyId = (value: string) => {
    if (!value.includes("http")) return value;
    const url = new URL(value);
    return url.searchParams.get("companyId") || "";
  };

  // Debounce: Espera 2 segundos después del último cambio antes de procesar el QR
  useEffect(() => {
    const handler = setTimeout(() => {
      const companyId = getCompanyId(paymentData.identificationCode);
      setDebouncedIdentificationCode(companyId);
    }, 500);


    return () => clearTimeout(handler);
  }, [paymentData.identificationCode]);

  // Validación después del debounce
  //? EL debounce es un hook que permite realizar una peticion despues de un tiempo de espera 
  //? para evitar que se realicen demasiadas peticiones al servidor
  useEffect(() => {
    setPaymentData({
      ...paymentData,
      identificationCode: debouncedIdentificationCode,
    });
    if (debouncedIdentificationCode.length >= 15 && !hasValidated) {
      const newData = {
        ...initialPaymentData,
        identificationType: paymentData.identificationType,
        identificationCode: debouncedIdentificationCode, // Usar el valor procesado
        plate: paymentData.plate,
        customType: paymentData.customType,
        vehicleKind: paymentData.vehicleKind,
      };

      setPaymentData(newData);
      dispatch({ type: "CLEAR_PAYMENTS" });
      setHasValidated(true);
      console.log("Datos que se enviarán:", newData);

      searchDataValidate(newData); // Solo se ejecuta después del debounce
    }
  }, [debouncedIdentificationCode, hasValidated,
    paymentData.customType, paymentData.plate
  ]);

  const { services } = UseServices("Visitante");

  const searchDataValidate = async (data: data) => {
    toast.promise(
      axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/access-control/visitor-service/validateNewPP`,
        {
          identificationType: "QR",
          identificationCode: data.identificationCode,
          plate: data.plate,
          customType: data.customType,
        }
      ),
      {
        loading: "Validando datos del visitante...",
        success: (response) => {
          // Procesar servicios recibidos del backend
          const updatedExtraServices =
            response.data.extraServices?.map((service: any) => ({
              code: service.code,
              name: service.name,
              quantity: service.quantity || 1,
              unitPrice: service.unitPrice,
              totalPrice:
                service.unitPrice *
                (service.quantity || 1) *
                (1 + service.iva / 100),
              iva: service.iva,
              ivaAmount:
                service.unitPrice *
                (service.quantity || 1) *
                (service.iva / 100),
              netTotal: service.unitPrice * (service.quantity || 1),
              isLocked: true,
            })) || [];

          // Recalcular totales
          const recalculatedTotals = updatedExtraServices.reduce(
            (acc: any, service: any) => {
              acc.netTotalServices += service.netTotal;
              acc.totalServices += service.totalPrice;
              acc.totalIVA += service.ivaAmount;
              return acc;
            },
            { netTotalServices: 0, totalServices: 0, totalIVA: 0 }
          );

          // Calcular total final, incluyendo totalParking
          const totalParking = response.data.total || 0; // Valor de totalParking proporcionado por el backend
          const totalCost = recalculatedTotals.totalServices + totalParking;

          // Actualizar paymentData
          setPaymentData({
            ...response.data,
            extraServices: updatedExtraServices,
            netTotalServices: recalculatedTotals.netTotalServices,
            totalServices: recalculatedTotals.totalServices,
            totalParking, // Actualizamos totalParking directamente
            totalCost, // Incluye totalParking y servicios adicionales
          });

          return "Datos validados correctamente";
        },
        error: "Error al validar los datos. Por favor, intente de nuevo.",
      }
    );
  };

  return (
    <article className="flex flex-col gap-2">
      <h2 className="font-bold text-2xl text-center ">Datos de visitante</h2>
      <form className="flex flex-col gap-2">
        <div className="flex gap-4 justify-between">
          <label
            className="text-base font-bold text-nowrap my-auto w-1/2 text-end"
            htmlFor="services"
          >
            Tipo de visitante
          </label>
          <Select
            className="w-1/2"
            value={paymentData.selectedService?.id || services[0]?.id}
            variant="bordered"
            label="Seleccionar"
            radius="lg"
            size="sm"
            onChange={(e) => {
              const service = services.find(
                (item) => e.target.value == item.id
              );
              if (!service) {
                toast.error("Seleccione el tipo de visitante");
                return;
              }
              console.log("Servicio seleccionado ", service);
              setPaymentData({
                ...paymentData,
                selectedService: service,
                customType: service.name,
              });
            }}
          >
            {services &&
              services.map((item) => (
                <SelectItem key={item.id} color="primary" value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
          </Select>
        </div>
        <div className="flex gap-4 justify-between">
          <label
            className="text-base font-bold text-nowrap my-auto w-1/2 text-end"
            htmlFor="QR"
          >
            QR
          </label>
          {/* <Input
            className="w-1/2"
            variant="bordered"
            required
            value={paymentData.identificationCode}
            // isDisabled={!paymentData.selectedService}
            onChange={(e) => {
              setPaymentData({
                ...paymentData,
                identificationCode: e.target.value,
              });
              setHasValidated(false); // Permitir nueva validación si cambia el QR
            }}
          /> */}
          <Input
            className="w-1/2"
            variant="bordered"
            required
            value={paymentData.identificationCode}
            onChange={(e) => {
              const value = e.target.value;

              if (!value) {
                // Si el usuario borra el QR, limpiar completamente el estado
                setPaymentData({
                  ...paymentData,
                  identificationCode: "",
                  validationDetail: null,
                  extraServices: [],
                  netTotalServices: 0,
                  totalServices: 0,
                  totalParking: 0,
                  totalCost: 0,
                });
                setDebouncedIdentificationCode(""); // Evita que el useEffect vuelva a escribirlo
                setHasValidated(false); // Permitir nueva validación
              } else {
                // Si el usuario está escribiendo, actualizar normalmente
                setPaymentData({
                  ...paymentData,
                  identificationCode: value,
                });
                setHasValidated(false);
              }
            }}
          />


        </div>
        <div className="flex gap-4 justify-between">
          <label
            className="text-base  font-bold text-nowrap my-auto w-1/2 text-end"
            htmlFor="plate"
          >
            Placa
          </label>
          <Input
            className="w-1/2"
            value={paymentData.plate}
            variant="bordered"
            isDisabled
            onChange={(e) => {
              setPaymentData({
                ...paymentData,
                plate: e.target.value,
              });
              setHasValidated(false);
            }}
          />
        </div>
        <div className="flex flex-col place-items-end mb-1 my-2">
          <Checkbox color="primary">
            <p className="text-gray-600  text-base my-1 mr-2">
              Pagar día completo
            </p>
          </Checkbox>
        </div>
        <div className="flex gap-4 justify-between">
          <label
            className="text-base font-bold text-nowrap my-auto w-1/2 text-end"
            htmlFor="discount"
          >
            Código de descuento
          </label>
          <Autocomplete
            className="w-1/2"
            variant="bordered"
            selectorIcon={<></>}
          >
            {animals.map((animal) => (
              <AutocompleteItem key={animal.key}>
                {animal.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
        <div className="flex gap-4 justify-between w-full">
          <label
            className="text-base font-bold text-nowrap my-auto w-1/2 text-end"
            htmlFor="startDatetime"
          >
            Fecha de Entrada
          </label>
          <span>{paymentData?.validationDetail?.incomeDatetime}</span>
        </div>
      </form>
    </article>
  );
}
