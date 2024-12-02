"use client";
import { CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useEffect, useState } from "react";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import { useDisclosure } from "@nextui-org/modal";

import { UseAuthContext } from "../context/AuthContext";

import UseListsPaymentMethods from "../hooks/parking-payment/UseListsPaymentMethods";
import QrPerdido from "../../components/parking-payment/tabs/QrLost";
import Mensualidad from "../../components/parking-payment/tabs/MontlySubscription";
import VisitanteQr from "../../components/parking-payment/tabs/QrVisitor";

import { ModalConfirmation } from "@/components/modales";
import CardPropierties from "@/components/parking-payment/cardPropierties";
import axios from "axios";
import { usePaymentContext } from "../context/PaymentContext";
import { formatDate } from "../libs/utils";
import { Badge, Tooltip } from "@nextui-org/react";
import { PencilIcon } from "@/components/icons";
import ExtraServices from "@/components/parking-payment/ExtraServicesCard";

export default function ParkingPayment() {
	const { user } = UseAuthContext();
	const { namePaymentType } = UseListsPaymentMethods("namePaymentType");
	const [subHeaderTitle, setSubHeaderTitle] = useState("Visitante (QR)");

	const [isVisible, setIsVisible] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState("");
	const [moneyReceived, setMoneyReceived] = useState<number>(0);
	const [cashBack, setCashBack] = useState<number>(0);

	const [showCart, setShowCart] = useState<boolean>(false);

	// TODO Implementacion de carrito con state y dispatch
	const { state, dispatch, clearAll, paymentData, setPaymentData } =
		usePaymentContext();
	const [loadingPayment, setLoadingPayment] = useState(false);

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

	useEffect(() => {
		// Calcula la devolución automáticamente cuando cambia moneyReceived
		if (paymentData?.total) {
			setCashBack(Math.max(0, moneyReceived - paymentData.total));
		}
	}, [moneyReceived, paymentData?.total]);

	const clearCart = () => {
		dispatch({ type: "CLEAR_PAYMENTS" });
	};

	let print = false;
	const onConfirmAction = async () => {
		print = true;
		const dataToPay = {
			deviceId: paymentData.deviceId,
			identificationType: paymentData.identificationType,
			identificationCode: paymentData.identificationCode,
			concept: paymentData.concept,
			plate: paymentData.plate,
			datetime: paymentData.datetime,
			subtotal: paymentData.subtotal,
			IVAPercentage: paymentData.IVAPercentage,
			IVATotal: paymentData.IVATotal,
			total: paymentData.total,
			generationDetail: paymentData.validationDetail,
			processId: paymentData.validationDetail.processId,
		};
		//TODO Operaciones con el back para impresion: SI
		savePayment(dataToPay);
	};

	const onCancelAction = async () => {
		print = false;
		const dataToPay = {
			paymentMethod,
			moneyReceived,
			cashBack,
			processId: paymentData.validationDetail.processId,
		};
		//TODO Operaciones con el back para impresion: NO
		savePayment(dataToPay);
	};

	const savePayment = async (data: any) => {
		try {
			setLoadingPayment(true);
			console.log(data);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_LOCAL_APIURL}/access-control/visitor-service/generate`,
				data
			);
			console.log("Pago registrado:", response.data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingPayment(false);
			onCloseModalConfirmationDos();
		}
	};

	return (
		<section className="flex flex-col lg:flex-row gap-1 justify-center items-center h-full">
			<CardPropierties>
				<CardHeader className="flex flex-col gap-1">
					<h1 className="font-bold text-3xl text-center my-3">Procesos</h1>
				</CardHeader>
				<CardBody className="my-auto">
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
								<strong>Valor a pagar:</strong>
								{paymentData?.total && `$${paymentData.total}`}
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
								<strong>TOTAL:</strong>
								{paymentData?.total && `$${paymentData.total}`}
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
			<div className="fixed right-4 top-20 z-30">
				<div className="relative inline-block">
					<Tooltip content="Carrito" placement="left" closeDelay={100}>
						<Button
							radius="full"
							color="primary"
							className="min-w-3 flex justify-center items-center -right-6"
							onPress={() => setShowCart(true)}
						>
							<PencilIcon fill="#fff" stroke="#000" width={24} height={24} />
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
