"use client";
import { Pagination } from "@nextui-org/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React from "react";
import { ClassNameValue } from "tailwind-merge";

export const TablePagination = ({ pages, className }: { pages: number, className?: ClassNameValue }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageParam = Number(searchParams.get("page")) || 1;
  const [page, setPage] = React.useState(pageParam);

  const pathname = usePathname()

  // Función para manejar el cambio de página
  const handlePageChange = (newPage: number) => {
    setPage(newPage); // Actualiza el estado local
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString()); // Actualiza el parámetro "page"
    router.replace(`${pathname}?${params.toString()}`)
  };

  return (
    <Pagination
      variant="faded"
      initialPage={page}
      total={pages}
      showControls
      color="primary"
      className={`${className}`}
      onChange={handlePageChange} // Asigna la función de manejo de cambios
    />
  );
};