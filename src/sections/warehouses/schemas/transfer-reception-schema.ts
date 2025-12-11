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
  transferItemId: z.string({ error: "ID del item es requerido" }),
  productVariantId: z.string({
    error: "ID del producto variante es requerido",
  }),
  quantityReceived: z
    .number({ error: "Cantidad recibida requerida" })
    .nonnegative("Cantidad no puede ser negativa"),
  unit: z.string({ error: "Unidad es requerida" }),
  receivedBatch: z.string().optional().nullable(),
  receivedExpiryDate: z.string().optional().nullable(),
  discrepancyType: z.enum(discrepancyTypes).optional().nullable(),
  discrepancyNotes: z.string().optional().nullable(),
  isAccepted: z.boolean().optional(),
});

// Producto inesperado recibido que no estaba en la transferencia original
export const unexpectedProductSchema = z.object({
  productName: z.string().min(1, "El nombre del producto es requerido"),
  quantity: z
    .number({ error: "La cantidad es requerida" })
    .positive("La cantidad debe ser mayor a 0"),
  unit: z.string().min(1, "La unidad es requerida"),
  batchNumber: z.string().optional().or(z.literal("")),
  observations: z.string().optional().or(z.literal("")),
});

// Schema principal para crear recepción
export const createTransferReceptionSchema = z.object({
  transferId: z.string({ error: "Transferencia requerida" }),
  items: z.array(transferReceptionItemSchema).min(1, "Debe haber items"),
  unexpectedProducts: z.array(unexpectedProductSchema).optional(),
  notes: z.string().optional().or(z.literal("")),
  // status se determina dinámicamente en el componente, no viene del formulario
  status: z.string().optional(),
  // Documentación y evidencia
  evidence: z.array(receptionEvidenceSchema).optional(),
  documentationNotes: z.string().optional().or(z.literal("")),
  documentationComplete: z.boolean().optional(),
  // Campo temporal para nuevo comentario (no se envía al backend)
  newComment: z.string().optional(),
  // Campo temporal para resolución de discrepancia (no se envía al backend)
  resolutionNote: z.string().optional(),
});

// Tipos inferidos
export type CreateTransferReceptionFormData = z.infer<
  typeof createTransferReceptionSchema
>;
export type TransferReceptionItemFormData = z.infer<
  typeof transferReceptionItemSchema
>;
export type UnexpectedProductFormSchema = z.infer<
  typeof unexpectedProductSchema
>;
export type ReceptionEvidenceFormData = z.infer<typeof receptionEvidenceSchema>;
