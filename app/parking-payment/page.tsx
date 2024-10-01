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

export default function ParkingPayment() {
	const { user } = UseAuthContext();

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

	return (
		<main className="flex flex-col md:flex-row gap-3 justify-center items-center">
			<Card className="md:w-1/2 w-full py-6">
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
			<Card className="md:w-1/2 w-full py-6">
				<article>
					<h2 className="font-bold text-xl text-center my-3">Datos de cobro</h2>
				</article>
				<form className="flex flex-col justify-center items-center">
					<div>
						<strong>Placa: </strong>
						{userData?.plate}
					</div>
					<div>
						<strong>Cajero: </strong>
						{user.name} {user.lastName}
					</div>
					<div>
						<strong>Tipo de vehículo: </strong>
						{userData?.vehicleKind}
					</div>
					<div>
						<strong>Fecha de entrada: </strong>
						{userData?.validationDetail
							? userData.validationDetail.incomeDatetime.split(" ")[0]
							: ""}
					</div>
					<div>
						<strong>Fecha de salida: </strong>
						{new Date().toISOString().split("T")[0]}
					</div>
					<div>
						<strong>Tiempo parqueado: </strong>
						{userData?.validationDetail &&
							userData.validationDetail.incomeDatetime.split(" ")[0]}
					</div>
					<div>
						<strong>Valor parqueadero: </strong>
						{userData?.total && `$${userData.total}`}
					</div>
					<hr className="border-t w-3/4 my-2" />
					<Checkbox color="primary">Imprimir factura</Checkbox>
					<Button
						color="primary"
						className="text-white font-bold my-5"
						size="lg"
					>
						Realizar pago
					</Button>
				</form>
			</Card>
		</main>
	);
}
