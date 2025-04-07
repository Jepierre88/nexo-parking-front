"use client";
import { Pagination } from "@nextui-org/react";
import { ClassNameValue } from "tailwind-merge";

type TablePaginationProps = {
  pages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: ClassNameValue;
};

export const TablePagination = ({ pages, currentPage, onPageChange, className }: TablePaginationProps) => {
  return (
    <Pagination
      variant="faded"
      page={currentPage}
      total={pages}
      showControls
      color="primary"
      className={`${className}`}
      onChange={onPageChange}
    />
  );
};
