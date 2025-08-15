import { z } from "zod";

export const businessSchema = z.object({
  code: z
    .string({ required_error: "El código es obligatorio." })
    .min(1, "El código no puede estar vacío.")
    .max(20, "Máximo 20 caracteres."),

  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "Máximo 100 caracteres."),
  parentId:z.coerce.number().optional(),

  hblInitial: z
    .string({ required_error: "El HBL inicial es obligatorio." })
    
    .max(30, "Máximo 30 caracteres."),

  locationId: z
    .coerce.number().int().positive({message:"Debe ser un numero"}),

  description: z.string().max(500).optional(),
  address: z.string().max(200).optional(),
  email: z
    .string()
    .email("Formato de correo inválido.")
    .max(100)
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^[\d+\-\s()]{7,20}$/, "Teléfono inválido.")
    .optional()
    .or(z.literal("")),
  isPrimary: z.boolean().optional(),
  fixedRate: z.number().min(0).max(999999).optional(),
  invoiceText: z.string().max(500).optional(),
  //users: z.array(z.number().int().positive()).max(50).optional(),
  //childBusinessIds: z.array(z.number().int().positive()).max(50).optional(),
  photoObjectCodes: z
    .array(
      //z.string()
      z.union([
        z.string().url("Debe ser una URL válida."),
        z.instanceof(File, { message: "Debe ser un archivo válido." }),
      ]) 
    )
    .max(10, "Máximo 10 imágenes.")
    .optional(),
});


export type CreateSchemaBusiness = z.infer<typeof businessSchema>;
