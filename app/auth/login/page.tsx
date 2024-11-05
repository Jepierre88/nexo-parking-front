"use client";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import Image from "next/image";
import OPERATIONLOGO from "@/app/assets/img/LOGO.png";
import ICONOWHATSAPP from "@/public/iconoWhatsapp.png";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { UseNavigateContext } from "@/app/context/NavigateContext";
import { UseAuthContext } from "@/app/context/AuthContext";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import Loading from "@/app/loading";
import { ModalError, ModalExito } from "@/components/modales";
import UseResetPassword from "@/app/parking-payment/hooks/UseResetPassword";

export default function Login() {
  const { router } = UseNavigateContext();
  const { setToken, setIsAuthenticated, setUser } = UseAuthContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const {
    isOpen: isOpenExitoModal,
    onOpen: onOpenExitoModal,
    onOpenChange: onOpenChangeExitoModal,
    onClose: onCloseExitoModal,
  } = useDisclosure();

  const {
    isOpen: isOpenErrorModal,
    onOpen: onOpenErrorModal,
    onOpenChange: onOpenChangeErrorModal,
    onClose: onCloseErrorModal,
  } = useDisclosure();

  interface UserLogin {
    email: string;
    password: string;
  }
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { register, handleSubmit, getValues } = useForm();
  const { resetPassword, loading: loadingReset } = UseResetPassword();
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(true);

  const onSubmit: SubmitHandler<any> = async (data: UserLogin) => {
    setLoading(true);
    try {
      console.log();
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/users/login`,
        data
      );
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      if (response.data.token) {
        setToken(response.data.token);
        setUser({
          name: response.data.name,
          lastName: response.data.lastName,
          realm: response.data.realm,
        });
        setIsAuthenticated(true);

        router.push("/parking-payment");
      }
    } catch (error) {
      console.error(error);
      setToken("");
      setIsAuthenticated(false);
      alert("Error en el inicio de sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const email = getValues("recoveryEmail");

    setLoading(true);
    try {
      const result = await resetPassword(email);
      if (result) {
        setMessage("Nueva contraseña enviada con éxito");
        onOpenExitoModal();
      } else {
        setMessage("Error al enviar el correo");
        onOpenErrorModal();
      }
    } catch (error) {
      setMessage("Correo electrónico no válido");
      onOpenErrorModal();
    } finally {
      setLoading(false);
    }
  };
  const handleSuccessClose = () => {
    console.log("Modal de éxito cerrado");
    setShowEmailInput(false);
    setShowAdditionalInputs(true);
    onCloseExitoModal();
  };

  return (
    <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
      <section className="flex flex-col items-center h-full">
        <header className="flex justify-center w-full my-3">
          <Image src={OPERATIONLOGO} alt="..." width={400} />
        </header>
        <Card className="flex flex-col justify-center w-3/6 h-4/6">
          <CardHeader className="h-1/3">
            <h1 className="font-bold text-4xl mx-auto">Iniciar sesión</h1>
          </CardHeader>
          <CardBody>
            <form
              className="flex flex-col justify-around h-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                isRequired
                label={"Correo electronico"}
                type="email"
                size="lg"
                variant="faded"
                {...register("email", { required: true })}
              />
              <Input
                isRequired
                label={"Contraseña"}
                type="password"
                size="lg"
                variant="faded"
                {...register("password", { required: true })}
              />
              <Button
                className="mx-auto w-full"
                color="primary"
                type="submit"
                size="lg"
                variant="ghost"
              >
                Continuar
              </Button>
              <span
                onClick={onOpen}
                style={{
                  color: "primary",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                ¿Olvidaste tu contraseña?
              </span>
            </form>
          </CardBody>
        </Card>
        <div className="flex justify-between w-full mt-4">
          <h3>Todos los derechos reservados</h3>
          <Button color="primary" onPress={onOpen}>
            <Image src={ICONOWHATSAPP} alt="IconoWhatsapp" width={20} />
          </Button>
          <h6>©2024, HECHO POR COINS</h6>
        </div>
      </section>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex justify-center items-center">
            Recuperar Contraseña
          </ModalHeader>

          <ModalBody>
            {showEmailInput && (
              <>
                <Input
                  isRequired
                  label="Correo Electrónico"
                  type="email"
                  {...register("recoveryEmail", { required: true })}
                  className="mb-4"
                />
                <Button
                  onClick={handleResetPassword}
                  color="primary"
                  disabled={loadingReset}
                >
                  {loadingReset ? "Cargando..." : "Obtener nueva contraseña"}
                </Button>
              </>
            )}

            {showAdditionalInputs && (
              <>
                <Input
                  isRequired
                  label="Digite su codigo"
                  type="text"
                  className="mb-4"
                />
                <Input
                  isRequired
                  label="Digite su nueva contraseña"
                  type="text"
                  className="mb-4"
                />
                <Input
                  isRequired
                  label="Confirme la nueva contraseña"
                  type="text"
                  className="mb-4"
                />
              </>
            )}
            {showAdditionalInputs && <></>}
          </ModalBody>
        </ModalContent>
      </Modal>
      <ModalError
        modalControl={{
          isOpen: isOpenErrorModal,
          onOpen: onOpenErrorModal,
          onClose: onCloseErrorModal,
          onOpenChange: onOpenChangeErrorModal,
        }}
        message={message}
      />
      <ModalExito
        modalControl={{
          isOpen: isOpenExitoModal,
          onOpen: onOpenExitoModal,
          onClose: handleSuccessClose,
          onOpenChange: onOpenChangeExitoModal,
        }}
        message={message}
      />
    </main>
  );
}
