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
import { UseAuthContext } from "@/app/context/AuthContext";
import { Arrow, Data, Money, User, Key } from "./icons";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<number[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();
  const { user } = UseAuthContext();
  const pathname = usePathname();

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
    const storedUserName = Cookies.get("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permissionId: number): boolean =>
    permissions.includes(permissionId);

  const navbarOptions = [
    {
      label: (
        <div className=" flex bg-secondary items-center gap-2 text-white rounded-sm px-4 py-3">
          <Money size={20} /> Pagar
        </div>
      ),
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
      label: (
        <div className="flex items-center gap-2">
          <Arrow size={20} /> Ingreso y salida de vehículos
        </div>
      ),

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
      label: (
        <div className="flex items-center text-white  gap-2">
          <Data size={20} /> Informes
        </div>
      ),
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
      label: (
        <div className="flex items-center gap-2">
          <Key size={20} /> Administrador
        </div>
      ),
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
    Cookies.remove("userName");
    localStorage.removeItem("token");
    localStorage.clear();
    router.replace("/auth/login");
  };

  return (
    <NextUINavbar
      className="flex flex-row justify-between items-center bg-primary rounded-md"
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
                  className={`p-0 bg-transparent text-white data-[hover=true]:bg-transparent ${
                    pathname === option.items[0].href
                      ? "bg-white bg-opacity-20 rounded-md"
                      : ""
                  }`}
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
                      className={`p-0 bg-transparent data-[hover=true]:bg-transparent ${
                        option.items.some((item) =>
                          pathname.startsWith(item.href)
                        )
                          ? "bg-white bg-opacity-20 rounded-md"
                          : ""
                      }`}
                      radius="sm"
                      variant="light"
                    >
                      {option.label}
                    </Button>
                  </DropdownTrigger>
                </NavbarItem>
                <DropdownMenu
                  aria-label={
                    typeof option.label === "string"
                      ? option.label
                      : "Menú de opciones"
                  }
                >
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
                className="p-0 bg-transparent text-white  data-[hover=true]:bg-transparent"
                radius="sm"
                variant="light"
              >
                <User></User>
                {user ? <p>Hola, {user.name}</p> : <p>Cargando usuario...</p>}
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
