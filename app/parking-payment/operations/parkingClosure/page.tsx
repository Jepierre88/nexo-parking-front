"use client";
import React, { useState } from "react";
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import ICONOIMPRESORA from "@/public/IconoImpresora.png";
import Image from "next/image";
import { UserData } from "@/types";
import UseIncomes from "@/app/parking-payment/hooks/UseIncomes";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
	ModalContent,
	useDisclosure,
	Modal,
	ModalHeader,
	ModalBody,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/react";
import CustomDataGrid from "@/components/customDataGrid";
import Loading from "@/app/loading";

export default function Incomes() {
	const { incomes, getIncomes, loading } = UseIncomes();
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	const [paginationModel, setPaginationModel] = useState({
		pageSize: 5,
		page: 0,
	});

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
			headerName: "Concecutipo inicial FE",
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
						<Image src={ICONOIMPRESORA} alt="IconoImpresora" width={20} />
					</Button>
				</div>
			),
		},
	];

	return (
		<section className="relative flex-col overflow-hidden h-full">
			{loading && <Loading />}
			<div className="flex justify-between items-center space-x-4">
				<h1 className={title()}>Parqueadero - Cierres</h1>
				<div className="flex space-x-4">
					<Button color="primary" className="p-6 px-16 w-2">
						Informe parcial
					</Button>
					<Button className="p-6 px-20 bg-primary w-2 text-white">
						+Realizar cierre
					</Button>
				</div>
			</div>

			<CustomDataGrid rows={incomes} columns={columns} />
			<Modal
				onOpenChange={onOpenChange}
				isOpen={isOpen}
				aria-labelledby="user-modal-title"
				aria-describedby="user-modal-description"
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
										<Input placeholder=" " className="ml-4 w-2/3" type="text" />
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
