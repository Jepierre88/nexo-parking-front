import React from "react";
import { Card } from "@nextui-org/card";

interface CardPropertiesProps {
  children: React.ReactNode;
  headerTitle?: string;
  className?: string;
}

const CardPropierties: React.FC<CardPropertiesProps> = ({
  children,
  headerTitle,
  className,
}) => {
  return (
    <Card
      className={`flex min-w-[230px] lg:min-w-96 md:w-[600px] w-full py-2 border rounded-lg shadow-md transition-shadow duration-300 m-3 mb-8 md:mb-16 lg:mb-24 ${className} min-h-[36rem]`}
    >
      {children}
    </Card>
  );
};

export default CardPropierties;
