import { z } from "zod";

// Nota: Permitimos editar banners antiguos; solo validamos orden init<=end

export const BannerSchema = z
  .object({
    title: z.string().min(1, "El título es requerido"),
    urlDestinity: z.string().min(1, "La URL de destino es requerida"),
    position: z.coerce
      .number()
      .int()
      .nonnegative({ message: "Debe ser un número válido" }),
    initDate: z.date({
      error: "La fecha de inicio es requerida",
    }),
    endDate: z.date({
      error: "La fecha de fin es requerida",
    }),
    desktopImage: z
      .union([
        z.instanceof(File),
        z.string().min(1, "La imagen es obligatoria"),
      ])
      .refine(
        (val) => {
          return (
            val instanceof File || (typeof val === "string" && val.length > 0)
          );
        },
        {
          message: "La imagen es obligatoria",
        }
      ),
    mobileImage: z.union([z.instanceof(File), z.string()]).optional(),
    active: z.boolean(),
  })
  .refine((data) => data.endDate > data.initDate, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["endDate"],
  });

export type BannerForm = z.infer<typeof BannerSchema>;
