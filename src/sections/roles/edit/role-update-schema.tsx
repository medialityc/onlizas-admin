import { z } from "zod";

export interface IRole {
  name: string;
  code: string;
  description?: string;
}

export const roleUpdateSchema = z.object({
  permissions: z.array(z.string()).min(1, "Seleccione al menos un permiso"),
});
