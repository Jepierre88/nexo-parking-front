"use client";
import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem,
} from "@nextui-org/navbar";

import LOGO from "@/app/assets/img/LOGO.png";
import COINSLOGO from "@/app/assets/img/coinstechNegro.png";

import { ChevronDown, SearchIcon } from "@/components/icons";
import Image from "next/image";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import Link from "next/link";

export const Navbar = () => {
	const icons = {
		chevron: <ChevronDown fill="currentColor" size={16} />,
	};

	return (
		<NextUINavbar maxWidth="xl" position="sticky" className="py-4">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<Image src={LOGO} alt="..." width={250} />
				</NavbarBrand>
				<ul className="hidden lg:flex gap-4 justify-start ml-2">
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
									Operacion
								</Button>
							</DropdownTrigger>
						</NavbarItem>
						<DropdownMenu aria-label="Operaciones" className="w-[340px]">
							<DropdownItem key="delete">
								<Link href={"/parking-payment"}>Pago</Link>
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</ul>
			</NavbarContent>
			<NavbarBrand as="li" className="gap-3 max-w-fit my-auto self-end">
				<Image src={COINSLOGO} alt="..." width={150} />
			</NavbarBrand>
		</NextUINavbar>
	);
};
