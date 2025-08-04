import { z } from 'zod';

export interface IRole {
    name: string;
    code: string;
    description?: string;
}

export const roleUpdateSchema = (existingRoles: IRole[]) =>
    z.object({
        name: z.string()
            .min(2, 'El nombre debe tener al menos 2 caracteres')
            .max(50, 'El nombre no puede exceder 50 caracteres')
            .refine(
                (name) => !existingRoles.some(role => role.name === name),
                { message: 'El nombre ya está en uso' }
            ),
        code: z.string()
            .min(2, 'El código debe tener al menos 2 caracteres')
            .max(20, 'El código no puede exceder 20 caracteres')
            .refine(
                (code) => !existingRoles.some(role => role.code === code),
                { message: 'El código ya está en uso' }
            ),
        description: z.string().optional(),
    });

// To infer the schema, use the return type of the function
export type RoleUpdateData = z.infer<ReturnType<typeof roleUpdateSchema>>;