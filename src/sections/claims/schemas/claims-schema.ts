import { z } from "zod";

export const resolveClaimSchema = z.object({
  favorClient: z.enum(["true", "false"]),
  resolutionNotes: z.string().optional(),
});

export type ResolveClaimFormData = z.infer<typeof resolveClaimSchema>;
