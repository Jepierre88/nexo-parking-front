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
  const cerrarSesion = () => {
    localStorage.removeItem("token");

    window.location.href = "/auth/login";
  };

  return (
    <NextUINavbar maxWidth="xl" position="sticky" className="py-4 /*bg-white*/">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        {/* <NavbarBrand as="li" className="gap-3 max-w-fit">
					<Image src={LOGO} alt="..." width={250} />
				</NavbarBrand> */}
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
                  ADMINISTRACIÓN
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="Operaciones"
              className="w-[340px]"
              color="primary"
            >
              <DropdownItem key="users">
                <Link href={"/parking-payment/users"}>
                  <button className="w-full text-left">USUARIOS</button>
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </ul>
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
                  OPERACIÓN
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="Operaciones"
              className="w-[340px] "
              color="primary"
            >
              <DropdownItem key="users">
                <Link href={"/parking-payment/operations/inputs"}>
                  <button className="w-full text-left">Ingresos</button>
                </Link>
              </DropdownItem>
              <DropdownItem key="users">
                <Link href={"/parking-payment/operations/outputs"}>
                  <button className="w-full text-left">Salidas</button>
                </Link>
              </DropdownItem>
              <DropdownItem key="users">
                <Link href={"/parking-payment"}>
                  <button className="w-full text-left">Procesos de pago</button>
                </Link>
              </DropdownItem>
              <DropdownItem key="users">
                <Link href={"/parking-payment/operations/transaction"}>
                  <button className="w-full text-left">Transacciones</button>
                </Link>
              </DropdownItem>
              <DropdownItem key="users">
                <Link href={"/parking-payment/operations/parkingClosure"}>
                  <button className="w-full text-left">Realizar cierre</button>
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </ul>

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
                  CONTINGENCIA
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="Operaciones"
              className="w-[340px]"
              color="primary"
            >
              <DropdownItem key="delete">
                <Link href={"/parking-payment/contingency"}>
                  Ingreso Manuel De Placa
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </ul>

        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          <Button
            disableRipple
            className="p-0 bg-transparent data-[hover=true]:bg-transparent"
            endContent={icons.chevron}
            radius="sm"
            variant="light"
            onClick={cerrarSesion}
          >
            CERRAR SESIÓN
          </Button>
        </ul>
      </NavbarContent>
      <NavbarContent>
        <NavbarBrand as="li" className="gap-3 my-auto self-end max-w-md flex">
          <Image
            src={COINSLOGO}
            alt="..."
            className="mr-8 my-auto"
            width={100}
          />
        </NavbarBrand>
      </NavbarContent>
    </NextUINavbar>
  );
};
