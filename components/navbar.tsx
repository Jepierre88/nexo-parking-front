"use client";
import React, { useState } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import COINSLOGO from "@/app/assets/img/coinstechNegro.png";
import { ChevronDown } from "@/components/icons";
import Image from "next/image";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import SmallButton from "./smallButton";
import Loading from "@/app/loading";

export const Navbar = () => {
  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
  };

  const [loading, setLoading] = useState(false);

  const redirectWithLoading = (url: string): void => {
    //setLoading(true);
    window.location.href = url;
  };

  const cerrarSesion = () => {
    setLoading(true);
    localStorage.removeItem("token");

    window.location.href = "/auth/login";
  };

  return (
    <>
      {loading && <Loading />}
      <NextUINavbar
        maxWidth="xl"
        position="sticky"
        className="flex flex-col  gap-1 justify-center items-center"
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
                  className="w-[150px]"
                  color="primary"
                >
                  <DropdownItem key="users">
                    <SmallButton
                      label="USUARIOS"
                      onClick={() =>
                        redirectWithLoading("/parking-payment/users")
                      }
                    />
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
                  className="w-[150px] "
                  color="primary"
                >
                  <DropdownItem key="incomes">
                    <SmallButton
                      label="INGRESOS"
                      onClick={() =>
                        redirectWithLoading(
                          "/parking-payment/operations/incomes"
                        )
                      }
                    />
                  </DropdownItem>
                  <DropdownItem key="outcomes">
                    <SmallButton
                      label="SALIDAS"
                      onClick={() =>
                        redirectWithLoading(
                          "/parking-payment/operations/outcomes"
                        )
                      }
                    />
                  </DropdownItem>
                  <DropdownItem key="payment-process">
                    <SmallButton
                      label="PROCESOS DE PAGO"
                      onClick={() => redirectWithLoading("/parking-payment")}
                    />
                  </DropdownItem>
                  <DropdownItem key="transaction">
                    <SmallButton
                      label="TRANSACCIONES"
                      onClick={() =>
                        redirectWithLoading(
                          "/parking-payment/operations/transaction"
                        )
                      }
                    />
                  </DropdownItem>
                  <DropdownItem key="parking-closure">
                    <SmallButton
                      label="REALIZAR CIERRE"
                      onClick={() =>
                        redirectWithLoading(
                          "/parking-payment/operations/parkingClosure"
                        )
                      }
                    />
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
                  className="w-[180px]"
                  color="primary"
                >
                  <DropdownItem key="delete">
                    <SmallButton
                      label="INGRESO MANUAL DE PLACA"
                      onClick={() =>
                        redirectWithLoading("/parking-payment/ingresoSalida")
                      }
                    />
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </ul>

            <ul className="flex gap-4 justify-start ml-2">
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
          </div>
        </NavbarContent>
        <NavbarContent className="">
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
    </>
  );
};
