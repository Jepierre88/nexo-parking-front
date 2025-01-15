import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { title } from "../primitives";
import { usePaymentContext } from "@/app/context/PaymentContext";
import UseExtraServices from "@/app/hooks/parking-payment/UseExtraServices";
import { CancelIcon, MinusIcon, PlusIcon } from "../icons";
import { toast } from "sonner";
import { PaymentData } from "@/types";

export default function ExtraServices(props: {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
}) {
  // Contexto de pagos
  const { state, dispatch, setPaymentData, paymentData } = usePaymentContext();

  // Lista de servicios adicionales del hook
  const { extraServices } = UseExtraServices();

  // const combinedServices = extraServices.map((service) => {
  // 	// Busca si el servicio ya está en `paymentData.extraServices`
  // 	const existingService = paymentData.extraServices.find(
  // 		(extra) => extra.code === service.name
  // 	);

  // 	console.log(existingService);
  // 	return {
  // 		...service,
  // 		quantity: existingService?.quantity || 0, // Usa la cantidad actualizada de `extraServices`
  // 		isLocked: false, // Puedes ajustarlo según la lógica requerida
  // 	};
  // });
  // console.log(combinedServices);

  // // Actualizar cantidad
  // const updateQuantity = (serviceName: string, quantityChange: number) => {
  // 	const service = combinedServices.find((s) => s.name === serviceName);
  // 	if (!service) return;

  // 	const currentQuantity = service.quantity || 0;
  // 	const newQuantity = currentQuantity + quantityChange;

  // 	if (newQuantity < 0) return; // Evitar cantidades negativas

  // 	setPaymentData((prevPaymentData: PaymentData) => {
  // 		// Copia de los servicios existentes
  // 		const updatedExtraServices = [...prevPaymentData.extraServices];

  // 		// Buscar si el servicio ya existe en `extraServices`
  // 		const existingServiceIndex = updatedExtraServices.findIndex(
  // 			(s) => s.code === service.name
  // 		);

  // 		if (existingServiceIndex !== -1) {
  // 			if (newQuantity === 0) {
  // 				// Si la cantidad llega a 0, eliminar el servicio
  // 				updatedExtraServices.splice(existingServiceIndex, 1);
  // 			} else {
  // 				// Actualizar el servicio existente
  // 				updatedExtraServices[existingServiceIndex] = {
  // 					...updatedExtraServices[existingServiceIndex],
  // 					quantity: newQuantity,
  // 					totalPrice:
  // 						newQuantity * service.value * (1 + service.IVAPercentage / 100),
  // 					ivaAmount:
  // 						newQuantity * service.value * (service.IVAPercentage / 100),
  // 					netTotal: newQuantity * service.value, // Sin IVA
  // 				};
  // 			}
  // 		} else if (quantityChange > 0) {
  // 			// Si no existe y la cantidad es mayor que 0, agregar el servicio
  // 			updatedExtraServices.push({
  // 				code: service.name,
  // 				name: service.name,
  // 				quantity: quantityChange,
  // 				unitPrice: service.value,
  // 				totalPrice:
  // 					quantityChange * service.value * (1 + service.IVAPercentage / 100),
  // 				iva: service.IVAPercentage,
  // 				ivaAmount:
  // 					quantityChange * service.value * (service.IVAPercentage / 100),
  // 				netTotal: quantityChange * service.value, // Sin IVA
  // 			});
  // 		}

  // 		// Recalcular totales
  // 		const recalculatedTotals = updatedExtraServices.reduce(
  // 			(acc, s) => {
  // 				acc.netTotalServices += s.netTotal; // Suma neta sin IVA
  // 				acc.totalServices += s.totalPrice; // Suma total con IVA
  // 				acc.totalIVA += s.ivaAmount; // IVA acumulado
  // 				return acc;
  // 			},
  // 			{ netTotalServices: 0, totalServices: 0, totalIVA: 0 }
  // 		);

  // 		const totalCost =
  // 			recalculatedTotals.totalServices + (prevPaymentData.totalParking || 0);

  // 		// Actualizar el estado de `paymentData`
  // 		return {
  // 			...prevPaymentData,
  // 			extraServices: updatedExtraServices,
  // 			netTotalServices: recalculatedTotals.netTotalServices,
  // 			totalServices: recalculatedTotals.totalServices,
  // 			totalCost,
  // 		};
  // 	});
  // };

  const combinedServices = extraServices.map((service) => {
    // Busca si el servicio ya está en `paymentData.extraServices`
    const existingService = paymentData.extraServices.find(
      (extra) => extra.code === service.name
    );

    return {
      ...service,
      quantity: existingService?.quantity || 0, // Usa la cantidad actualizada de `extraServices`
      isLocked: existingService?.isLocked || false, // Preserva el bloqueo si ya estaba marcado
    };
  });

  // Actualizar cantidad
  const updateQuantity = (serviceName: string, quantityChange: number) => {
    const service = combinedServices.find((s) => s.name === serviceName);
    if (!service || service.isLocked) return; // Evita modificar servicios bloqueados

    const currentQuantity = service.quantity || 0;
    const newQuantity = currentQuantity + quantityChange;

    if (newQuantity < 0) return; // Evitar cantidades negativas

    setPaymentData((prevPaymentData: PaymentData) => {
      // Copia de los servicios existentes
      const updatedExtraServices = [...prevPaymentData.extraServices];

      // Buscar si el servicio ya existe en `extraServices`
      const existingServiceIndex = updatedExtraServices.findIndex(
        (s) => s.code === service.name
      );

      if (existingServiceIndex !== -1) {
        if (newQuantity === 0) {
          // Si la cantidad llega a 0, eliminar el servicio
          updatedExtraServices.splice(existingServiceIndex, 1);
        } else {
          // Actualizar el servicio existente
          updatedExtraServices[existingServiceIndex] = {
            ...updatedExtraServices[existingServiceIndex],
            quantity: newQuantity,
            totalPrice:
              newQuantity * service.value * (1 + service.IVAPercentage / 100),
            ivaAmount:
              newQuantity * service.value * (service.IVAPercentage / 100),
            netTotal: newQuantity * service.value, // Sin IVA
          };
        }
      } else if (quantityChange > 0) {
        // Si no existe y la cantidad es mayor que 0, agregar el servicio
        updatedExtraServices.push({
          code: service.name,
          name: service.name,
          quantity: quantityChange,
          unitPrice: service.value,
          totalPrice:
            quantityChange * service.value * (1 + service.IVAPercentage / 100),
          iva: service.IVAPercentage,
          ivaAmount:
            quantityChange * service.value * (service.IVAPercentage / 100),
          netTotal: quantityChange * service.value, // Sin IVA
          isLocked: false, // Por defecto no bloqueado
        });
      }

      // Recalcular totales
      const recalculatedTotals = updatedExtraServices.reduce(
        (acc, s) => {
          acc.netTotalServices += s.netTotal; // Suma neta sin IVA
          acc.totalServices += s.totalPrice; // Suma total con IVA
          acc.totalIVA += s.ivaAmount; // IVA acumulado
          return acc;
        },
        { netTotalServices: 0, totalServices: 0, totalIVA: 0 }
      );

      const totalCost =
        recalculatedTotals.totalServices + (prevPaymentData.totalParking || 0);

      // Actualizar el estado de `paymentData`
      return {
        ...prevPaymentData,
        extraServices: updatedExtraServices,
        netTotalServices: recalculatedTotals.netTotalServices,
        totalServices: recalculatedTotals.totalServices,
        totalCost,
      };
    });
    console.log(paymentData.extraServices);
  };

  // Calcular costos
  const parkingCost =
    state.payments.find((payment) => payment.id === "parking_fee")?.price || 0;

  const additionalCost = state.payments
    .filter((payment) => payment.id !== "parking_fee")
    .reduce((acc, payment) => acc + payment.price * payment.quantity, 0);

  const netCost = parkingCost + additionalCost;

  const ivaAmount = netCost * 0.19;

  const totalCost = netCost + ivaAmount;

  return (
    <article
      className={`fixed w-full min-h-screen backdrop-brightness-75 z-50 top-0 transition-opacity duration-300 ease-in-out ${
        props.showCart ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <Card
        className={`fixed z-40 max-w-xl w-full h-5/6 flex flex-col justify-center items-center top-4 sm:top-20 right-0 transform transition-transform ease-in-out duration-300 ${
          props.showCart ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <CardHeader className="flex flex-col">
          <Button
            variant="light"
            color="danger"
            className="min-w-2 self-start flex items-center"
            onPress={() => props.setShowCart(false)}
          >
            <CancelIcon />
          </Button>
          <h3 className={title()}>Servicios adicionales</h3>
        </CardHeader>

        <CardBody className="flex flex-col items-center w-full px-6">
          <p className="text-sm mb-4 text-center">
            Agrega los servicios adicionales para este usuario:
          </p>
          <div className="relative w-full">
            <div className="max-h-72 w-full overflow-y-auto">
              <table className="table-auto w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b">
                    <th className="text-left p-2">Servicio</th>
                    <th className="text-right p-2">Valor</th>
                    <th className="text-center p-2">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {combinedServices.map((service, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{service.name}</td>
                      <td className="text-right p-2">
                        ${service.value.toLocaleString("es-CO")}
                      </td>
                      <td className="flex justify-center items-center gap-2 p-2">
                        <Button
                          color="danger"
                          size="sm"
                          radius="full"
                          className="text-white min-w-0 h-10 w-10"
                          onPress={() => updateQuantity(service.name, -1)}
                          isDisabled={service.isLocked}
                        >
                          <MinusIcon />
                        </Button>
                        <span className="min-w-5 max-w-5">
                          {service.quantity}
                        </span>
                        <Button
                          color="success"
                          size="sm"
                          radius="full"
                          className="text-white min-w-0 h-10 w-10"
                          onPress={() => updateQuantity(service.name, 1)}
                          isDisabled={service.isLocked}
                        >
                          <PlusIcon />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardBody>
        <CardFooter className="flex flex-col items-center gap-3 px-6">
          <hr className="border-t-4 border-primary-300 my-4 w-full" />
          <div className="grid grid-cols-2 gap-5">
            <p className="text-end">Total sin IVA:</p>
            <span className="text-start">
              ${paymentData.netTotalServices?.toLocaleString("es-CO")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <p className="text-end">Valor IVA:</p>
            <span className="text-start">
              $
              {(
                (paymentData.totalServices || 0) -
                (paymentData.netTotalServices || 0)
              ).toLocaleString("es-CO")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-5 text-2xl">
            <strong className="text-end">Total:</strong>
            <span className="text-start">
              ${(paymentData.totalServices || 0).toLocaleString("es-CO")}
            </span>
          </div>
          <Button
            color="primary"
            size="lg"
            onPress={() => {
              props.setShowCart(false);
              toast.success("Servicios agregados correctamente");
            }}
          >
            Agregar servicios
          </Button>
        </CardFooter>
      </Card>
    </article>
  );
}
