import { z } from "zod";

export const BannerSchema = z.object({
  title: z.string().min(1, "Requerido"),
  url: z.string().min(1, "Requerido"),
  position: z.enum(["hero", "sidebar", "slideshow"], {
    required_error: "Requerido",
  }),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  image: z.any().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type BannerForm = z.infer<typeof BannerSchema>;
