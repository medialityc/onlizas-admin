import { z } from "zod";

export const homeBannerSchema = z.object({
  id: z.number().optional(),
  link: z.string({ required_error: "Requerido" }).min(5, "Mínimo 5 caracteres"),
  regionIds: z.array(z.number()).refine((arr) => arr.length > 0, {
    message: "La región es obligatoria.",
    path: ["regionIds"],
  }),
  imageMobileUrl: z.union(
    [
      z.string().url("Debe ser una URL válida para la imagen."),
      z.instanceof(File, { message: "Debe ser un archivo válido." }),
    ],
    { required_error: "La imagen es obligatoria." }
  ),
  imageDesktopUrl: z.union(
    [
      z.string().url("Debe ser una URL válida para la imagen."),
      z.instanceof(File, { message: "Debe ser un archivo válido." }),
    ],
    { required_error: "La imagen es obligatoria." }
  ),
  isActive: z
    .boolean({ required_error: "El estado activo es obligatorio." })
    .default(false),
});

export type HomeBannerFormData = z.infer<typeof homeBannerSchema> & {
  regionsIds?: string[];
};
