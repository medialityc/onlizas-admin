import { z } from "zod";

export const HomeBannerSchema = z.object({
  title: z.string().min(1, "Requerido"),
  url: z.string().min(1, "Requerido"),
  position: z.enum(["hero", "sidebar", "slideshow"], {
    error: "Requerido",
  }),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  image: z.any().optional().nullable(),
  active: z.boolean().default(true),
});

export type HomeBannerForm = z.infer<typeof HomeBannerSchema>;
