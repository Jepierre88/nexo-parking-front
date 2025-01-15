import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { title } from "../primitives";
import { usePaymentContext } from "@/app/context/PaymentContext";
import UseExtraServices from "@/app/hooks/parking-payment/UseExtraServices";
import { CancelIcon, MinusIcon, PlusIcon } from "../icons";
import { toast } from "sonner";
import UsePermissions from "@/app/hooks/UsePermissions";

export default function ExtraServices(props: {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
}) {
  // Contexto de pagos
  const { state, dispatch, setPaymentData } = usePaymentContext();

  // Lista de servicios adicionales del hook
  const { extraServices } = UseExtraServices();

  const { hasPermission } = UsePermissions();
  const canAddService = hasPermission(36);

  // Combinar servicios actuales y servicios adicionales
  const combinedServices = extraServices.map((service) => {
    const existingPayment = state.payments.find(
      (payment) => payment.id === service.name
    );
    return {
      ...service,
      quantity: existingPayment?.quantity || 0,
      isLocked: existingPayment?.isLocked || false,
    };
  });

  // Actualizar cantidad
  const updateQuantity = (serviceName: string, quantityChange: number) => {
    const service = combinedServices.find((s) => s.name === serviceName);
    if (!service) return;

    const currentQuantity = service.quantity || 0; // Obtiene la cantidad actual
    const newQuantity = currentQuantity + quantityChange; // Calcula la nueva cantidad

    if (newQuantity < 0) return; // Evita cantidades negativas

    // Calcula el total actualizado del servicio y el IVA
    const updatedServiceTotal = service.value * newQuantity;
    const updatedIvaAmount =
      updatedServiceTotal * (service.IVAPercentage / 100);

    // Actualiza el contexto del estado
    dispatch({
      type: "UPDATE_PAYMENT",
      payload: {
        id: service.name,
        name: service.name,
        price: service.value,
        quantityChange,
        isLocked: service.isLocked,
        ivaAmount: updatedIvaAmount,
      },
    });

    // Recalcula todos los totales desde cero
    const updatedPayments = [
      ...state.payments.filter((payment) => payment.id !== service.name), // Excluye el servicio actual
      ...(newQuantity > 0
        ? [
            {
              id: service.name,
              name: service.name,
              price: service.value,
              quantity: newQuantity, // Nueva cantidad exacta
            },
          ]
        : []), // Solo agrega si la cantidad es mayor que 0
    ];

    const recalculatedTotals = updatedPayments.reduce(
      (acc, payment) => {
        const totalService = payment.price * payment.quantity;
        const ivaService = totalService * (service.IVAPercentage / 100);

        return {
          totalServices: acc.totalServices + totalService,
          totalIVA: acc.totalIVA + ivaService,
        };
      },
      { totalServices: 0, totalIVA: 0 }
    );

    // Actualiza el estado de paymentData
    setPaymentData((prevPaymentData: any) => ({
      ...prevPaymentData,
      totalServices: recalculatedTotals.totalServices,
      totalCost: recalculatedTotals.totalServices + recalculatedTotals.totalIVA,
      netTotal:
        recalculatedTotals.totalServices + (prevPaymentData.totalParking || 0),
    }));
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
                <thead className="sticky top-0 bg-white z-10">
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
              ${netCost.toLocaleString("es-CO")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <p className="text-end">Valor IVA:</p>
            <span className="text-start">
              ${ivaAmount.toLocaleString("es-CO")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-5 text-2xl">
            <strong className="text-end">Total:</strong>
            <span className="text-start">
              ${totalCost.toLocaleString("es-CO")}
            </span>
          </div>

          <Button
            color="primary"
            size="lg"
            isDisabled={!canAddService}
            onPress={() => {
              props.setShowCart(false);
              toast.success("Servicio agregado con éxito");
            }}
          >
            Agregar servicios
          </Button>
        </CardFooter>
      </Card>
    </article>
  );
}
