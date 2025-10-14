import { IRole } from "@/types/roles";
import { z } from "zod";

// Role create schema
export const createRoleSchema = (existingRoles: IRole[]) =>
  z
    .object({
      name: z
        .string()
        .min(1, "El nombre es requerido")
        .max(50, "El nombre no puede exceder 50 caracteres"),
      code: z
        .string()
        .min(1, "El código es requerido")
        .max(20, "El código no puede exceder 20 caracteres")
        .regex(
          /^[A-Z_]+$/,
          "El código debe contener solo letras mayúsculas y guiones bajos"
        ),
      description: z
        .string()
        .min(1, "La descripción es requerida")
        .max(255, "La descripción no puede exceder 255 caracteres"),
      permissions: z.array(z.string()).optional(), // Array of permission IDs
    })
    .refine(
      (data) =>
        !existingRoles.some(
          (role) =>
            role.name.trim().toLowerCase() === data.name.trim().toLowerCase()
        ),
      { message: "El nombre ya existe", path: ["name"] }
    )
    .refine(
      (data) =>
        !existingRoles.some(
          (role) =>
            role.code.trim().toUpperCase() === data.code.trim().toUpperCase()
        ),
      { message: "El código ya existe", path: ["code"] }
    );

export type CreateRoleSchema = z.infer<ReturnType<typeof createRoleSchema>>;
export type UpdateRoleSchema = Partial<CreateRoleSchema> & { id: string };

// Role search/filter schema
export const roleSearchSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  isDescending: z.boolean().optional(),
  permissions: z.array(z.string()).optional(),
});
// Export types
export type RoleSearchSchema = z.infer<typeof roleSearchSchema>;

// Default values
export const defaultRoleForm: Partial<CreateRoleSchema> = {
  name: "",
  code: "",
  description: "",
};
