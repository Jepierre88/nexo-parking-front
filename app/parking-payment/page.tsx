"use client";
import { Card } from "@nextui-org/card";
import { Tab, Tabs } from "@nextui-org/tabs";
import VisitanteQr from "./views/QrVisitor";
import Mensualidad from "./views/MontlySubscription";
import QrPerdido from "./views/QrLost";

export default function ParkingPayment() {
	return (
		<main className="flex flex-col mdf:flex-row gap-3 justify-center items-center">
			<Card className="md:w-1/2 w-full py-6">
				<Tabs className="mx-auto" color="primary">
					<Tab title={"Visitante QR"}>
						<VisitanteQr />
					</Tab>
					<Tab title={"Mensualidad"}>
						<Mensualidad />
					</Tab>
					<Tab title={"QR perdido"}>
						<QrPerdido />
					</Tab>
				</Tabs>
			</Card>
			<Card className="w-1/2">
				<article>
					<h2 className="font-bold text-3xl text-center">Datos de cobro</h2>
				</article>
			</Card>
		</main>
	);
}
