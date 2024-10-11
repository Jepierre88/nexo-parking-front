"use client";
import { Card, CardHeader } from "@nextui-org/card";
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
		<section className="flex flex-col md:flex-row gap-1 justify-center items-center">
			<Card className="md:w-[600px] w-full h-[550] py-2">
				<CardHeader className="flex flex-col gap-1">
					<h1 className="font-bold text-3xl text-center my-3">
						Procesos
					</h1>
				</CardHeader>
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
			<Card className="md:w-[500] w-full py-2 ">
				<CardHeader className="flex flex-col gap-2 ">
					<h1 className="font-bold text-3xl text-center ">Datos de cobro</h1>
					<h1 className="font-bold text-xl  text-center ">Visitante (QR)</h1>
				</CardHeader>
				<form className="flex flex-col gap-2">
					<div className="items-start m-4 ">
					<div className="text-base  mb-1 flex gap-4 justify-between">
						<strong>Punto de pago </strong>
						{userData?.validationDetail
							? userData.validationDetail.incomeDatetime.split(" ")[0]
							: ""}
					</div>
					<div className="text-base mb-1 flex gap-4 justify-between  ">
						<strong>Cajero: </strong>
						{user.name} -{user.lastName}
					</div>
					<div className="text-base mb-1 flex gap-4 justify-between ">
						<strong>Placa: </strong>
						{userData?.plate}
					</div>
					<div className="text-base mb-1 flex gap-4 justify-between">
						<strong>Tipo de vehículo: </strong>
						{userData?.vehicleKind}
					</div>
					<div className="text-base mb-1 flex gap-4 justify-between">
						<strong>Fecha de entrada: </strong>
						{userData?.validationDetail
							? userData.validationDetail.incomeDatetime.split(" ")[0]
							: ""}
					</div>
					<div className="text-base mb-1 flex gap-4 justify-between">
						<strong>Fecha de salida: </strong>
						{new Date().toISOString().split("T")[0]}
					</div>
					<div className="text-base mb-1 flex gap-4 justify-between">
						<strong>Tiempo parqueado: </strong>
						{userData?.validationDetail &&
							userData.validationDetail.incomeDatetime.split(" ")[0]}
					</div>
					<div className="text-base mb-1 flex gap-4 justify-between">
						<strong>Valor a pagar </strong>
						{userData?.total && `$${userData.total}`}
					</div>
					<div className="text-base mb-1 flex gap-4 justify-between">
						<strong>IVA: </strong>
						{/* {userData?.iva && $'${user}'} */}
					</div>
					</div>
					</form>
			</Card>
			<Card className="md:w-[500] w-full py-2 ">
				<CardHeader className="flex flex-col gap-2">
					<h1 className="font-bold text-3xl text-center ">Datos de pago</h1>
					<h1 className="font-bold text-xl  text-center ">Visitante (QR)</h1>
				</CardHeader>
				<form className="flex flex-col ">

				<form>
				<div className="flex flex-col place-items-end mb-1 my-2 gap-2">
					<Checkbox className="-mt-5" color="primary">
					<p className="text-gray-600 my-1 px-4 mb-2  ">
						Preguntar antes de imprimir
					</p>
					</Checkbox>
					<Checkbox className="-mt-5" color="primary" onChange={(e) => setIsVisible(prev => !prev)}>
					<p className="text-gray-600 my-2 px-4  mb-2">
						Facturación electrónica
					</p>
					</Checkbox>
					{isVisible && (
					<div className="flex gap-4 justify-between px-4 ">
						<label className="text-lg font-bold text-nowrap my-auto">Número De Factura Eléctronica</label>
						<Input
							variant="underlined"
							className="w-1/1"
							onChange={(e) => {
								setUserData({ ...userData, identificationCode: e.target.value });
							}}
						/>
					</div>
						)}
					<div className="text-base mb-1 mt-2 flex gap-4 justify-between px-4">
						<strong>TOTAL </strong>
						{userData?.total && `$${userData.total}`}
					</div>
		
					<div className="flex gap-4 justify-between px-4 ">
					<label className="text-lg font-bold text-nowrap my-auto">
						Medio de pago
					</label>
					<Select className="w-52"  size="sm" label="Seleccionar">
						{namePaymentType &&
							namePaymentType.map((item, index) => {
								return (
									<SelectItem color="primary" key={index} value={item.id}>
										{item.namePaymentType}
									</SelectItem>
								);
					})}
					</Select>
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-lg font-bold text-nowrap my-auto">Recibido</label>
					<Input
						variant="underlined"
						className="w-1/1"
						onChange={(e) => {
							setUserData({ ...userData, identificationCode: e.target.value });
						}}
					/>
				</div>
					<div className="flex gap-4 justify-between px-4">
					<label className="text-lg font-bold text-nowrap my-auto">Devolución</label>
					
						{userData?.validationDetail
							? userData.validationDetail.incomeDatetime.split(" ")[0]
							: ""}
					</div>
				</div>
				
				<div className="flex justify-center items-center ">
					<Button
						color="primary"
						className="text-white  text-base my-2 px-2"
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
