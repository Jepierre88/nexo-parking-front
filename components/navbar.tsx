"use client";
import React, { useState, useEffect } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
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
import { Avatar } from "@nextui-org/react";
import Link from "next/link";
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
      label: "Operación",
      key: 2,
      items: [
        {
          label: "Ingresos",
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
          label: "Transacciones",
          key: 5,
          href: "/parking-payment/operations/transactions",
          permission: 5,
        },
        {
          label: "Realizar Cierres",
          key: 6,
          href: "/parking-payment/operations/parkingClosure",
          permission: 6,
        },
      ],
    },
    {
      label: "Pagar",
      key: 1,
      items: [
        {
          label: "Procesos De Pago",
          key: 4,
          href: "/parking-payment",
          permission: 4,
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
    localStorage.clear();
    router.replace("/auth/login");
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
        {/* <Image alt="Logo" className="my-auto" height={65} src={COINSLOGO} /> */}
      </NavbarBrand>

      <NavbarContent className="flex flex-row gap-4 justify-center">
        {filteredNavbarOptions.map((option) => (
          <ul className="flex gap-5" key={option.key}>
            {option.items.length === 1 ? (
              // Si solo hay una opción, redirigir directamente con un botón
              <NavbarItem>
                <Button
                  onClick={() => router.push(option.items[0].href)}
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                  radius="md"
                  variant="light"
                >
                  {option.label}
                </Button>
              </NavbarItem>
            ) : (
              // Si hay varias opciones, usar Dropdown
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
                <DropdownMenu aria-label={option.label}>
                  {option.items.map((item) => (
                    <DropdownItem
                      key={item.key}
                      onClick={() => router.push(item.href)}
                      className="px-3 py-1 text-sm cursor-pointer "
                    >
                      {item.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )}
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
          <DropdownMenu
            aria-label="Usuario"
            className="w-full p-0 -m-0 border-none "
          >
            <DropdownItem
              key="perfil"
              onClick={() => router.push("/parking-payment/profile")}
            >
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
