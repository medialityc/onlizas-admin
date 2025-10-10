import { z } from "zod";

export const accountSettingsSchema = z.object({
  businesses: z
    .array(
      z.object({
        id: z.union ([z.string(), z.number()]),
        name: z.string().optional(),
        code: z.string().optional(),
      })
    )
    .optional(),
  beneficiaries: z.array(z.any()).optional(),
});

export type AccountSettingsFormData = z.infer<typeof accountSettingsSchema>;

export const defaultAccountSettingsForm: Partial<AccountSettingsFormData> = {
  businesses: [],
  beneficiaries: [],
};
