import { z } from "zod";

export const withLoginSchema = z
  .object({
    changePassword: z.boolean(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.changePassword) {
      if (!data.password || data.password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message:
            "La contraseña es obligatoria y debe tener al menos 6 caracteres.",
        });
      }
      if (!data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "La confirmación es obligatoria.",
        });
      } else if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "Las contraseñas no coinciden.",
        });
      }
    }
  });

export type WithLoginForm = z.infer<typeof withLoginSchema>;
