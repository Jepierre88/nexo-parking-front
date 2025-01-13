"use client";
import React, { useState } from "react";
import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarBrand,
	NavbarItem,
} from "@nextui-org/navbar";
import Image from "next/image";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";

import { ChevronDown } from "@/components/icons";
import COINSLOGO from "@/public/LOGO.png";
import Loading from "@/app/loading";
import Cookies from "js-cookie";

export const Navbar = () => {
	const icons = {
		chevron: <ChevronDown fill="currentColor" size={16} />,
	};

	const [loading, setLoading] = useState(false);

	const cerrarSesion = () => {
		setLoading(true);

		Cookies.remove("authToken");

		window.location.href = "/auth/login";
	};

	return (
		<>
			{loading && <Loading />}
			<NextUINavbar
				className="flex flex-col  gap-1 justify-center items-center"
				maxWidth="xl"
				position="sticky"
			>
				<NavbarContent
					className="flex flex-col lg:flex-row gap-4"
					justify="start"
				>
					{/* <NavbarBrand as="li" className="gap-3 max-w-fit">
					<Image src={LOGO} alt="..." width={250} />
				</NavbarBrand> */}
					<div className="flex gap-4 flex-grow justify-end">
						<ul className="flex lg:flex gap-4 justify-start ml-2">
							<Dropdown>
								<NavbarItem>
									<DropdownTrigger>
										<Button
											disableRipple
											className="p-0 bg-transparent data-[hover=true]:bg-transparent"
											endContent={icons.chevron} // No pasar íconos como objetos
											radius="sm"
											variant="light"
										>
											ADMINISTRACIÓN
										</Button>
									</DropdownTrigger>
								</NavbarItem>
								<DropdownMenu
									aria-label="Operaciones"
									className="w-full p-0 -mx-0"
								>
									<DropdownItem key="users" href="/parking-payment/users">
										Usuarios
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</ul>
						<ul className="flex gap-4 justify-start ml-2">
							<Dropdown>
								<NavbarItem>
									<DropdownTrigger>
										<Button
											disableRipple
											className="p-0 bg-transparent data-[hover=true]:bg-transparent"
											endContent={icons.chevron} // No pasar íconos como objetos
											radius="sm"
											variant="light"
										>
											OPERACIÓN
										</Button>
									</DropdownTrigger>
								</NavbarItem>
								<DropdownMenu
									aria-label="Operaciones"
									className="w-full p-0 -mx-0"
								>
									<DropdownItem
										key="incomes"
										href="/parking-payment/operations/incomes"
									>
										INGRESOS
									</DropdownItem>
									<DropdownItem
										key="outcomes"
										href="/parking-payment/operations/outcomes"
									>
										SALIDAS
									</DropdownItem>
									<DropdownItem key="payment-process" href="/parking-payment">
										PROCESOS DE PAGO
									</DropdownItem>
									<DropdownItem
										key="transactions"
										href="/parking-payment/operations/transactions"
									>
										TRANSACCIONES
									</DropdownItem>
									<DropdownItem
										key="parking-closure"
										href="/parking-payment/operations/parking-closure"
									>
										REALIZAR CIERRE
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</ul>

						<ul className="flex gap-4 justify-start ml-2">
							<Dropdown>
								<NavbarItem>
									<DropdownTrigger>
										<Button
											disableRipple
											className="p-0 bg-transparent data-[hover=true]:bg-transparent"
											endContent={icons.chevron} // No pasar íconos como objetos
											radius="sm"
											variant="light"
										>
											INGRESO POR PLACA
										</Button>
									</DropdownTrigger>
								</NavbarItem>
								<DropdownMenu
									aria-label="Operaciones"
									className="w-full p-0 -mx-0"
								>
									<DropdownItem
										key="delete"
										href={"/parking-payment/ingresoSalida"}
									>
										INGRESO MANUAL DE PLACA
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</ul>

						<ul className="flex gap-4 justify-start ml-2">
							<Button
								disableRipple
								className="p-0 bg-transparent data-[hover=true]:bg-transparent"
								radius="sm"
								variant="light"
								onPress={cerrarSesion}
							>
								CERRAR SESIÓN
							</Button>
						</ul>
					</div>
				</NavbarContent>
				<NavbarContent className="" justify="end">
					<NavbarBrand
						as="li"
						className="gap-3 my-auto self-end max-w-md flex justify-end"
					>
						<Image alt="..." className="my-auto" height={65} src={COINSLOGO} />
					</NavbarBrand>
				</NavbarContent>
			</NextUINavbar>
		</>
	);
};
