import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0); // Start of today

export const BannerSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  urlDestinity: z.string().min(1, "La URL de destino es requerida"),
  position: z.coerce.number().int().nonnegative({ message: "Debe ser un número válido" }),
  initDate: z.date({
    required_error: "La fecha de inicio es requerida",
    invalid_type_error: "La fecha de inicio debe ser válida"
  }).refine((date) => date >= today, {
    message: "La fecha de inicio no puede ser anterior a hoy"
  }),
  endDate: z.date({
    required_error: "La fecha de fin es requerida",
    invalid_type_error: "La fecha de fin debe ser válida"
  }).refine((date) => date >= today, {
    message: "La fecha de fin no puede ser anterior a hoy"
  }),
  image: z.union([
    z.instanceof(File),
    z.string(),
    z.null()
  ]).optional(),
  isActive: z.boolean().default(true),
}).refine((data) => data.endDate >= data.initDate, {
  message: "La fecha de fin debe ser posterior o igual a la fecha de inicio",
  path: ["endDate"]
});

export type BannerForm = z.infer<typeof BannerSchema>;
