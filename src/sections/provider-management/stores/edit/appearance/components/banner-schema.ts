import { z } from "zod";

export const BannerSchema = z.object({
  title: z.string().min(1, "Requerido"),
  urlDestinity: z.string().min(1, "Requerido"),
  position: z.coerce.number().int().nonnegative({ message: "Debe ser un número" }),
  initDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  image: z.any().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type BannerForm = z.infer<typeof BannerSchema>;
