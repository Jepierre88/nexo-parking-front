"use client";

import { UseAuthContext } from "@/app/context/AuthContext";
import UseUsers from "@/app/hooks/users/UseUsers";
import { editProfileSchema } from "@/app/schemas/validationSchemas";
import withPermission from "@/app/withPermission";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import MessageError from "@/components/menssageError";
import { UserData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button, CardBody } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
const Profile = () => {
  const [visiblePassword1, setVisiblePassword1] = useState(false);
  const [visiblePassword2, setVisiblePassword2] = useState(false);
  const toggleVisibilityPassword1 = () =>
    setVisiblePassword1(!visiblePassword1);
  const toggleVisibilityPassword2 = () =>
    setVisiblePassword2(!visiblePassword2);

  const { user } = UseAuthContext();
  const { resetPassword } = UseUsers();

  const { existingUsernames, existingUserEmails } = UseUsers();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({
    resolver: zodResolver(editProfileSchema),
  });

  const reset = async (data: UserData) => {
    const { password, confirmPassword } = data;

    try {
      const response = await resetPassword(
        user.username,
        password,
        confirmPassword
      );
      toast.success("Contraseña actualizada con éxito");
      console.log("Respuesta:", response);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar la contraseña");
    }
  };

  return (
    <main className="container mx-auto max-w-7x1 pt-4 flex-grow">
      <section className="flex flex-col items-center h-full ">
        <Card className="flex flex-col justify-center h-auto w-full max-w-xl p-6 shadow-lg rounded-xl">
          <CardHeader className="flex justify-center items-center h-5 mb-2">
            <h1 className="font-bold text-4xl text-center">Mi perfil</h1>
          </CardHeader>
          <CardBody>
            <h2 className="font-semibold">Datos de cuenta</h2>
            <hr className="separator mb-4 mt-1" />

            <div className="flex justify-between mt-2 space-x-6">
              <div className="flex flex-col w-full ">
                <label className="font-semibold text-sm">
                  Nombre de usuario
                </label>
                <Input
                  className="text-xs"
                  size="sm"
                  variant="faded"
                  type="text"
                  isDisabled
                  value={user.username}
                />
              </div>

              <div className="flex flex-col w-full ">
                <label className="font-semibold text-sm">
                  Correo electrónico
                </label>
                <Input
                  className="text-xs"
                  size="sm"
                  variant="faded"
                  isDisabled
                  value={user.email}
                />
              </div>
            </div>
            <div className="flex justify-between w-full mb-8 mt-4 space-x-6">
              <div className="flex flex-col w-full">
                <label className="font-semibold text-sm">
                  Nueva contraseña
                </label>
                <Input
                  className="text-xs"
                  placeholder="Digite la contraseña"
                  size="sm"
                  variant="faded"
                  {...register("password")}
                  endContent={
                    <button
                      arial-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibilityPassword1}
                    >
                      {visiblePassword1 ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={visiblePassword1 ? "text" : "password"}
                />
                <div className="h-2">
                  {errors.password && (
                    <MessageError message={errors.password.message} />
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full ">
                <label className="font-semibold text-sm">
                  Repetir nueva contraseña
                </label>
                <Input
                  className="text-xs"
                  placeholder="Repita la contraseña"
                  size="sm"
                  variant="faded"
                  {...register("confirmPassword")}
                  endContent={
                    <button
                      arial-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibilityPassword2}
                    >
                      {visiblePassword2 ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={visiblePassword2 ? "text" : "password"}
                />
                <div className="h-2">
                  {errors.confirmPassword && (
                    <MessageError message={errors.confirmPassword.message} />
                  )}
                </div>
              </div>
            </div>
            <div className="flex text-center justify-center mb-4 mt-4">
              <Button
                className="text-sm"
                color="primary"
                onPress={() => handleSubmit(reset)()}
              >
                Actualizar contraseña
              </Button>
            </div>

            <h2 className="font-semibold">Datos de usuario</h2>
            <hr className="separator mb-4 mt-1" />
            <div className="flex justify-between mt-2 space-x-6">
              <div className="flex flex-col w-full">
                <label className="font-semibold text-sm">Nombre</label>
                <Input
                  className="text-xs"
                  size="sm"
                  variant="faded"
                  type="text"
                  isDisabled
                  value={user.name}
                />
              </div>

              <div className="flex flex-col w-full ">
                <label className="font-semibold text-sm">Apellido</label>
                <Input
                  className="text-xs"
                  size="sm"
                  variant="faded"
                  value={user.lastName}
                  isDisabled
                />
              </div>
            </div>
            <div className="flex justify-between mt-2 space-x-6">
              <div className="flex flex-col w-full">
                <label className="font-semibold text-sm ">Celular</label>
                <Input
                  className="text-xs mb-4"
                  size="sm"
                  variant="faded"
                  type="text"
                  isDisabled
                  value={user.cellPhoneNumber}
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="font-semibold text-sm ">Perfil</label>
                <Input
                  className="text-xs mb-4"
                  size="sm"
                  variant="faded"
                  value={user.realm}
                  isDisabled
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </section>
    </main>
  );
};
export default withPermission(Profile, 39);
