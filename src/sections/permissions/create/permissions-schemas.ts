import { ICreatePermission, IPermission } from "@/types/permissions";
import { z } from "zod";

// Permission create schema
export const createPermissionSchema = (
  existingPermissions: ICreatePermission[]
) =>
  z.object({
    name: z
      .string()
      .min(1, "El nombre es requerido")
      .max(50, "El nombre no puede exceder 50 caracteres")
      .refine(
        (val) =>
          !existingPermissions.some(
            (perm) =>
              perm.name.trim().toLowerCase() === val.trim().toLowerCase()
          ),
        { message: "El nombre ya está en uso" }
      ),
    code: z
      .string()
      .min(1, "El código es requerido")
      .max(30, "El código no puede exceder 30 caracteres")
      .regex(
        /^[A-Z_]+$/,
        "El código debe contener solo letras mayúsculas y guiones bajos"
      )
      .refine(
        (val) =>
          !existingPermissions.some(
            (perm) =>
              perm.code.trim().toUpperCase() === val.trim().toUpperCase()
          ),
        { message: "El código ya está en uso" }
      ),
    permissionType: z.number().min(0, "Debe seleccionar un tipo"),
    description: z
      .string()
      .max(255, "La descripción no puede exceder 255 caracteres")
      .optional(),
    roleId: z
      .number({ error: "El rol es requerido" })
      .min(1, "Debe seleccionar un rol"),
  });

// Permission update schema (partial)
export const updatePermissionSchema = (existingPermissions: IPermission[]) =>
  z.object({
    id: z.number().optional(),
    name: z
      .string()
      .min(1, "El nombre es requerido")
      .max(50, "El nombre no puede exceder 50 caracteres")
      .refine(
        (val) =>
          !existingPermissions.some(
            (perm) =>
              perm.name.trim().toLowerCase() === val.trim().toLowerCase()
          ),
        { message: "El nombre ya está en uso" }
      ),
    code: z
      .string()
      .min(1, "El código es requerido")
      .max(30, "El código no puede exceder 30 caracteres")
      .regex(
        /^[A-Z_]+$/,
        "El código debe contener solo letras mayúsculas y guiones bajos"
      )
      .refine(
        (val) =>
          !existingPermissions.some(
            (perm) =>
              perm.code.trim().toUpperCase() === val.trim().toUpperCase()
          ),
        { message: "El código ya está en uso" }
      ),
    description: z
      .string()
      .min(1, "La descripción es requerida")
      .max(255, "La descripción no puede exceder 255 caracteres"),
    roleId: z
      .number({ error: "El rol es requerido" })
      .min(1, "Debe seleccionar un rol"),
  });
// Permission search/filter schema
export const permissionSearchSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  isDescending: z.boolean().optional(),
  roleId: z.number().optional(),
});

// Export types
export type CreatePermissionSchema = z.infer<
  ReturnType<typeof createPermissionSchema>
>;
export type UpdatePermissionSchema = z.infer<
  ReturnType<typeof updatePermissionSchema>
>;
export type PermissionSearchSchema = z.infer<typeof permissionSearchSchema>;

// Default values
export const defaultPermissionForm: Partial<CreatePermissionSchema> = {
  name: "",
  code: "",
  description: "",
  roleId: undefined,
};
