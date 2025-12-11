import { z } from "zod";

export const pendingDocumentSchema = z.object({
  id: z.number().optional(),
  fileName: z
    .string({ error: "El nombre del archivo es obligatorio." })
    .min(1, "El nombre del archivo es obligatorio."),
  content: z
    .union([
      z.instanceof(File, { message: "Debe seleccionar un archivo válido." }),
      z.string().min(1),
    ])
    .optional(),
  beApproved: z.boolean().optional(),
  rejectionReason: z.string().nullable().optional(),
});

export const pendingDocumentsFormSchema = z.object({
  approvalProcessId: z.union([
    z.number(),
    z.string().min(1, "approvalProcessId requerido"),
  ]),
  pendingDocuments: z.array(pendingDocumentSchema).default([]),
});

export type PendingDocumentsForm = z.input<typeof pendingDocumentsFormSchema>;
