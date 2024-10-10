"use client";
import { Card } from "@nextui-org/card";
import { Tab, Tabs } from "@nextui-org/tabs";
import VisitanteQr from "./views/QrVisitor";
import Mensualidad from "./views/MontlySubscription";
import QrPerdido from "./views/QrLost";
import { useEffect, useState } from "react";
import { UserData } from "@/types";
import { UseAuthContext } from "../context/AuthContext";
import { validateCredentials } from "../utils/functions";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import UseListsPaymentMethods from "./hooks/UseListsPaymentMethods";
import { Input } from "@nextui-org/input";

export default function ParkingPayment() {
	const { user } = UseAuthContext();
	const { namePaymentType } = UseListsPaymentMethods("namePaymentType");

	const [userData, setUserData] = useState<UserData>({
		IVAPercentage: 0,
		IVATotal: 0,
		concept: "",
		datetime: "",
		deviceId: 0,
		discountCode: "",
		discountTotal: 0,
		grossTotal: 0,
		identificationCode: "",
		identificationType: "",
		isSuccess: false,
		messageBody: "",
		messageTitle: "",
		optionalFields: [],
		plate: "",
		requiredFields: [],
		status: 0,
		subtotal: 0,
		total: 0,
		validationDetail: {
			validationDatetime: "- -",
			timeInParking: "",
			processId: 0,
			incomeDatetime: "- -",
			paidDateTime: "",
			expectedOutComeDatetime: "",
		},
		vehicleKind: "",
	});
		const [isVisible, setIsVisible] = useState(false);

	return (
		<section className="flex flex-col md:flex-row gap-3 justify-center items-center">
			<Card className="md:w-[500px] w-full py-6">
				<Tabs className="mx-auto" color="primary">
					<Tab title={"Visitante QR"}>
						<VisitanteQr userData={userData} setUserData={setUserData} />
					</Tab>
					<Tab title={"Mensualidad"}>
						<Mensualidad />
					</Tab>
					<Tab title={"QR perdido"}>
						<QrPerdido />
					</Tab>
				</Tabs>
			</Card>
			<Card className="md:w-[500] w-full py-2">
				<article>
					<h1 className="font-bold text-3xl text-center my-3">Datos de cobro</h1>
					<h1 className="font-bold text-xl  text-center my-3">Visitante (QR)</h1>
				</article>
				<form className="flex flex-col ">
					<div className="items-start m-4 ">
					<div className="mb-1 flex gap-4 justify-between px-4">
						<strong>Punto de pago </strong>
						{userData?.validationDetail
							? userData.validationDetail.incomeDatetime.split(" ")[0]
							: ""}
					</div>
					<div className="mb-1 flex gap-4 justify-between px-4">
						<strong>Cajero: </strong>
						{user.name} -{user.lastName}
					</div>
					<div className="mb-1 flex gap-4 justify-between px-4">
						<strong>Placa: </strong>
						{userData?.plate}
					</div>
					<div className="mb-1 flex gap-4 justify-between px-4">
						<strong>Tipo de vehículo: </strong>
						{userData?.vehicleKind}
					</div>
					<div className="mb-1 flex gap-4 justify-between px-4">
						<strong>Fecha de entrada: </strong>
						{userData?.validationDetail
							? userData.validationDetail.incomeDatetime.split(" ")[0]
							: ""}
					</div>
					<div className="mb-1 flex gap-4 justify-between px-4">
						<strong>Fecha de salida: </strong>
						{new Date().toISOString().split("T")[0]}
					</div>
					<div className="mb-1 flex gap-4 justify-between px-4">
						<strong>Tiempo parqueado: </strong>
						{userData?.validationDetail &&
							userData.validationDetail.incomeDatetime.split(" ")[0]}
					</div>
					<div className="mb-1 flex gap-4 justify-between px-4">
						<strong>Valor a pagar </strong>
						{userData?.total && `$${userData.total}`}
					</div>
					<div className="mb-1 flex gap-4 justify-between px-4">
						<strong>IVA: </strong>
						{user.name} {user.lastName}
					</div>
					</div>
				<article>
					<h2 className="font-bold text-xl text-center my-1">Datos de pago</h2>
				</article>
				<form>
				<div className="flex flex-col place-items-end mb-1 my-2">
					<Checkbox color="primary">
					<p className="text-gray-600 my-1 px-4">
						Preguntar antes de imprimir
					</p>
					</Checkbox>
					<Checkbox color="primary" onChange={(e) => setIsVisible(prev => !prev)}>
					<p className="text-gray-600 my-2 px-4">
						Facturación electrónica
					</p>
					</Checkbox>
					{isVisible && (
					<div className="flex gap-4 justify-between px-4">
						<label className="text-xl font-bold text-nowrap my-auto">Número De Factura Eléctronica</label>
						<Input
							variant="underlined"
							className="w-1/1"
							onChange={(e) => {
								setUserData({ ...userData, identificationCode: e.target.value });
							}}
						/>
					</div>
						)}
					<div className="mb-1 px-4">
						<strong>TOTAL </strong>
						{userData?.total && `$${userData.total}`}
					</div>
					<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">Medio de pago</label>
					<Select className="w-[200px]" size="sm" label="Seleccionar">
						{namePaymentType &&
							namePaymentType.map((item, index) => {
								return (
									<SelectItem key={index} value={item.id}>
										{item.namePaymentType}
									</SelectItem>
								);
					})}
					</Select>
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">Recibido</label>
					<Input
						variant="underlined"
						className="w-1/1"
						onChange={(e) => {
							setUserData({ ...userData, identificationCode: e.target.value });
						}}
					/>
				</div>
					<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">Devolución</label>
					/*aca me falta la devolucion */
						{userData?.validationDetail
							? userData.validationDetail.incomeDatetime.split(" ")[0]
							: ""}
					</div>
				</div>
				
				<div className="flex justify-center items-center ">
					<Button
						color="primary"
						className="text-white font-bold text-xl my-2 px-2"
						size="lg"
					>
						Realizar pago
					</Button>
				</div>
				</form>
				</form>
			</Card>
		</section>
	);
}
