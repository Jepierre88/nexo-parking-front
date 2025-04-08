"use client";

import { CardBody, CardHeader } from "@nextui-org/card";
import { UseAuthContext } from "../../context/AuthContext";
import CardPropierties from "@/components/parking-payment/cardPropierties";
import Image from "next/image";

export default function LandingPage() {
  const { user } = UseAuthContext();

  return (
    <section className="items-center justify-center h-full p-6 flex flex-col">
      <h1 className="font-bold text-4xl text-center">Bienvenido a</h1>
      <Image
        src="/header-logo-black.png"
        alt="Nexo Parking Logo"
        width={350}
        height={100}
        priority
        className="my-2"
      />
      <h2 className="text-2xl text-center text-gray-600">
        {user?.name} {user?.lastName}
      </h2>

    </section>
  );
}