"use client";

import { CardBody, CardHeader } from "@nextui-org/card";
import { UseAuthContext } from "../../context/AuthContext";
import CardPropierties from "@/components/parking-payment/cardPropierties";
import Image from "next/image";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Button } from "@nextui-org/react";
import { useEffect } from "react";
import LicenseModal from "@/components/licence/LicenseModal";

export default function LandingPage() {
  const { user } = UseAuthContext();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isOpenLicenseModal, onOpen: onOpenLicenseModal, onOpenChange: onOpenChangeLicenseModal } = useDisclosure();

  const getDaysRemaining = () => {
    if (!user?.expirationDateInMinutes) return 0;
    return Math.ceil(user.expirationDateInMinutes / (24 * 60));
  };

  useEffect(() => {
    if (user?.expirationDateInMinutes) {
      const minutesInWeek = 7 * 24 * 60; // 7 días en minutos
      if (user.expirationDateInMinutes <= minutesInWeek) {
        onOpen();
      }
    }
  }, [user?.expirationDateInMinutes, onOpen]);

  const daysRemaining = getDaysRemaining();


  const handleCloseLicenseModal = () => {
    onOpenChangeLicenseModal(); // Esto lo cierra
    onClose()
  };


  return (
    <>
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
        {/* <p className="text-lg text-center mt-4">
          Días restantes de licencia: <span className="font-bold">{daysRemaining}</span>
        </p> */}
      </section>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Alerta de Licencia</ModalHeader>
          <ModalBody className="flex flex-col gap-4">
            <p>Tu licencia expirará en {daysRemaining} días. Por favor, renueva tu licencia para continuar usando el sistema.</p>
            <Button color="primary" onPress={onOpenLicenseModal}>ACTIVAR LICENCIA</Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      <LicenseModal
        isOpen={isOpenLicenseModal}
        onOpenChange={handleCloseLicenseModal}
      />

    </>
  );
}