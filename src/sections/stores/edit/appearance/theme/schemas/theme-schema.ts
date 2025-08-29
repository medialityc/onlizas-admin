import { z } from "zod";

export const ThemeSchema = z.object({
  primaryColor: z.string().min(1, "Color primario es requerido"),
  secondaryColor: z.string().min(1, "Color secundario es requerido"),
  accentColor: z.string().min(1, "Color de acento es requerido"),
  font: z.string().min(1, "Fuente es requerida"),
  template: z.string().min(1, "Template es requerido"),
});

export type ThemeForm = z.infer<typeof ThemeSchema>;

export const DEFAULT_THEME = {
  primaryColor: "#3B82F6",
  secondaryColor: "#64748B", 
  accentColor: "#F59E0B",
  font: "Inter",
  template: "modern",
} as const;