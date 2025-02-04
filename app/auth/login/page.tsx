"use client";
import { useRef, useState, useEffect } from "react";
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
import { UseNavigateContext } from "@/app/context/NavigateContext";
import { UseAuthContext } from "@/app/context/AuthContext";
import { ModalError, ModalExito } from "@/components/modales";
import UseResetPassword from "@/app/hooks/UseResetPassword";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import Cookies from "js-cookie";
import { Envelope, Lock } from "@/components/icons";
import MessageError from "@/components/menssageError";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/app/schemas/validationSchemas";
import { LoginData } from "@/types";
import { toast } from "sonner";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

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
  const [theme, setTheme] = useState("light");

  const toggleVisibilityPassword1 = () =>
    setIsVisiblePassword1(!isVisiblePassword1);
  const toggleVisibilityPassword2 = () =>
    setIsVisiblePassword2(!isVisiblePassword2);
  const toggleVisibilityPassword3 = () =>
    setIsVisiblePassword3(!isVisiblePassword3);

  const onSubmit: SubmitHandler<any> = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/users/loginNewPP`,
        data
      );
      console.log(response.data);
      // Guardar el token y lo permisos en una cookie
      //Y el expires es para poner el tiempo de caducacion de la cookie
      Cookies.set("auth_token", response.data.token, {
        expires: 1,
        secure: false,
      });
      Cookies.set("permissions", JSON.stringify(response.data.permissions), {
        expires: 1,
        secure: false,
      });
      console.log("Permissions from cookie:", Cookies.get("permissions"));
      if (response.data.token) {
        setToken(response.data.token);
        setUser({
          name: response.data.name,
          lastName: response.data.lastName,
          realm: response.data.realm,
          permissions: response.data.permissions,
          deviceNme: response.data.deviceNme,
          cellPhoneNumber: response.data.cellPhoneNumber,
          username: response.data.username,
          email: response.data.email,
        });
        setIsAuthenticated(true);
        router.push("/parking-payment");
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.error("Usuario o contraseña incorrectos");
      } else {
        toast.error(
          "Error en el inicio de sesión, por favor intente nuevamente"
        );
      }
      setToken("");
      setIsAuthenticated(false);
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
        toast.success("Código enviado con éxito");
        onOpenExitoModal();
      } else {
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
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/background_login.png')",
      }}
    >
      <section className="flex flex-col items-center h-full">
        <Card className="flex flex-col justify-center h-full w-full max-w-96">
          <CardHeader
            className={`"flex justify-center w-full  " ${theme === "dark" ? "bg-gray-800" : "bg-blue-500"}`}
          >
            <div className="flex flex-col items-center">
              <Image
                src={"/logo-dark.png"}
                alt="Logo"
                width={120}
                height={50}
              />
              <h1 className="text-center  text-sm text-white text-shadow font-medium">
                Sistema de Análisis de información Coins Tech
              </h1>
            </div>
          </CardHeader>

          <CardBody>
            <form
              className="flex flex-col justify-evenly h-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h1 className="font-bold text-4xl mx-auto">Inicio de Sesión</h1>
              <div className="flex flex-col w-full ">
                <label className="font-bold">Correo electrónico</label>
                <Input
                  placeholder="Correo electronico"
                  size="lg"
                  className="border-2 border-blue-500 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  startContent={<Envelope />}
                  {...register("email", { required: true })}
                />
                <div className="h-2">
                  {errors.email && (
                    <MessageError message={errors.email.message} />
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full ">
                <label className="font-bold ">Contraseña</label>
                <Input
                  placeholder="Contraseña"
                  size="lg"
                  className="border-2 border-blue-500 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  startContent={<Lock />}
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
                <div className="h-2">
                  {errors.password && (
                    <MessageError message={errors.password.message} />
                  )}
                </div>
              </div>
              <Button
                className="mx-auto w-full"
                color="primary"
                size="lg"
                type="submit"
                variant="shadow"
                isLoading={loading}
              >
                Iniciar Sesión
              </Button>
            </form>

            <span
              className="text-blue-500 cursor-pointer text-center"
              onClick={onOpen}
            >
              ¿Haz olvidado tu contraseña?
              <span className="underline font-bold">Click aquí</span>
            </span>
          </CardBody>
        </Card>
        <div className="flex justify-between w-full mt-4">
          <h3>Todos los derechos reservados</h3>
          <h6>©2024, HECHO POR COINS</h6>
        </div>
      </section>

      {/*Primera modal para buscar el correo y enviar el codigo*/}
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
                />
                <div className="h-2">
                  {message && (
                    <p className="text-center text-red-500">{message}</p>
                  )}
                </div>
                <div className="flex justify-end gap-4 w-full">
                  <Button
                    color="primary"
                    disabled={loadingReset}
                    onClick={handleResetPassword}
                  >
                    {loadingReset ? "Cargando..." : "Buscar"}
                  </Button>
                  <Button color="primary" variant="ghost" onClick={onClose}>
                    Cancelar
                  </Button>
                </div>
              </>
            )}

            {showAdditionalInputs && (
              <RecoveryInputs
                setModalMessage={setMessage}
                onClose={onClose}
                onOpenExitoModal={onOpenExitoModal}
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
      toast.success("Contraseña actualizada con éxito");
      console.log(response.data);
      onOpenExitoModal(); // Abre el modal de éxito
      onClose(); // Cierra el modal actual
    } catch (error) {
      console.error(error);
      setMessage("Error al actualizar la contraseña");
      toast.error("Error al actualizar la contraseña");
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
      <div className="h-2">
        {message && <p className="text-center text-red-500">{message}</p>}
      </div>

      <div className="flex justify-center space-x-4 mt-6 mb-6 px-4 ">
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
      </div>
    </div>
  );
};
