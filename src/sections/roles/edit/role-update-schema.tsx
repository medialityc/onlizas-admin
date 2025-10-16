import { z } from "zod";

export interface IRole {
  name: string;
  code: string;
  description?: string;
}

export const roleUpdateSchema = z
  .object({
    readPermissions: z
      .array(z.string())
      .min(1, "Seleccione al menos un permiso"),
    permissions: z.array(z.string()).min(1, "Seleccione al menos un permiso"),
    addPermissionsIds: z.array(z.string()).optional(),
    removePermissionsIds: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      // Calcula los permisos a agregar y quitar
      const addPermissionsIds = data.permissions.filter(
        (perm) => !data.readPermissions.includes(perm)
      );
      const removePermissionsIds = data.readPermissions.filter(
        (perm) => !data.permissions.includes(perm)
      );
      // Asigna los resultados al objeto
      data.addPermissionsIds = addPermissionsIds;
      data.removePermissionsIds = removePermissionsIds;
      return true;
    },
    {
      message: "Error al calcular permisos",
      path: ["permissions"],
    }
  );

export type IRoleUpdateSchema = z.infer<typeof roleUpdateSchema>;
