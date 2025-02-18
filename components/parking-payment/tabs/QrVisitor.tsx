import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import axios from "axios";
import { useEffect, useState } from "react";
import { Checkbox } from "@nextui-org/checkbox";

import UseServices from "../../../app/hooks/parking-payment/UseServices";

import { PaymentData } from "@/types";
import { usePaymentContext } from "@/app/context/PaymentContext";
import { initialPaymentData } from "@/app/libs/initialStates";
import { toast } from "sonner";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { animals } from "@/app/libs/data";

export default function VisitanteQr() {
  const { state, dispatch, paymentData, setPaymentData } = usePaymentContext();
  const [hasValidated, setHasValidated] = useState(false); // Control de validación

  // CUANDO SE ESCRIBA EL QR SE REINICIAN LOS CAMPOS Y SE VALIDA EL AGENDAMIENTO
  useEffect(() => {
    if (paymentData.identificationCode.length >= 15 && !hasValidated) {
      setPaymentData({
        ...initialPaymentData,
        identificationCode: paymentData.identificationCode,
      });
      dispatch({ type: "CLEAR_PAYMENTS" });
      setHasValidated(true); // Marca como validado
      searchDataValidate();
    }
  }, [paymentData.identificationCode, hasValidated]);

  const { services } = UseServices("Visitante");

  // CONSUMO VALIDATE
  // const searchDataValidate = async () => {
  // 	try {
  // 		const response = await axios.post(
  // 			`${process.env.NEXT_PUBLIC_LOCAL_APIURL}/access-control/visitor-service/validateNewPP`,
  // 			{
  // 				identificationType: "QR",
  // 				identificationCode: paymentData.identificationCode,
  // 				plate: paymentData.plate,
  // 			}
  // 		);

  // 		// Procesar servicios recibidos del backend
  // 		const updatedExtraServices =
  // 			response.data.extraServices?.map((service: any) => ({
  // 				code: service.code,
  // 				name: service.name,
  // 				quantity: service.quantity || 1,
  // 				unitPrice: service.unitPrice,
  // 				totalPrice:
  // 					service.unitPrice *
  // 					(service.quantity || 1) *
  // 					(1 + service.iva / 100),
  // 				iva: service.iva,
  // 				ivaAmount:
  // 					service.unitPrice * (service.quantity || 1) * (service.iva / 100),
  // 				netTotal: service.unitPrice * (service.quantity || 1),
  // 			})) || [];

  // 		// Recalcular totales
  // 		const recalculatedTotals = updatedExtraServices.reduce(
  // 			(acc: any, service: any) => {
  // 				acc.netTotalServices += service.netTotal;
  // 				acc.totalServices += service.totalPrice;
  // 				acc.totalIVA += service.ivaAmount;
  // 				return acc;
  // 			},
  // 			{ netTotalServices: 0, totalServices: 0, totalIVA: 0 }
  // 		);

  // 		// Calcular total final, incluyendo totalParking
  // 		const totalParking = response.data.total || 0; // Valor de totalParking proporcionado por el backend
  // 		const totalCost = recalculatedTotals.totalServices + totalParking;

  // 		// Actualizar paymentData
  // 		setPaymentData({
  // 			...response.data,
  // 			extraServices: updatedExtraServices,
  // 			netTotalServices: recalculatedTotals.netTotalServices,
  // 			totalServices: recalculatedTotals.totalServices,
  // 			totalParking, // Actualizamos totalParking directamente
  // 			totalCost, // Incluye totalParking y servicios adicionales
  // 		});
  // 	} catch (error) {
  // 		console.error("Error al validar el QR:", error);
  // 	}
  // };

  const searchDataValidate = async () => {
    toast.promise(
      axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/access-control/visitor-service/validateNewPP`,
        {
          identificationType: "QR",
          identificationCode: paymentData.identificationCode,
          plate: paymentData.plate,
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
            value={paymentData.selectedService?.id}
            variant="bordered"
            label="Seleccionar"
            radius="lg"
            size="sm"
            onChange={(e) => {
              const service = services.find(
                (item) => e.target.value == item.id
              );

              setPaymentData({
                ...paymentData,
                selectedService: service,
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
          <Input
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
            onChange={(e) =>
              setPaymentData({
                ...paymentData,
                plate: e.target.value.toUpperCase(),
              })
            }
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
