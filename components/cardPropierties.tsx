import React from "react";
import { Card } from "@nextui-org/card";

interface CardPropertiesProps {
  children: React.ReactNode;
  className?: string; // Para permitir estilos adicionales
}

const CardPropierties: React.FC<CardPropertiesProps> = ({
  children,
  className,
}) => {
  return (
    <Card
      className={`flex-1 min-w-[250px] lg:min-w-[300px] md:w-[600px] w-full h-[550px] py-2 border rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl ${className}`}
    >
      {children}
    </Card>
  );
};

export default CardPropierties;
