import { z } from "zod";
import { IPermission } from "@/types/permissions";

// Esquema para actualizar permiso
export const permissionUpdateSchema = (existingPermissions: IPermission[]) =>
  z
    .object({
      name: z
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre no puede exceder 50 caracteres"),
      code: z
        .string()
        .min(2, "El código debe tener al menos 2 caracteres")
        .max(20, "El código no puede exceder 20 caracteres")
        .regex(
          /^[A-Z_]+$/,
          "El código debe contener solo letras mayúsculas y guiones bajos"
        ),
      description: z
        .string()
        .min(1, "La descripción es requerida")
        .max(255, "La descripción no puede exceder 255 caracteres"),
      entity: z.string().min(1, "La entidad es requerida"),
      type: z.number({ error: "El tipo es requerido" }),
    })
    .refine(
      (data) =>
        !existingPermissions.some(
          (perm) =>
            perm.name.trim().toLowerCase() === data.name.trim().toLowerCase()
        ),
      { message: "El nombre ya existe", path: ["name"] }
    )
    .refine(
      (data) =>
        !existingPermissions.some(
          (perm) =>
            perm.code.trim().toUpperCase() === data.code.trim().toUpperCase()
        ),
      { message: "El código ya existe", path: ["code"] }
    );

// Esquema para búsqueda/filtro de permisos
export const permissionSearchSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  isDescending: z.boolean().optional(),
  entity: z.string().optional(),
  type: z.number().optional(),
});

// Tipos
export type PermissionUpdateData = z.infer<
  ReturnType<typeof permissionUpdateSchema>
>;
