"use client";

// Importación de componentes de UI y hooks
import { CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useEffect, useState } from "react";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import { useDisclosure } from "@nextui-org/modal";

// Importación de contextos y hooks personalizados
import { UseAuthContext } from "../context/AuthContext";
import UseListsPaymentMethods from "../hooks/parking-payment/UseListsPaymentMethods";
import { usePaymentContext } from "../context/PaymentContext";

// Importación de componentes específicos
import QrPerdido from "../../components/parking-payment/tabs/QrLost";
import Mensualidad from "../../components/parking-payment/tabs/MontlySubscription";
import VisitanteQr from "../../components/parking-payment/tabs/QrVisitor";
import { ModalConfirmation } from "@/components/modales";
import CardPropierties from "@/components/parking-payment/cardPropierties";
import ExtraServices from "@/components/parking-payment/ExtraServicesCard";

// Librerías auxiliares
import axios from "axios";
import { formatDate } from "../libs/utils";
import { Tooltip } from "@nextui-org/react";
import { CartIcon } from "@/components/icons";

export default function ParkingPayment() {
	// Contexto de autenticación para obtener el usuario actual
	const { user } = UseAuthContext();

	// Lista de métodos de pago disponibles desde un hook personalizado
	const { namePaymentType } = UseListsPaymentMethods("namePaymentType");

	// Estados principales del componente
	const [subHeaderTitle, setSubHeaderTitle] = useState("Visitante (QR)"); // Controla el subtítulo según la pestaña activa
	const [isVisible, setIsVisible] = useState(false); // Controla la visibilidad del campo de facturación electrónica
	const [paymentMethod, setPaymentMethod] = useState(""); // Método de pago seleccionado
	const [moneyReceived, setMoneyReceived] = useState<number>(0); // Monto recibido del cliente
	const [cashBack, setCashBack] = useState<number>(0); // Monto de devolución
	const [showCart, setShowCart] = useState<boolean>(false); // Controla la visibilidad del carrito de servicios adicionales
	const [loadingPayment, setLoadingPayment] = useState(false); // Indica si se está procesando un pago

	// Contexto de pago, incluye estado del carrito y datos del pago
	const { state, dispatch, paymentData, setPaymentData } = usePaymentContext();

	// Hooks para manejar la apertura/cierre de modales
	const {
		isOpen: isOpenModalConfirmation,
		onOpen: onOpenModalConfirmation,
		onClose: onCloseModalConfirmation,
		onOpenChange: onOpenChangeModalConfirmation,
	} = useDisclosure();

	const {
		isOpen: isOpenModalConfirmationDos,
		onOpen: onOpenModalConfirmationDos,
		onClose: onCloseModalConfirmationDos,
		onOpenChange: onOpenChangeModalConfirmationDos,
	} = useDisclosure();

	// useEffect para calcular automáticamente la devolución
	useEffect(() => {
		if (paymentData?.totalCost) {
			const totalCost = paymentData?.totalCost ?? 0;
			setCashBack(Math.max(0, moneyReceived - totalCost)); // Calcula devolución si es positiva
		}
	}, [moneyReceived, paymentData?.totalCost]);

	// Función para limpiar el carrito de pagos
	const clearCart = () => {
		dispatch({ type: "CLEAR_PAYMENTS" });
	};

	// Función para confirmar la acción de pago
	const onConfirmAction = async () => {
		const services = [];

		// Recopila servicios adicionales del carrito
		if (state?.payments) {
			state.payments.forEach((service) => {
				services.push({
					name: service.name,
					quantity: service.quantity,
					price: service.price,
					total: service.quantity * service.price,
				});
			});
			// Agrega el servicio principal (parqueadero)
			services.push({
				name: "parqueadero",
				quantity: 1,
				price: paymentData.totalParking,
				total: paymentData.totalParking,
			});
		}

		// Actualiza los datos de pago con los servicios recopilados
		const updatedPaymentData = { ...paymentData, services };
		setPaymentData(updatedPaymentData);

		// Estructura los datos del pago para enviarlos al backend
		const dataToPay = {
			deviceId: paymentData.deviceId,
			identificationType: paymentData.identificationType,
			identificationCode: paymentData.identificationCode,
			concept: paymentData.concept,
			cashier: user.name,
			plate: paymentData.plate,
			datetime: paymentData.datetime,
			subtotal: paymentData.subtotal,
			IVAPercentage: paymentData.IVAPercentage,
			IVATotal: paymentData.IVATotal,
			total: paymentData.totalCost,
			processId: paymentData.validationDetail.processId,
			generationDetail: {
				internalId: 1,
				internalConsecutive: "1",
				paymentType: paymentMethod,
			},
		};

		// Envía el pago al backend
		savePayment(dataToPay);
	};

	// Función para cancelar la acción de pago
	// TODO organizar datos de parqueadero
	const onCancelAction = async () => {
		const dataToPay = {
			deviceId: paymentData.deviceId,
			identificationType: paymentData.identificationType,
			identificationCode: paymentData.identificationCode,
			concept: paymentData.concept,
			cashier: user.name,
			plate: paymentData.plate,
			datetime: paymentData.datetime,
			subtotal: paymentData.subtotal,
			IVAPercentage: paymentData.IVAPercentage,
			IVATotal: paymentData.IVATotal,
			total: paymentData.total,
			processId: paymentData.validationDetail.processId,
			generationDetail: {
				internalId: 1,
				internalConsecutive: "1",
				paymentType: paymentMethod,
			},
		};

		// Envía el pago al backend sin marcar como impreso
		savePayment(dataToPay);
	};

	// Función para guardar el pago en el backend
	const savePayment = async (data: any) => {
		try {
			setLoadingPayment(true); // Activa el indicador de carga
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_LOCAL_APIURL}/access-control/visitor-service/generate`,
				data
			);
			console.log("Pago registrado:", response.data);
		} catch (error) {
			console.error("Error al registrar el pago:", error);
		} finally {
			setLoadingPayment(false); // Desactiva el indicador de carga
			onCloseModalConfirmationDos(); // Cierra el modal de confirmación
		}
	};
	return (
		<section className="flex flex-col lg:flex-row gap-1 justify-center items-center h-full">
			{/* Sección de procesos */}
			<CardPropierties>
				<CardHeader className="flex flex-col gap-1">
					<h1 className="font-bold text-3xl text-center my-3">Procesos</h1>
				</CardHeader>
				<CardBody className="my-auto">
					{/* Tabs para diferentes tipos de procesos */}
					<Tabs
						className="mx-auto"
						color="primary"
						onSelectionChange={(key) => setSubHeaderTitle(key.toString())}
					>
						<Tab key="Visitante" title={"Visitante"}>
							<VisitanteQr />
						</Tab>
						<Tab key="Mensualidad" title={"Mensualidad"}>
							<Mensualidad />
						</Tab>
						<Tab key="QR perdido" title={"QR perdido"}>
							<QrPerdido />
						</Tab>
					</Tabs>
				</CardBody>
			</CardPropierties>
			<CardPropierties>
				<CardHeader className="flex flex-col gap-2">
					<h1 className="font-bold text-3xl text-center">Datos de cobro</h1>
					<h1 className="font-bold text-xl text-center">{subHeaderTitle}</h1>
				</CardHeader>
				<CardBody className="flex items-center justify-center">
					<form className="flex flex-col w-full">
						<div className="items-start m-1">
							<div className="text-base mb-1 flex gap-4 justify-between">
								<strong>Punto de pago:</strong>
								{paymentData?.deviceId}
							</div>
							<div className="text-base mb-1 flex gap-4 justify-between">
								<strong>Cajero:</strong>
								{user.name} {user.lastName}
							</div>
							<div className="text-base mb-1 flex gap-4 justify-between">
								<strong>Placa:</strong>
								{paymentData?.plate}
							</div>
							<div className="text-base mb-1 flex gap-4 justify-between">
								<strong>Tipo de vehículo:</strong>
								{paymentData?.vehicleKind}
							</div>
							<div className="text-base mb-1 flex gap-4 justify-between">
								<strong>Fecha de entrada:</strong>
								{paymentData?.validationDetail?.incomeDatetime}
							</div>
							<div className="text-base mb-1 flex gap-4 justify-between">
								<strong>Fecha de salida:</strong>
								{formatDate(new Date())}
							</div>
							<div className="text-base mb-1 flex gap-4 justify-between">
								<strong>Servicios extra:</strong>
								{paymentData?.totalServices && `$${paymentData.totalServices}`}
							</div>
							<div className="text-base mb-1 flex gap-4 justify-between">
								<strong>Parqueadero:</strong>
								{paymentData?.totalParking && `$${paymentData.totalParking}`}
							</div>
							<div className="text-base mb-1 flex gap-4 justify-between">
								<strong>Total sin IVA:</strong>
								{paymentData?.netTotal && `$${paymentData.netTotal}`}
							</div>
						</div>
					</form>
				</CardBody>
			</CardPropierties>
			<CardPropierties>
				<CardHeader className="flex flex-col gap-2">
					<h1 className="font-bold text-3xl text-center">Datos de pago</h1>
					<h1 className="font-bold text-xl text-center">{subHeaderTitle}</h1>
				</CardHeader>
				<CardBody className="flex justify-center items-center">
					<form className="flex flex-col items-center justify-center">
						<div className="flex flex-col place-items-end mb-1 my-2 gap-2">
							<Checkbox
								className="-mt-5"
								color="primary"
								onChange={() => setIsVisible((prev) => !prev)}
							>
								<p className="text-gray-600 my-2 px-4 mb-2">
									Facturación electrónica
								</p>
							</Checkbox>
							{isVisible && (
								<div className="flex gap-4 justify-between px-4">
									<label className="text-lg font-bold my-auto">
										Número De Factura Electrónica
									</label>
									<Input
										className="w-1/1"
										variant="underlined"
										onChange={(e) => {
											setPaymentData((prev: any) => ({
												...prev, // Incluye todas las propiedades previas
												identificationCode: e.target.value, // Sobrescribe identificationCode
											}));
										}}
									/>
								</div>
							)}
							<div className="text-base mb-1 mt-2 flex gap-4 justify-between px-4">
								<strong>TOTAL:</strong>${paymentData.totalCost}
							</div>

							<div className="flex gap-4 justify-between px-4">
								<label className="text-lg font-bold my-auto">
									Medio de pago
								</label>
								<Select
									className="w-52"
									label="Seleccionar"
									size="sm"
									onChange={(e) => {
										const selectedPaymentMethod = namePaymentType.find(
											(item) => e.target.value == item.id
										);

										console.log(selectedPaymentMethod);

										setPaymentMethod(
											selectedPaymentMethod?.namePaymentType || ""
										);
									}}
								>
									{namePaymentType.map((item) => (
										<SelectItem
											key={item.id}
											color="primary"
											value={item.namePaymentType}
										>
											{item.namePaymentType}
										</SelectItem>
									))}
								</Select>
							</div>
							<div className="flex gap-4 justify-between px-4">
								<label className="text-lg font-bold my-auto">Recibido</label>
								<Input
									className="w-1/1"
									value={moneyReceived.toString()}
									variant="underlined"
									type="number"
									onChange={(e) => {
										const value = parseInt(e.target.value) || 0;
										setMoneyReceived(value);
									}}
								/>
							</div>
							<div className="flex gap-4 justify-between px-4">
								<label className="text-lg font-bold my-auto">
									Devolución: ${cashBack}
								</label>
							</div>
						</div>
					</form>
				</CardBody>
				<CardFooter className="flex justify-center items-center">
					<Button
						color="primary"
						size="lg"
						onClick={() => {
							console.log(state.payments);
							console.log(paymentData);
							if (!paymentMethod) {
								// TODO Modal de error para decir que se seleccione el tipo de pago
							} else {
								console.log(state.payments);
								onOpenModalConfirmation();
							}
						}}
						// onClick={() => {
						// 	addItem(2);
						// 	console.log(state.payments, state.total);
						// }}
						isLoading={loadingPayment}
					>
						Realizar pago
					</Button>
				</CardFooter>
			</CardPropierties>
			<ModalConfirmation
				message={`Su pago se va a realizar en ${paymentMethod} ¿esta seguro de realizar el pago?`}
				modalControl={{
					isOpen: isOpenModalConfirmation,
					onOpen: onOpenModalConfirmation,
					onClose: onCloseModalConfirmation,
					onOpenChange: onOpenChangeModalConfirmation,
				}}
				title={"Metodo de pago"}
				onConfirm={() => {
					onOpenModalConfirmationDos();
				}}
			/>
			<ModalConfirmation
				message={"¿Desea imprimir factura?"}
				modalControl={{
					isOpen: isOpenModalConfirmationDos,
					onOpen: onOpenModalConfirmationDos,
					onClose: onCloseModalConfirmationDos,
					onOpenChange: onOpenChangeModalConfirmationDos,
				}}
				title={"Imprimir factura"}
				onConfirm={() => {
					onConfirmAction();
					onCloseModalConfirmation();
				}}
				onCancel={() => {
					onCancelAction();
					onCloseModalConfirmation();
				}}
			/>
			<div className="fixed right-4 top-20 z-30 flex flex-col">
				<div className="relative inline-block">
					<Tooltip
						content="Servicios adicionales"
						placement="left"
						closeDelay={100}
					>
						<Button
							radius="full"
							color="primary"
							className="min-w-1 flex justify-center items-center right-4 h-14 mx-auto"
							onPress={() => setShowCart(true)}
						>
							<CartIcon fill="#fff" stroke="#000" width={24} height={24} />
						</Button>
					</Tooltip>
					{/* Badge */}
					{state.payments.length > 0 && (
						<span className="absolute top-0 left-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full transform translate-x-2 -translate-y-2">
							{state.payments.reduce(
								(acc, payment) => acc + payment.quantity,
								0
							)}
						</span>
					)}
				</div>
			</div>
			<ExtraServices showCart={showCart} setShowCart={setShowCart} />
		</section>
	);
}
