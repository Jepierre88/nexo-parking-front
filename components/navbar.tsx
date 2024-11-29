"use client";
import React, { useEffect, useState } from "react";
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
import { UseAuthContext } from "@/app/context/AuthContext";
import { ChevronDown, Logo } from "@/components/icons";
import COINSLOGO from "@/app/assets/img/LOGO.png";
import Loading from "@/app/loading";

export const Navbar = () => {
  const { user } = UseAuthContext();
  const [loading, setLoading] = useState(false);

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
  };

  const redirectWithLoading = (url: string): void => {
    setLoading(true);
    window.location.href = url;
  };

  const cerrarSesion = () => {
    setLoading(true);
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  const hasPermission = (permissionId: number): boolean => {
    return user?.permissions?.includes(permissionId) ?? false;
  };

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
          href: "/parking-payment/operations",
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

  return (
    <>
      <NextUINavbar
        className="flex flex-col gap-1 justify-center items-center"
        maxWidth="xl"
        position="sticky"
      >
        <NavbarContent className="flex flex-col lg:flex-row gap-4 justify-start">
          <div className="flex gap-4 flex-grow justify-end">
            {navbarOptions.map((option) => {
              const visibleItems = option.items.filter((item) =>
                hasPermission(item.permission)
              );
              if (visibleItems.length === 0) return null;

              return (
                <ul className="flex gap-5 justify-start ml-2" key={option.key}>
                  <Dropdown>
                    <NavbarItem>
                      <DropdownTrigger>
                        <Button
                          disableRipple
                          className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                          endContent={icons.chevron}
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
                      {visibleItems.map((item) => (
                        <DropdownItem key={item.key} href={item.href}>
                          {item.label}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </ul>
              );
            })}
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
    </>
  );
};
// return (
//   <>
//     {loading && <Loading />}
//     <NextUINavbar
//       className="flex flex-col  gap-1 justify-center items-center"
//       maxWidth="xl"
//       position="sticky"
//     >
//       <NavbarContent
//         className="flex flex-col lg:flex-row gap-4"
//         justify="start"
//       >
//         <div className="flex gap-4 flex-grow justify-end">
//           <ul className="flex lg:flex gap-4 justify-start ml-2">
//             <Dropdown>
//               <NavbarItem>
//                 <DropdownTrigger>
//                   <Button
//                     disableRipple
//                     className="p-0 bg-transparent data-[hover=true]:bg-transparent"
//                     endContent={icons.chevron} // No pasar íconos como objetos
//                     radius="sm"
//                     variant="light"
//                   >
//                     ADMINISTRACIÓN
//                   </Button>
//                 </DropdownTrigger>
//               </NavbarItem>
//               <DropdownMenu
//                 aria-label="Operaciones"
//                 className="w-full p-0 -mx-0"
//               >
//                 <DropdownItem key="users" href="/parking-payment/users">
//                   Usuarios
//                 </DropdownItem>
//               </DropdownMenu>
//             </Dropdown>
//           </ul>
//           <ul className="flex gap-4 justify-start ml-2">
//             <Dropdown>
//               <NavbarItem>
//                 <DropdownTrigger>
//                   <Button
//                     disableRipple
//                     className="p-0 bg-transparent data-[hover=true]:bg-transparent"
//                     endContent={icons.chevron} // No pasar íconos como objetos
//                     radius="sm"
//                     variant="light"
//                   >
//                     OPERACIÓN
//                   </Button>
//                 </DropdownTrigger>
//               </NavbarItem>
//               <DropdownMenu
//                 aria-label="Operaciones"
//                 className="w-full p-0 -mx-0"
//               >
//                 <DropdownItem
//                   key="incomes"
//                   href="/parking-payment/operations/incomes"
//                 >
//                   INGRESOS
//                 </DropdownItem>
//                 <DropdownItem
//                   key="outcomes"
//                   href="/parking-payment/operations/outcomes"
//                 >
//                   SALIDAS
//                 </DropdownItem>
//                 <DropdownItem key="payment-process" href="/parking-payment">
//                   PROCESOS DE PAGO
//                 </DropdownItem>
//                 <DropdownItem
//                   key="transaction"
//                   href="/parking-payment/operations/transaction"
//                 >
//                   TRANSACCIONES
//                 </DropdownItem>
//                 <DropdownItem
//                   key="parking-closure"
//                   href="/parking-payment/operations/parkingClosure"
//                 >
//                   REALIZAR CIERRE
//                 </DropdownItem>
//               </DropdownMenu>
//             </Dropdown>
//           </ul>

//           <ul className="flex gap-4 justify-start ml-2">
//             <Dropdown>
//               <NavbarItem>
//                 <DropdownTrigger>
//                   <Button
//                     disableRipple
//                     className="p-0 bg-transparent data-[hover=true]:bg-transparent"
//                     endContent={icons.chevron} // No pasar íconos como objetos
//                     radius="sm"
//                     variant="light"
//                   >
//                     INGRESO POR PLACA
//                   </Button>
//                 </DropdownTrigger>
//               </NavbarItem>
//               <DropdownMenu
//                 aria-label="Operaciones"
//                 className="w-full p-0 -mx-0"
//               >
//                 <DropdownItem
//                   key="delete"
//                   href={"/parking-payment/ingresoSalida"}
//                 >
//                   INGRESO MANUAL DE PLACA
//                 </DropdownItem>
//               </DropdownMenu>
//             </Dropdown>
//           </ul>

//           <ul className="flex gap-4 justify-start ml-2">
//             <Button
//               disableRipple
//               className="p-0 bg-transparent data-[hover=true]:bg-transparent"
//               radius="sm"
//               variant="light"
//               onClick={cerrarSesion}
//             >
//               CERRAR SESIÓN
//             </Button>
//           </ul>
//         </div>
//       </NavbarContent>
//       <NavbarContent className="" justify="end">
//         <NavbarBrand
//           as="li"
//           className="gap-3 my-auto self-end max-w-md flex justify-end"
//         >
//           <Image alt="..." className="my-auto" height={65} src={COINSLOGO} />
//         </NavbarBrand>
//       </NavbarContent>
//     </NextUINavbar>
//   </>
// );
