import { z } from "zod";
export const createUserSchema = (
  existingUsernames: string[],
  existingUserEmails: string[]
) =>
  z.object({
    username: z
      .string()
      .min(1, "El usuario es obligatorio")
      .max(20, "Este campo no debe exceder lo 20 caracteres")
      .regex(
        /^[A-Za-z0-9\s]+$/,
        "El nombre de usuario solo puede contener letras, números y espacios"
      )
      .refine((value) => !existingUsernames.includes(value), {
        message: "Este nombre de usuario ya está en uso",
      }),

    email: z
      .string()
      .min(1, "El email es obligatorio")
      .email("El email no es válido")
      .refine((value) => !existingUserEmails.includes(value), {
        message: "Este email ya está en uso",
      }),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),

    realm: z.string().min(1, "El perfil es obligatorio"),
    name: z.optional(z.string()),
    lastName: z.optional(z.string()),
    cellPhoneNumber: z
      .string()
      .regex(/^\d*$/, "El número de celular solo puede contener números"),
  });

export const vehicleEntrySchema = z.object({
  placa: z
    .string()
    .min(1, "La placa no puede estar vacía")
    .max(6, "La placa debe tener exactamente 6 caracteres")
    .regex(/^[A-Za-z0-9]+$/, "La placa no puede tener caracteres especiales"),
});
