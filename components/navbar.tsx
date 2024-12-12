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
import COINSLOGO from "@/public/LOGO.png";
import { UserIcon } from "./icons";
import { Avatar } from "@nextui-org/react";

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
      label: "Administrador",
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
      label: "Operación",
      key: 2,
      items: [
        {
          label: "Ingreso",
          key: 2,
          href: "/parking-payment/operations/incomes",
          permission: 2,
        },
        {
          label: "Salidas",
          key: 3,
          href: "/parking-payment/operations/outcomes",
          permission: 3,
        },
        {
          label: "Procesos De Pago",
          key: 4,
          href: "/parking-payment",
          permission: 4,
        },
        {
          label: "Transacciones",
          key: 5,
          href: "/parking-payment/operations/transactions",
          permission: 5,
        },
        {
          label: "Realizar Cierre",
          key: 6,
          href: "/parking-payment/operations/parkingClosure",
          permission: 6,
        },
      ],
    },
    {
      label: "Ingreso Por Placa",
      key: 3,
      items: [
        {
          label: "Ingreso Manual Por Placa",
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
      className="flex flex-row justify-between items-center"
      maxWidth="xl"
      position="sticky"
    >
      <NavbarBrand
        as="li"
        className="gap-3 my-auto self-start max-w-md flex justify-start"
      >
        <Image alt="Logo" className="my-auto" height={65} src={COINSLOGO} />
      </NavbarBrand>

      <NavbarContent className="flex flex-row gap-4 justify-center">
        {filteredNavbarOptions.map((option) => (
          <ul className="flex gap-5 " key={option.key}>
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
      </NavbarContent>

      <ul className="flex  justify-end">
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                radius="sm"
                variant="light"
              >
                <Avatar color="primary"></Avatar>
                Perfil
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="Usuario" className="w-full p-0 -mx-0">
            <DropdownItem key="perfil" onClick={() => router.push("/perfil")}>
              Perfil
            </DropdownItem>
            <DropdownItem key="cerrarSesion" onClick={cerrarSesion}>
              Cerrar Sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </ul>
    </NextUINavbar>
  );
};
