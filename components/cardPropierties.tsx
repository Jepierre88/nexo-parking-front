import React from "react";
import { Card } from "@nextui-org/card";

interface CardPropertiesProps {
  children: React.ReactNode;
  className?: string;
}

const CardPropierties: React.FC<CardPropertiesProps> = ({
  children,
  className,
}) => {
  return (
    <Card
      className={`flex-1 min-w-[230px] lg:min-w-[300px] md:w-[600px] w-full h-[500px] py-2 border rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl m-3 mb-8 md:mb-16 lg:mb-24  ${className}`}
    >
      {children}
    </Card>
  );
};

export default CardPropierties;
