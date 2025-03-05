import { Tooltip } from "@nextui-org/react";
import React from "react";

interface CustomTooltipProps {
  content: string;
  children: React.ReactNode;
}

export const CustomTooltip = ({ content, children }: CustomTooltipProps) => {
  return (
    <Tooltip
      content={content}
      delay={0}
      closeDelay={0}
      className="text-small bg-transparent text-black"
    >
      {children}
    </Tooltip>
  );
};

export const ActionTooltips = {
  SEND_EMAIL: "Enviar al correo",
  PRINT: "Imprimir",
  VIEW: "Ver detalles",
  EDIT: "Editar",
  DELETE: "Eliminar",
};
