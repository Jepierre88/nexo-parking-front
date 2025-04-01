import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export default function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <Table
      aria-label="Tabla de carga"
      classNames={{
        base: "max-h-[520px] overflow-scroll",
      }}
    >
      <TableHeader>
        {Array(columns)
          .fill(null)
          .map((_, index) => (
            <TableColumn key={index} align="center">
              <div className="h-4 bg-default-200 rounded-lg animate-pulse w-20 mx-auto" />
            </TableColumn>
          ))}
      </TableHeader>
      <TableBody>
        {Array(rows)
          .fill(null)
          .map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array(columns)
                .fill(null)
                .map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <div className="h-3 bg-default-200 rounded-lg animate-pulse w-16 mx-auto" />
                  </TableCell>
                ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}