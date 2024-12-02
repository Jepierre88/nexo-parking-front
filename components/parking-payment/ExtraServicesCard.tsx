import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { title } from "../primitives";
import { usePaymentContext } from "@/app/context/PaymentContext";
import { useEffect, useState } from "react";

export default function ExtraServices(props: {
	showCart: boolean;
	setShowCart: (show: boolean) => void;
}) {
	// TRAER DATOS DEL CONTEXTO
	const { state, dispatch } = usePaymentContext();

	//! MOCK DE DATOS !//

	const services = [
		{ name: "Casillero", price: 4000 },
		{ name: "Lavada sencilla", price: 35000 },
		{ name: "Polichada", price: 20000 },
		{ name: "Revisión mecánica", price: 25000 },
		{ name: "Almuerzo", price: 14500 },
		{ name: "Richar con mole", price: 14500 },
		{ name: "La firma", price: 14500 },
	];

	// Sincronizar cantidades locales con el estado global al abrir el carrito
	const [localServices, setLocalServices] = useState(
		services.map((service) => ({
			...service,
			quantity:
				state.payments.find((payment) => payment.id.toString() === service.name)
					?.quantity || 0,
		}))
	);

	useEffect(() => {
		setLocalServices(
			services.map((service) => ({
				...service,
				quantity:
					state.payments.find(
						(payment) => payment.id.toString() === service.name
					)?.quantity || 0,
			}))
		);
	}, [state.payments, props.showCart]);

	// Función para actualizar la cantidad en el reducer
	const updateQuantity = (serviceName: string, quantityChange: number) => {
		const service = services.find((s) => s.name === serviceName);
		if (!service) return;

		dispatch({
			type: "UPDATE_PAYMENT",
			payload: {
				id: service.name,
				price: service.price,
				quantity: quantityChange, // Incremento o decremento
			},
		});
	};

	// Calcular totales
	const totalSinIVA = state.payments.reduce(
		(acc, payment) => acc + payment.price * payment.quantity,
		0
	);
	const valorIVA = totalSinIVA * 0.19; // Suponiendo un IVA del 19%
	const totalConIVA = totalSinIVA + valorIVA;

	return (
		<article
			className={`fixed w-full min-h-screen backdrop-brightness-75 z-50 top-0 transition-opacity duration-300 ease-in-out ${
				props.showCart ? "opacity-100 visible" : "opacity-0 invisible"
			}`}
		>
			<Card
				className={`fixed z-40 max-w-xl w-full h-5/6 flex flex-col justify-center items-center top-20 right-0 transform transition-transform ease-in-out duration-300 ${
					props.showCart ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<CardHeader className="flex flex-col">
					<Button
						variant="light"
						color="danger"
						className="min-w-2 self-start"
						onPress={() => props.setShowCart(false)}
					>
						x
					</Button>
					<h3 className={title()}>Servicios adicionales</h3>
				</CardHeader>

				<CardBody className="flex flex-col items-center w-full px-4">
					<p className="text-sm mb-4 text-center">
						Agrega los servicios adicionales para este usuario:
					</p>
					<div className="relative w-full">
						{/* Contenedor con scroll para las filas */}
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
									{localServices.map((service, index) => (
										<tr key={index} className="border-b">
											<td className="p-2">{service.name}</td>
											<td className="text-right p-2">
												${service.price.toLocaleString()}
											</td>
											<td className="flex justify-center items-center gap-2 p-2">
												<Button
													color="danger"
													size="sm"
													radius="full"
													className="text-white min-w-0"
													onPress={() => updateQuantity(service.name, -1)}
												>
													-
												</Button>
												<span>
													{state.payments.find(
														(payment) => payment.id.toString() === service.name
													)?.quantity || 0}
												</span>
												<Button
													color="success"
													size="sm"
													radius="full"
													className="text-white min-w-0"
													onPress={() => updateQuantity(service.name, 1)}
												>
													+
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</CardBody>

				<CardFooter className="flex flex-col items-center gap-3">
					<div className="grid grid-cols-2 gap-5">
						<p className="text-end">Total sin IVA:</p>
						<span className="text-start">${totalSinIVA.toLocaleString()}</span>
					</div>
					<div className="grid grid-cols-2 gap-5">
						<p className="text-end">Valor IVA:</p>
						<span className="text-start">${valorIVA.toFixed(2)}</span>
					</div>
					<div className="grid grid-cols-2 gap-5">
						<strong className="text-end">Total a pagar:</strong>
						<span className="text-start">${totalConIVA.toLocaleString()}</span>
					</div>
					<Button
						color="primary"
						size="lg"
						onPress={() => props.setShowCart(false)}
					>
						Agregar servicios
					</Button>
				</CardFooter>
			</Card>
		</article>
	);
}
