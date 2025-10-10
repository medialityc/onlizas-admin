import { z } from "zod";

const colorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

// Schema combinado para todo el tab de Apariencia
export const AppearanceSchema = z.object({
  // Tema y Colores - valores simples, sin validación estricta
  primaryColor: z.string().regex(colorRegex, "Formato de color inválido"),
  secondaryColor: z.string().regex(colorRegex, "Formato de color inválido"), 
  accentColor: z.string().regex(colorRegex, "Formato de color inválido"),
  font: z.string().min(1, "La fuente es requerida"),
  template: z.string().min(1, "La plantilla es requerida"),

  // Banners - validación condicional solo si hay banners
  banners: z.array(z.object({
    id: z.union([z.string(), z.number().nonnegative()]).optional(),
    title: z.string().optional(), // Solo requerido si hay contenido
    urlDestinity: z.string().optional(), // Solo requerido si hay contenido
    position: z.coerce.number().int().nonnegative({ message: "La posición debe ser un número entero" }).optional(),
    initDate: z.string().optional(),
    endDate: z.string().optional(),
    image: z.union([
      z.instanceof(File, { message: "Debe ser un archivo válido." }),
      z.string(),
      z.null(),
    ]).optional(),
    active: z.boolean().optional(),
  })).default([]),
});

export type AppearanceForm = z.infer<typeof AppearanceSchema>;

// Tipo manual para asegurar compatibilidad
export interface AppearanceFormData {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  font: string;
  template: string;
  banners: Array<{
    id?: number | string;
    title?: string;
    urlDestinity?: string;
    position?: number;
    initDate?: string;
    endDate?: string;
    image?: File | string | null;
    active?: boolean;
  }>;
}

// Valores por defecto
export const DEFAULT_APPEARANCE: AppearanceFormData = {
  primaryColor: "#3B82F6",
  secondaryColor: "#111827", 
  accentColor: "#F59E0B",
  font: "ARIAL",
  template: "MODERNO",
  banners: [],
};
