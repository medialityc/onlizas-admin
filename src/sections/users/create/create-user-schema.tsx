import { z } from "zod";

export const createUserSchema = (type: "email" | "phone") =>
    z.object({
        name: z.string().min(3, "El nombre es requerido").max(50, "El nombre no puede exceder 50 caracteres"),
        email:
            type === "email"
                ? z.string().min(1, "El email es requerido").email("Email inválido")
                : z.string().optional(),
        phoneNumberCountryId:
            type === "phone"
                ? z
                        .number({ required_error: "El país del teléfono es requerido" })
                        .min(1, "El país del teléfono es requerido")
                : z.number().optional(),
        phoneNumber:
            type === "phone"
                ? z
                        .string()
                        .min(1, "El número de teléfono es requerido")
                        .regex(/^\d{8,15}$/, "Número de teléfono inválido")
                : z.string().optional(),
        password: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .max(128, "La contraseña no puede exceder 128 caracteres")
            .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
            .regex(/[a-z]/, "La contraseña debe contener al menos una minúscula")
            .regex(/\d/, "La contraseña debe contener al menos un número")
            .regex(/[^A-Za-z0-9]/, "La contraseña debe contener al menos un carácter especial"),
    });

export type CreateUserSchema = z.infer<ReturnType<typeof createUserSchema>>;
