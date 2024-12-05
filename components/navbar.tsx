"use client";
import React, { useState, useEffect } from "react";
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
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import COINSLOGO from "@/app/assets/img/LOGO.png";

export const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<number[]>([]);
  const router = useRouter();

  // Leer permisos desde cookies al cargar el componente
  useEffect(() => {
    const storedPermissions = Cookies.get("permissions");
    if (storedPermissions) {
      try {
        setPermissions(JSON.parse(storedPermissions));
      } catch (error) {
        console.error("Error parsing permissions:", error);
        setPermissions([]);
      }
    }
  }, []);

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permissionId: number): boolean =>
    permissions.includes(permissionId);

  const navbarOptions = [
    {
      label: "ADMINISTRADOR",
      key: 1,
      items: [
        {
          label: "Usuarios",
          key: 1,
          href: "/parking-payment/users",
          permission: 1,
        },
      ],
    },
    {
      label: "OPERACIÓN",
      key: 2,
      items: [
        {
          label: "INGRESOS",
          key: 2,
          href: "/parking-payment/operations/incomes",
          permission: 2,
        },
        {
          label: "SALIDAS",
          key: 3,
          href: "/parking-payment/operations/outcomes",
          permission: 3,
        },
        {
          label: "PROCESOS DE PAGO",
          key: 4,
          href: "/parking-payment",
          permission: 4,
        },
        {
          label: "TRANSACCIONES",
          key: 5,
          href: "/parking-payment/operations/transaction",
          permission: 5,
        },
        {
          label: "REALIZAR CIERRE",
          key: 6,
          href: "/parking-payment/operations/parkingClosure",
          permission: 6,
        },
      ],
    },
    {
      label: "INGRESO POR PLACA",
      key: 3,
      items: [
        {
          label: "INGRESO MANUAL POR PLACA",
          key: 7,
          href: "/parking-payment/ingresoSalida",
          permission: 7,
        },
      ],
    },
  ];

  // Filtrar opciones de menú según los permisos del usuario
  const filteredNavbarOptions = navbarOptions
    .map((option) => {
      const visibleItems = option.items.filter((item) =>
        hasPermission(item.permission)
      );
      return visibleItems.length > 0
        ? { ...option, items: visibleItems }
        : null;
    })
    .filter((option): option is NonNullable<typeof option> => option !== null);

  const cerrarSesion = () => {
    setLoading(true);
    Cookies.remove("auth_token");
    Cookies.remove("permissions");
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <NextUINavbar
      className="flex flex-col gap-1 justify-center items-center"
      maxWidth="xl"
      position="sticky"
    >
      <NavbarContent className="flex flex-col lg:flex-row gap-4 justify-start">
        <div className="flex gap-4 flex-grow justify-end">
          {filteredNavbarOptions.map((option) => (
            <ul className="flex gap-5 justify-start ml-2" key={option.key}>
              <Dropdown>
                <NavbarItem>
                  <DropdownTrigger>
                    <Button
                      disableRipple
                      className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                      radius="sm"
                      variant="light"
                    >
                      {option.label}
                    </Button>
                  </DropdownTrigger>
                </NavbarItem>
                <DropdownMenu
                  aria-label={option.label}
                  className="w-full p-0 -mx-0"
                >
                  {option.items.map((item) => (
                    <DropdownItem key={item.key} href={item.href}>
                      {item.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </ul>
          ))}
          <ul className="flex gap-4 justify-start ml-2">
            <Button
              disableRipple
              className="p-0 bg-transparent data-[hover=true]:bg-transparent"
              radius="sm"
              variant="light"
              onClick={cerrarSesion}
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
  );
};
