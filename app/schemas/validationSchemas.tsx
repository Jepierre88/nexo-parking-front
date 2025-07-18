import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("El formato del email no es válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});
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
        "El usuario solo puede contener letras, números y espacios"
      )
      .transform((value) =>
        value
          .toLowerCase()
          .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())
      )
      .refine((value) => !existingUsernames.includes(value), {
        message: "Este usuario de usuario ya está en uso",
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
    name: z
      .optional(z.string())
      .transform((value) =>
        value
          ? value
            .toLowerCase()
            .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())
          : ""
      ),
    lastName: z
      .optional(z.string())
      .transform((value) =>
        value
          ? value
            .toLowerCase()
            .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())
          : ""
      ),
    cellPhoneNumber: z
      .string()
      .regex(/^\d*$/, "El número de celular solo puede contener números"),
  });

export const editUserSchema = (
  existingUsernames: string[],
  existingUserEmails: string[],
  currentUsername: string,
  currentEmail: string
) =>
  z.object({
    realm: z.string().min(1, "El perfil es obligatorio"),
    name: z
      .string()
      .min(1, "El nombre es obligatorio")
      .max(20, "Este campo no debe exceder lo 20 caracteres")
      .transform((value) =>
        value
          .toLowerCase()
          .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())
      ),
    lastName: z
      .string()
      .min(1, "El apellido es obligatorio")
      .max(20, "Este campo no debe exceder lo 20 caracteres")
      .transform((value) =>
        value
          .toLowerCase()
          .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())
      ),
    username: z
      .string()
      .min(1, "El usuario es obligatorio")
      .refine(
        (username) =>
          username === currentUsername || !existingUsernames.includes(username),
        {
          message: "El usuario ya existe",
        }
      ),
    email: z
      .string()
      .email("El formato del email es inválido")
      .refine(
        (email) =>
          email === currentEmail || !existingUserEmails.includes(email),
        {
          message: "El email ya está registrado",
        }
      ),
  });

export const vehicleEntrySchema = z.object({
  plate: z
    .string()
    .min(1, "La placa debe tener 6 caracteres")
    .max(6, "La placa debe tener exactamente 6 caracteres")
    .regex(/^[A-Za-z0-9]+$/, "La placa no puede tener caracteres especiales"),
});

export const resetPasswordSchema = (existingUserEmails: string[]) => {
  z.object({
    email: z
      .string()
      .min(1, "El email es obligatorio")
      .email("El email no es válido")
      .refine((value) => existingUserEmails.includes(value), {
        message: "Este email no está en uso",
      }),
  });
};

export const montleSubscription = z.object({
  placa: z
    .string()
    .max(6, "La placa debe tener exactamente 6 caracteres")
    .regex(/^[A-Za-z0-9]*$/, "Digita la placa sin caracteres especiales"),
});

export const validateIdentificationCode = z.object({
  identificationCode: z
    .string()
    .min(1, "La cédula es obligatoria")
    .max(15, "El id debe tener maximo 15 caracteres")
    .regex(/^\d+$/, "Digita la cédula sin caracteres especiales"),
});
export const dateValidationSchema = z.object({
  date: z
    .string()
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "La fecha debe estar en formato dd/mm/yyyy"
    )
    .max(10, "La fecha debe estar en formato dd/mm/yyyy"),
});
export const numberMonthsSchema = z.object({
  numberMonths: z
    .number()
    .min(1, "Debe Pagar Minimo 1 Mes")
    .max(24, "Debe Pagar Máximo 24 meses"),
});
export const incomeSchema = z.object({
  id: z.string(),
  plate: z
    .string()
    .min(1, "La placa es obligatoria")
    .max(6, "La placa no puede tener más de 6 caracteres"),
  vehicleKind: z.string(),
  datetime: z.date(),
});

export const editProfileSchema = z
  .object({
    password: z.string().min(8, "La contraseña debe tener mínimo 8 caracteres"),
    confirmPassword: z
      .string()
      .min(
        8,
        "La confirmación de la contraseña debe tener mínimo 8 caracteres"
      ),
    lastPassword: z.string().min(8, "La contraseña debe tener mínimo 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
