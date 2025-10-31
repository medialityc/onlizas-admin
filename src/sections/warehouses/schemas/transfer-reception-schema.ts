import { z } from "zod";

// -------------------------------------------------------------
// Transfer Reception Schemas
// Centraliza la validación y typing de todos los formularios
// relacionados con la recepción de una transferencia.
// -------------------------------------------------------------

// Tipos de discrepancias permitidas.
const discrepancyTypes = [
  "missing_quantity",
  "excess_quantity",
  "wrong_product",
  "wrong_batch",
  "damaged_product",
  "expired_product",
  "other",
] as const;

// Evidencia / documentos asociados a la recepción (subidos desde la UI)
export const receptionEvidenceSchema = z.object({
  id: z.string().optional(), // id temporal o definitivo
  name: z.string(),
  type: z.string(), // mime type
  size: z.number(),
  url: z.string().optional(), // URL tras subir al backend
  uploadProgress: z.number().optional(), // progreso parcial (solo UI)
  isUploading: z.boolean().optional(), // estado de subida (solo UI)
});

// Item de recepción dentro de la transferencia
export const transferReceptionItemSchema = z.object({
  transferItemId: z.string({ required_error: "ID del item es requerido" }),
  receivedQuantity: z
    .number({ required_error: "Cantidad recibida requerida" })
    .nonnegative("Cantidad no puede ser negativa"),
  batchNumber: z.string().optional().or(z.literal("")),
  expiryDate: z.string().optional().or(z.literal("")),
  discrepancyType: z.enum(discrepancyTypes).optional(),
  discrepancyNotes: z.string().optional().or(z.literal("")),
  isAccepted: z.boolean().optional(),
});

// Producto inesperado recibido que no estaba en la transferencia original
export const unexpectedProductSchema = z.object({
  productName: z.string().min(1, "El nombre del producto es requerido"),
  quantity: z
    .number({ required_error: "La cantidad es requerida" })
    .positive("La cantidad debe ser mayor a 0"),
  unit: z.string().min(1, "La unidad es requerida"),
  batchNumber: z.string().optional().or(z.literal("")),
  observations: z.string().optional().or(z.literal("")),
});

// Schema principal para crear recepción
export const createTransferReceptionSchema = z.object({
  transferId: z.string({ required_error: "Transferencia requerida" }),
  items: z.array(transferReceptionItemSchema).min(1, "Debe haber items"),
  unexpectedProducts: z.array(unexpectedProductSchema).optional(),
  notes: z.string().optional().or(z.literal("")),
  status: z.string({ required_error: "Estado es requerido" }),
  // Documentación y evidencia
  evidence: z.array(receptionEvidenceSchema).optional(),
  documentationNotes: z.string().optional().or(z.literal("")),
  documentationComplete: z.boolean().optional(),
});

// Tipos inferidos
export type CreateTransferReceptionFormData = z.infer<typeof createTransferReceptionSchema>;
export type TransferReceptionItemFormData = z.infer<typeof transferReceptionItemSchema>;
export type UnexpectedProductFormSchema = z.infer<typeof unexpectedProductSchema>;
export type ReceptionEvidenceFormData = z.infer<typeof receptionEvidenceSchema>;
