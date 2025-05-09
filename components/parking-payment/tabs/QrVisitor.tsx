import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import axios, { AxiosError } from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { Checkbox } from "@nextui-org/checkbox";

import UseServices from "../../../app/hooks/parking-payment/UseServices";

import { data, PaymentData } from "@/types";
import { usePaymentContext } from "@/app/context/PaymentContext";
import { initialPaymentData } from "@/app/libs/initialStates";
import { toast } from "sonner";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { animals } from "@/app/libs/data";
import { custom } from "zod";
import { CONSTANTS } from "@/config/constants";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { updatePaymentData } from "@/app/libs/utils";

type TYPES_VALIDATIONS = "responseDiscountCode" | "responseIdentificationCode" | "responsePlate"


export default function VisitanteQr() {
  const qrInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { state, dispatch, paymentData, setPaymentData } = usePaymentContext();
  const [hasValidated, setHasValidated] = useState(false);

  // Refs for managing timers
  const qrTimerRef = useRef<NodeJS.Timeout | null>(null);
  const plateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const discountTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [validationType, setValidationType] = useState<TYPES_VALIDATIONS | null>(null); // New stat

  // State to track if we're ready to validate
  const [shouldValidate, setShouldValidate] = useState(false);


  const [payDay, setPayDay] = useState(false)

  const getCompanyCode = (value: string) => {
    if (!value.includes("http")) return value;
    const url = new URL(value);
    return url.searchParams.get("companyCode") || "";
  };

  // Cleanup function
  useEffect(() => {
    // Focus QR input on mount
    if (qrInputRef.current) {
      qrInputRef.current.focus();
    }

    // Cleanup on unmount
    return () => {
      setPaymentData(initialPaymentData);
      dispatch({ type: "CLEAR_PAYMENTS" });
      setHasValidated(false);

      // Clear any pending timers
      if (qrTimerRef.current) clearTimeout(qrTimerRef.current);
      if (plateTimerRef.current) clearTimeout(plateTimerRef.current);
      if (discountTimerRef.current) clearTimeout(discountTimerRef.current);
    };
  }, []);

  // Focus QR input when cleared
  useEffect(() => {
    if (paymentData.identificationCode === "" && qrInputRef.current) {
      qrInputRef.current.focus();
    }
  }, [paymentData.identificationCode]);

  // Execute validation when shouldValidate is true
  useEffect(() => {

    if (shouldValidate && paymentData.identificationCode.length >= 15 && !hasValidated) {
      const companyId = getCompanyCode(paymentData.identificationCode);

      const newData = {
        ...initialPaymentData,
        identificationType: paymentData.identificationType,
        identificationCode: companyId,
        plate: paymentData.plate,
        customType: paymentData.customType,
        vehicleKind: paymentData.vehicleKind,
        payDay: payDay,
        discountCode: paymentData.discountCode,
      };

      console.log("Datos que se enviarán:", newData);
      setHasValidated(true);
      dispatch({ type: "CLEAR_PAYMENTS" });
      searchDataValidate(newData, validationType);

      // Reset the validation flag
      setShouldValidate(false);
    }
  }, [shouldValidate, paymentData, hasValidated]);

  // Debounced functions for QR and plate changes
  const handleQRChange = (value: string) => {
    // Clear any existing timer
    if (qrTimerRef.current) clearTimeout(qrTimerRef.current);

    if (!value) {
      // If QR is cleared, reset everything
      setPaymentData(initialPaymentData);
      setHasValidated(false);
    } else {
      setValidationType(null)
      // Update paymentData immediately for UI feedback
      setPaymentData({
        ...paymentData,
        identificationCode: value,
      });
      setHasValidated(false);

      // Set a new timer for validation
      qrTimerRef.current = setTimeout(() => {
        setShouldValidate(true);
      }, 500);
    }
  };

  const handlePlateChange = (value: string) => {
    // Clear any existing timer
    // if (plateTimerRef.current) clearTimeout(plateTimerRef.current);

    // Update paymentData immediately for UI feedback
    setValidationType("responsePlate")
    setPaymentData({
      ...paymentData,
      plate: value,
    });
    setHasValidated(false);

    // // Set a new timer for validation
    // plateTimerRef.current = setTimeout(() => {
    //   setShouldValidate(true);
    // }, 1000);
  };

  const handleDiscountChange = (value: string) => {
    // Clear any existing timer
    if (discountTimerRef.current) clearTimeout(discountTimerRef.current);
    // Update paymentData immediately for UI feedback
    setValidationType("responseDiscountCode")
    setPaymentData({
      ...paymentData,
      discountCode: value,
    });
    setHasValidated(false);
    // Set a new timer for validation
    discountTimerRef.current = setTimeout(() => {
      setShouldValidate(true);
    }, 1500);
  }

  const { services } = UseServices("Visitante");


  // const searchDataValidate = async (data: data, type?: TYPES_VALIDATIONS) => {
  //   toast.promise(
  //     axios.post(
  //       `${CONSTANTS.APIURL}/validatePaymentVisitorService`,
  //       {
  //         identificationType: "QR",
  //         identificationCode: data.identificationCode.trim(),
  //         plate: data.plate,
  //         customType: data.customType,
  //         discountCode: data.discountCode.trim(),
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${Cookies.get("auth_token")}`,
  //         },
  //       }
  //     ),
  //     {
  //       loading: "Validando datos del visitante...",
  //       success: (response) => {
  //         // Procesar servicios recibidos del backend
  //         const updatedExtraServices =
  //           response.data.extraServices?.map((service: any) => ({
  //             code: service.code,
  //             name: service.name,
  //             quantity: service.quantity || 1,
  //             unitPrice: service.unitPrice,
  //             totalPrice:
  //               service.unitPrice *
  //               (service.quantity || 1) *
  //               (1 + service.iva / 100),
  //             iva: service.iva,
  //             ivaAmount:
  //               service.unitPrice *
  //               (service.quantity || 1) *
  //               (service.iva / 100),
  //             netTotal: service.unitPrice * (service.quantity || 1),
  //             isLocked: true,
  //           })) || [];

  //         // Recalcular totales
  //         const recalculatedTotals = updatedExtraServices.reduce(
  //           (acc: any, service: any) => {
  //             acc.netTotalServices += service.netTotal;
  //             acc.totalServices += service.totalPrice;
  //             acc.totalIVA += service.ivaAmount;
  //             return acc;
  //           },
  //           { netTotalServices: 0, totalServices: 0, totalIVA: 0 }
  //         );

  //         // Calcular total final, incluyendo totalParking
  //         const totalParking = response.data.total || 0; // Valor de totalParking proporcionado por el backend
  //         const totalCost = recalculatedTotals.totalServices + totalParking;
  //         const selectedService = services.find(
  //           (item) => item.name === response.data.customType
  //         );
  //         // Actualizar paymentData
  //         setPaymentData({
  //           ...response.data,
  //           extraServices: updatedExtraServices,
  //           netTotalServices: recalculatedTotals.netTotalServices,
  //           totalServices: recalculatedTotals.totalServices,
  //           totalParking, // Actualizamos totalParking directamente
  //           totalCost, // Incluye totalParking y servicios adicionales
  //         });

  //         return "Datos validados correctamente";
  //       },
  //       error: "Error al validar los datos. Por favor, intente de nuevo.",
  //     }
  //   );
  // };

  const searchDataValidate = async (data: data, type: TYPES_VALIDATIONS | null) => {
    const toastId = toast.loading("Validando datos del visitante...");

    try {
      const response = await axios.post(
        `${CONSTANTS.APIURL}/validatePaymentVisitorService`,
        {
          identificationType: "QR",
          identificationCode: data.identificationCode.trim(),
          plate: data.plate,
          customType: data.customType,
          discountCode: data.discountCode.trim(),
          payDay: data.payDay,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
      );

      updatePaymentData(response.data, setPaymentData);

      if (type) {
        const found = response.data.optionalFields.find(
          (field: any) => type in field
        );

        if (found) {
          if (!found.status) {
            toast.error(found[type], {
              id: toastId,
            });
            return;
          }
        }
      }
      toast.success("Datos validados correctamente", { id: toastId });
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error("Su sesión ha expirado. Por favor, inicie sesión nuevamente.", {
            id: toastId,
          });
          router.push("/auth/login");
          return;
        }
      }
      toast.error("Error al validar los datos. Por favor, intente de nuevo.", {
        id: toastId,
      });
    }
  };


  return (
    <article className="flex flex-col gap-2">
      <h2 className="font-bold text-2xl text-center">Datos de visitante</h2>
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
            value={paymentData.selectedService?.id}
            selectedKeys={[`${paymentData.selectedService?.id || 1}`]}
            variant="bordered"
            label="Seleccionar"
            radius="lg"
            size="sm"
            onChange={(e) => {
              const service = services.find(
                (item) => e.target.value == item.id
              );
              if (!service) {
                toast.error("Selecciona el tipo de visitante");
                return;
              }
              console.log("Servicio seleccionado ", service);
              setPaymentData({
                ...paymentData,
                selectedService: service,
                customType: service.name,
              });
            }}
            classNames={{
              popoverContent: "min-w-[230px] ", // Expande el menú desplegable
              listboxWrapper: "min-w-[230px] ", // Asegura que el contenedor también tenga suficiente espacio
              trigger: "whitespace-normal text-left",
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
        <div className="flex gap-4 justify-end mr-6">
          <Checkbox
            checked={payDay}
            onChange={(e) => {
              setPayDay(e.target.checked)
              setShouldValidate(true)
              setHasValidated(false)
            }}
            className="ml-0"
          >
            Dia pago
          </Checkbox>
        </div>
        <div className="flex gap-4 justify-between">
          <label
            className="text-base font-bold text-nowrap my-auto w-1/2 text-end"
            htmlFor="QR"
          >
            QR
          </label>
          <Input
            ref={qrInputRef}
            className="w-1/2"
            variant="bordered"
            required
            autoFocus
            value={paymentData.identificationCode}
            onChange={(e) => handleQRChange(e.target.value)}
          />
        </div>
        <div className="flex gap-4 justify-between">
          <label
            className="text-base font-bold text-nowrap my-auto w-1/2 text-end"
            htmlFor="plate"
          >
            Placa
          </label>
          <Input
            className="w-1/2 uppercase"
            value={paymentData.plate}
            variant="bordered"
            onChange={(e) => handlePlateChange(e.target.value.toUpperCase())}
          />
        </div>
        <div className="flex gap-4 justify-between">
          <label
            className="text-base font-bold text-nowrap my-auto w-1/2 text-end"
            htmlFor="discount"
          >
            Código de descuento
          </label>
          <Input className="w-1/2" variant="bordered" value={paymentData.discountCode} onChange={(e) => handleDiscountChange(e.target.value)} />
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
    </article >
  );
}