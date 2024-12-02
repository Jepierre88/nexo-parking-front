"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { GridColDef } from "@mui/x-data-grid";
import {
	getLocalTimeZone,
	parseAbsoluteToLocal,
} from "@internationalized/date";
import {
	ModalContent,
	useDisclosure,
	Modal,
	ModalHeader,
	ModalBody,
} from "@nextui-org/modal";
import { DatePicker, DateValue, Input } from "@nextui-org/react";
import { useTheme } from "next-themes";

import { UseTransactions } from "../../../hooks/transactions/Usetransactions";

import { Connector } from "@/app/libs/Printer";
import Invoice from "@/types/Invoice";
import { PrinterIcon } from "@/components/icons";
import CustomDataGrid from "@/components/customDataGrid";
import { title } from "@/components/primitives";

export default function Transaction() {
	////////////////////////////////////////////////////////////////
	///////////////FALTA HOOK DE TRANSACCIONES//////////////////////
	////////////////////////////////////////////////////////////////
	const { transactions, getTransactions, getTransactionForPrint, loading } =
		UseTransactions();
	const { resolvedTheme } = useTheme();
	const [isDark, setIsDark] = useState(false);
	const [plate, setPlate] = useState("");

	useEffect(() => {
		setIsDark(resolvedTheme === "dark");
	}, [resolvedTheme]);
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	let [datetime, setDatetime] = React.useState<DateValue>(
		parseAbsoluteToLocal(
			new Date(
				new Date().getFullYear(),
				new Date().getMonth(),
				new Date().getDate() - 1, // Resta un día
				0, // Hora
				0, // Minuto
				0, // Segundo
				0 // Milisegundo
			).toISOString()
		)
	);
	let [endDatetime, setEndDatetime] = React.useState<DateValue>(
		parseAbsoluteToLocal(new Date().toISOString())
	);

	const handleFilter = () => {
		getTransactions(datetime.toDate(getLocalTimeZone()), plate);
	};

	const handlePrint = async (id: number) => {
		try {
			const factura: Invoice = await getTransactionForPrint(id);

			console.log("Factura:", factura);
			const impresora = new Connector("EPSON");

			impresora.imprimirFacturaTransaccion(factura);
		} catch (error) {
			console.error("Error al imprimir", error);
		}
	};
	const columns: GridColDef[] = [
		{
			field: "transactionConcept",
			headerName: "Servicio",
			flex: 1,
			headerAlign: "center",
			align: "center",
			minWidth: 170,
		},
		{
			field: "datetime",
			headerName: "Fecha",
			flex: 1,
			headerAlign: "center",
			align: "center",
			minWidth: 150,
			valueFormatter: (value) => {
				const date = new Date(value);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
				const day = String(date.getDate()).padStart(2, "0");
				const hour = String(date.getHours());
				const minute = String(date.getMinutes());
				const second = String(date.getSeconds());

				return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
			},
			valueGetter: (value) => {
				const date = new Date(value);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
				const day = String(date.getDate()).padStart(2, "0");
				const hour = String(date.getHours()).padStart(2, "0");
				const minute = String(date.getMinutes()).padStart(2, "0");
				const second = String(date.getSeconds()).padStart(2, "0");

				return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
			},
		},
		{
			field: "identificationMethod",
			headerName: "Tipo",
			flex: 1,
			headerAlign: "center",
			align: "center",
			minWidth: 100,
		},
		{
			field: "code",
			headerName: "Código",
			flex: 1,
			headerAlign: "center",
			align: "center",
			minWidth: 150,
		},
		{
			field: "vehicleType",
			headerName: "Vehículo",
			flex: 1,
			headerAlign: "center",
			align: "center",
			minWidth: 100,
		},
		{
			field: "vehiclePlate",
			headerName: "Placa",
			flex: 1,
			headerAlign: "center",
			align: "center",
			minWidth: 200,
		},
		{
			field: "vehicleParkingTime",
			headerName: "Tiempo de parqueo",
			flex: 1,
			headerAlign: "center",
			align: "center",
			minWidth: 100,
		},
		{
			field: "actions",
			headerName: "Acciones",
			flex: 1,
			headerAlign: "center",
			align: "center",
			minWidth: 150,
			renderCell: (params) => (
				<div className="flex h-full justify-center items-center w-full overflow-hidden">
					<Button
						color="default"
						radius="none"
						variant="light"
						className="h-full"
						onPress={() => handlePrint(params.row.id)}
					>
						<PrinterIcon
							fill={isDark ? "#000" : "#FFF"}
							size={28}
							stroke={isDark ? "#FFF" : "#000"}
						/>
					</Button>
				</div>
			),
		},
	];

	return (
		<section className="h-full">
			<div className="flex justify-between items-center flex-col xl:flex-row overflow-hidden">
				<h1 className="text-4xl font-bold my-3 h-20 text-center items-center content-center">
					Transacciones
				</h1>
				<div className="flex my-3 gap-4 items-center justify-center h-min flex-wrap md:flex-nowrap">
					<DatePicker
						hideTimeZone
						showMonthAndYearPickers
						className="text-sm"
						label={"Desde"}
						size="md"
						value={datetime}
						onChange={setDatetime}
					/>
					<DatePicker
						hideTimeZone
						showMonthAndYearPickers
						className="text-sm"
						label={"Hasta"}
						size="md"
						value={endDatetime}
						onChange={setEndDatetime}
					/>
					<Input
						label={"Placa"}
						maxLength={6}
						size="md"
						value={plate}
						onChange={(e) => setPlate(e.target.value.toUpperCase())}
					/>
					<Button
						className="bg-primary text-white my-auto"
						size="lg"
						variant="shadow"
						isDisabled={loading}
						onClick={handleFilter}
						onPress={handleFilter}
					>
						Filtrar
					</Button>
				</div>
			</div>
			<CustomDataGrid
				columns={columns}
				loading={loading}
				rows={transactions || []}
			/>
			<Modal
				aria-describedby="user-modal-description"
				aria-labelledby="user-modal-title"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{() => (
						<div className="flex flex-col items-start w-full p-4">
							<ModalHeader className="flex justify-between w-full">
								<h1 className={`text-2xl ${title()}`}>Agregar placa</h1>
							</ModalHeader>
							<ModalBody className="flex w-full">
								<div className="flex-grow" />
								<div className="flex flex-col items-center w-full">
									<div className="flex flex-col items-center w-98">
										<label className="text-xl font-bold text-nowrap w-1/3">
											Placa
										</label>
										<Input className="ml-4 w-2/3" placeholder=" " type="text" />
									</div>
									<div className="flex justify-center w-full mt-4">
										<Button onClick={onClose}>Cancelar</Button>
										<Button onClick={() => console.log("Guardar datos")}>
											Guardar
										</Button>
									</div>
								</div>
							</ModalBody>
						</div>
					)}
				</ModalContent>
			</Modal>
		</section>
	);
}
