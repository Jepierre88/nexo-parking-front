"use client";
import React from "react";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { GridColDef } from "@mui/x-data-grid";
import {
	ModalContent,
	useDisclosure,
	Modal,
	ModalHeader,
	ModalBody,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/react";

import UseIncomes from "@/app/parking-payment/hooks/UseIncomes";
import ICONOIMPRESORA from "@/public/IconoImpresora.png";
import { title } from "@/components/primitives";
import CustomDataGrid from "@/components/customDataGrid";
import Loading from "@/app/loading";

export default function Incomes() {
	const { incomes, getIncomes, loading } = UseIncomes();
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	const columns: GridColDef[] = [
		{
			field: "id",
			headerName: "ID",
			flex: 1,
			headerAlign: "center",
			align: "center",
		},
		{
			field: "datetime",
			headerName: "Fecha",
			flex: 1,
			headerAlign: "center",
			align: "center",
		},
		{
			field: "",
			headerName: "Consecutivo inicial",
			flex: 1,
			headerAlign: "center",
			align: "center",
		},
		{
			field: "",
			headerName: "Consecutivo final",
			flex: 1,
			headerAlign: "center",
			align: "center",
		},
		{
			field: "",
			headerName: "Concecutivo inicial FE",
			flex: 1,
			headerAlign: "center",
			align: "center",
		},
		{
			field: "",
			headerName: "Concecutipo final FE",
			flex: 1,
			headerAlign: "center",
			align: "center",
		},
		{
			field: "actions",
			headerName: "Acciones",
			flex: 1,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<div className="flex justify-center items-center">
					<Button className="bg-primary text-white " onPress={onOpen}>
						<Image alt="IconoImpresora" src={ICONOIMPRESORA} width={20} />
					</Button>
				</div>
			),
		},
	];

	return (
		<section className="h-full">
			<div className="flex justify-between items-center flex-col xl:flex-row overflow-hidden">
				<h1 className="text-4xl font-bold my-3 h-20 text-center items-center content-center">
					Cierres
				</h1>
				<div className="flex my-3 gap-4 items-center justify-center h-min flex-wrap md:flex-nowrap">
					<Button className="p-6 px-16 w-2" color="primary" variant="bordered">
						Informe parcial
					</Button>
					<Button
						className="p-6 px-20 bg-primary w-2 text-white"
						color="primary"
						variant="shadow"
					>
						Realizar cierre
					</Button>
				</div>
			</div>

			<CustomDataGrid columns={columns} rows={incomes} loading={loading} />
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
								<h1 className={`text-2xl ${title()}`}>
									Esto generará una impresión con los siguientes resúmenes:
								</h1>
							</ModalHeader>
							<ModalBody className="flex w-full">
								<div className="flex-grow" />
								<div className="flex flex-col items-center w-full">
									<div className="flex flex-col items-center w-98">
										<label className="text-xl font-bold text-nowrap w-1/3">
											 Transacciones efectivo.
											<br />
											 Transacciones transferencia.
											<br />
											 Dinero recibido.
											<br />
											 Dinero devolución.
											<br /> Medio de pago.
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
