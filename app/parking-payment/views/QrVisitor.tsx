import { DateInput } from "@nextui-org/date-input";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import axios from "axios";
import UseServices from "../hooks/UseServices";
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { UserData } from "@/types";
import { CalendarDate } from "@internationalized/date";

export default function VisitanteQr({
	userData,
	setUserData,
}: {
	userData: UserData;
	setUserData: (userdata: UserData) => void;
}) {
	useEffect(() => {
		if (userData.identificationCode.length > 15) {
			searchDataValidate();
		}
	}, [userData.identificationCode]);

	const { services } = UseServices("Visitante");
	const searchDataValidate = async () => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_LOCAL_APIURL}/access-control/visitor-service/validateNewPP`,
				{
					identificationType: "QR",
					identificationCode: userData.identificationCode,
					plate: userData.plate,
				}
			);
			setUserData(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<article className="flex flex-col gap-4">
			<h2 className="font-bold text-3xl text-center">
				Datos de visitante (QR)
			</h2>
			<form className="flex flex-col gap-3">
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">
						Tipo de visitante (QR)
					</label>
					<Select className="w-1/2" size="sm" label="Seleccionar">
						{services &&
							services.map((item, index) => {
								return (
									<SelectItem key={index} value={item.id}>
										{item.serviceType}
									</SelectItem>
								);
							})}
					</Select>
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">QR</label>
					<Input
						variant="underlined"
						className="w-1/2"
						onChange={(e) => {
							setUserData({ ...userData, identificationCode: e.target.value });
						}}
					/>
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">Placa</label>
					<Input
						variant="underlined"
						className="w-1/2"
						value={userData.plate}
						onChange={(e) =>
							setUserData({ ...userData, plate: e.target.value.toUpperCase() })
						}
					/>
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">
						Cédula
					</label>
					<Input
						variant="underlined"
						className="w-1/2"
						value={userData.identificationCode}
						onChange={(e) =>
							setUserData({
								...userData,
								identificationCode: e.target.value.toUpperCase(),
							})
						}
					/>
					<Button
						color="primary"
						className="text-white font-bold "
						onClick={() => searchDataValidate()}
					>
						Buscar
					</Button>
				</div>
			</form>
		</article>
	);
}
