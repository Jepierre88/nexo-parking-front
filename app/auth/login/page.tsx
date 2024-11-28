"use client";
import { useRef, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";

import OPERATIONLOGO from "@/app/assets/img/LOGO.png";
import ICONOWHATSAPP from "@/public/iconoWhatsapp.png";
import { UseNavigateContext } from "@/app/context/NavigateContext";
import { UseAuthContext } from "@/app/context/AuthContext";
import { ModalError, ModalExito } from "@/components/modales";
import UseResetPassword from "@/app/parking-payment/hooks/UseResetPassword";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";

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
  const { register, handleSubmit, getValues, reset } = useForm();
  const {
    register: registerModal,
    handleSubmit: handleSubmitModal,
    reset: resetModal,
    getValues: getValuesModal,
  } = useForm();

  const { resetPassword, loading: loadingReset } = UseResetPassword();
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(true);

  const [isVisiblePassword1, setIsVisiblePassword1] = useState(false);
  const [isVisiblePassword2, setIsVisiblePassword2] = useState(false);
  const [isVisiblePassword3, setIsVisiblePassword3] = useState(false);

  const toggleVisibilityPassword1 = () =>
    setIsVisiblePassword1(!isVisiblePassword1);
  const toggleVisibilityPassword2 = () =>
    setIsVisiblePassword2(!isVisiblePassword2);
  const toggleVisibilityPassword3 = () =>
    setIsVisiblePassword3(!isVisiblePassword3);

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
          Permissions: response.data.lastName,
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
    const email = getValuesModal("recoveryEmail");

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
    resetModal();
    setShowEmailInput(false);
    setShowAdditionalInputs(true);
    onCloseExitoModal();
  };

  return (
    <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
      <section className="flex flex-col items-center h-full">
        <header className="flex justify-center w-full my-3">
          <Image alt="..." src={OPERATIONLOGO} width={400} />
        </header>
        <Card className="flex flex-col justify-center w-3/6 h-4/6">
          <CardHeader className="h-1/3">
            <h1 className="font-bold text-4xl mx-auto">Iniciar sesión</h1>
          </CardHeader>
          <CardBody>
            <form
              className="flex flex-col justify-evenly h-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                placeholder={"Correo electronico"}
                size="lg"
                type="email"
                variant="faded"
                {...register("email", { required: true })}
              />
              <Input
                placeholder="Contraseña"
                size="lg"
                variant="faded"
                {...register("password", { required: true })}
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibilityPassword1}
                  >
                    {isVisiblePassword1 ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisiblePassword1 ? "text" : "password"}
              />
              <Button
                className="mx-auto w-full"
                color="primary"
                size="lg"
                type="submit"
                variant="ghost"
              >
                Continuar
              </Button>
            </form>

            <span
              style={{
                color: "primary",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={onOpen}
            >
              ¿Olvidaste tu contraseña?
            </span>
          </CardBody>
        </Card>
        <div className="flex justify-between w-full mt-4">
          <h3>Todos los derechos reservados</h3>
          <Button color="primary" onPress={onOpen}>
            <Image alt="IconoWhatsapp" src={ICONOWHATSAPP} width={20} />
          </Button>
          <h6>©2024, HECHO POR COINS</h6>
        </div>
      </section>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex justify-center items-center">
            Recuperar Contraseña
          </ModalHeader>
          <hr className="border-t-1" />
          <ModalBody className="my-2">
            {showEmailInput && (
              <>
                <p className="tracking-tighter">
                  Ingresa tu correo electrónico para buscar tu cuenta.
                </p>
                <Input
                  placeholder="Correo Electrónico"
                  type="email"
                  {...registerModal("recoveryEmail", { required: true })}
                  className="mb-4"
                />
                <div className="flex justify-end gap-4 w-full">
                  <Button color="primary" variant="ghost" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    disabled={loadingReset}
                    onClick={handleResetPassword}
                  >
                    {loadingReset ? "Cargando..." : "Buscar"}
                  </Button>
                </div>
              </>
            )}

            {showAdditionalInputs && (
              <RecoveryInputs
                setModalMessage={setMessage}
                onClose={onClose}
                onOpenExitoModal={onOpenExitoModal} // Pasa la función para abrir el modal de éxito
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <ModalError
        message={message}
        modalControl={{
          isOpen: isOpenErrorModal,
          onOpen: onOpenErrorModal,
          onClose: onCloseErrorModal,
          onOpenChange: onOpenChangeErrorModal,
        }}
      />
      <ModalExito
        message={message}
        modalControl={{
          isOpen: isOpenExitoModal,
          onOpen: onOpenExitoModal,
          onClose: handleSuccessClose,
          onOpenChange: onOpenChangeExitoModal,
        }}
      />
    </main>
  );
}

const RecoveryInputs = ({
  onClose,
  onOpenExitoModal,
  setModalMessage,
}: {
  onClose: () => void;
  onOpenExitoModal: () => void;
  setModalMessage: (message: string) => void;
}) => {
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement | null>(null);
  const [isVisiblePassword2, setIsVisiblePassword2] = useState(false);
  const [isVisiblePassword3, setIsVisiblePassword3] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const toggleVisibilityPassword2 = () =>
    setIsVisiblePassword2(!isVisiblePassword2);
  const toggleVisibilityPassword3 = () =>
    setIsVisiblePassword3(!isVisiblePassword3);

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.currentTarget.value;

    if (value.length === 1 && index < codeInputRefs.current.length - 1) {
      codeInputRefs.current[index + 1]?.focus();
    } else if (e.key === "Backspace" && index > 0 && value === "") {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = codeInputRefs.current
      .map((input) => input?.value || "")
      .join("");
    const newPassword = passwordInputRef.current?.value || "";
    const confirmPassword = confirmPasswordInputRef.current?.value || "";

    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");

      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/reset-password/finish`,
        {
          resetKey: code,
          password: newPassword,
          confirmPassword: confirmPassword,
        }
      );

      setMessage("Contraseña actualizada con éxito");
      setModalMessage("Contraseña actualizada con éxito");
      console.log(response.data);
      onOpenExitoModal(); // Abre el modal de éxito
      onClose(); // Cierra el modal actual
    } catch (error) {
      console.error(error);
      setMessage("Error al actualizar la contraseña");
      setModalMessage("Error al actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p>
        Comprueba si recibiste un correo electrónico con tu código de 6 dígitos
        e ingrésalo a continuación:
      </p>
      <div className="flex space-x-2 justify-center">
        {Array.from({ length: 6 }).map((_, index) => (
          <Input
            key={index}
            ref={(el: any) => (codeInputRefs.current[index] = el)}
            required
            autoFocus={index === 0}
            className="text-center"
            maxLength={1}
            type="text"
            onKeyUp={(e) => handleKeyUp(e, index)}
          />
        ))}
      </div>
      <Input
        ref={passwordInputRef}
        required
        className="mb-4"
        endContent={
          <button
            aria-label="toggle password visibility"
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibilityPassword2}
          >
            {isVisiblePassword2 ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        placeholder="Nueva contraseña"
        size="lg"
        type={isVisiblePassword2 ? "text" : "password"}
        variant="faded"
      />
      <Input
        ref={confirmPasswordInputRef}
        required
        className="mb-4"
        endContent={
          <button
            aria-label="toggle password visibility"
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibilityPassword3}
          >
            {isVisiblePassword3 ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        placeholder="Confirmar nueva contraseña"
        size="lg"
        type={isVisiblePassword3 ? "text" : "password"}
        variant="faded"
      />
      <div className="flex justify-center space-x-4 mt-6 mb-6 px-4 ">
        <Button
          className=" w-full"
          color="primary"
          size="lg"
          type="button"
          variant="ghost"
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          className="w-full"
          color="primary"
          disabled={loading}
          size="lg"
          type="button"
          variant="solid"
          onClick={handleSubmit}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
      {message && <p className="text-center text-red-500">{message}</p>}
    </div>
  );
};
