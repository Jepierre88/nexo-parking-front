import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import axios from "axios";
import { useEffect, useState } from "react";
import { Checkbox } from "@nextui-org/checkbox";

import UseServices from "../../../app/hooks/parking-payment/UseServices";

import { PaymentData } from "@/types";
import { usePaymentContext } from "@/app/context/PaymentContext";
import { initialPaymentData } from "@/app/libs/initialStates";

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
	const searchDataValidate = async () => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_LOCAL_APIURL}/access-control/visitor-service/validateNewPP`,
				{
					identificationType: "QR",
					identificationCode: paymentData.identificationCode,
					plate: paymentData.plate,
				}
			);

			// AGREGAR SERVICIOS ACTIVOS AL CARRITO SI VIENEN EN EL VALIDATE
			let totalService = 0;

			if (response.data.extraServices?.length > 0) {
				response.data.extraServices.forEach((service: any) => {
					const serviceTotal = service.unitPrice * (service.quantity || 1);
					totalService += serviceTotal;

					dispatch({
						type: "UPDATE_PAYMENT",
						payload: {
							id: service.code, // Identificador único
							name: service.name,
							price: service.unitPrice,
							quantityChange: service.quantity || 1, // Usar la cantidad o por defecto 1
							ivaAmount: service.ivaAmount,
							isLocked: true, // Bloquear modificaciones
						},
					});
				});
			}

			setPaymentData({
				...response.data,
				total: totalService + response.data.total,
				totalServices: totalService,
				totalParking: response.data.total,
				netTotal: totalService + response.data.total,
				totalCost:
					totalService +
					response.data.total +
					(totalService + response.data.total) *
						(response.data.IVAPercentage / 100),
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<article className="flex flex-col gap-2">
			<h2 className="font-bold text-2xl text-center ">Datos de visitante</h2>
			<form className="flex flex-col gap-2">
				<div className="flex gap-4 justify-between">
					<label
						className="text-base font-bold text-nowrap my-auto"
						htmlFor="services"
					>
						Tipo de visitante
					</label>
					<Select
						className="w-52 max-w-40"
						value={paymentData.selectedService}
						label="Seleccionar"
						size="sm"
						onChange={(e) => {
							const service = services.find(
								(item) => e.target.value == item.id
							);

							setPaymentData({
								...paymentData,
								selectedService: service.id,
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
						className="text-base font-bold text-nowrap my-auto"
						htmlFor="QR"
					>
						QR
					</label>
					<Input
						className="w-1/2"
						variant="underlined"
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
						className="text-base  font-bold text-nowrap my-auto "
						htmlFor="plate"
					>
						Placa
					</label>
					<Input
						className="w-1/2"
						value={paymentData.plate}
						variant="underlined"
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
				<div className="flex gap-4 justify-between ">
					<label
						className="text-base font-bold text-nowrap my-auto"
						htmlFor="discount"
					>
						Código de descuento
					</label>
					<Input className="w-1/2" variant="underlined" />
				</div>
				<div className="flex gap-4 justify-between w-full">
					<label
						className="text-base font-bold text-nowrap my-auto px-6"
						htmlFor="startDatetime"
					>
						Fecha de Entrada
					</label>
					<span>{paymentData.validationDetail.incomeDatetime}</span>
				</div>
			</form>
		</article>
	);
}
