import { PaginatedResponse } from "./common";

// Estados de recepción de transferencia
export type TransferReceptionStatus = 
  | "PENDING"           // Pendiente de recepción
  | "RECEIVED"         // Recepción completa
  | "WITH_DISCREPANCY" // Con incidencias/discrepancias
  | "DISCREPANCY_RESOLVED"  // Discrepancias resueltas

// Tipos de discrepancias
export type DiscrepancyType = 
  | "missing_quantity"   // Faltantes
  | "excess_quantity"    // Sobrantes
  | "wrong_product"      // Producto incorrecto
  | "wrong_batch"        // Lote incorrecto
  | "damaged_product"    // Producto dañado
  | "expired_product"    // Producto vencido
  | "other";             // Otros

// Item de recepción
export interface TransferReceptionItem {
  id: string;
  transferReceptionId: string;
  transferItemId: string;
  productVariantId: string;
  productVariantName: string;
  productName: string;
  quantityExpected: number;
  quantityReceived: number;
  unit: string;
  expectedBatch: string;
  receivedBatch: string;
  expectedExpiryDate: string;
  receivedExpiryDate: string;
  discrepancyType: string;
  discrepancyNotes: string;
  isAccepted: boolean;
  createdInventoryId: string;
  hasDiscrepancy?: boolean;
  discrepancies?: Discrepancy[];
}

// Discrepancia específica
export interface Discrepancy {
  id: string;
  type: DiscrepancyType;
  description: string;
  quantity?: number;
  evidence?: string[]; // URLs de fotos/documentos
  reportedBy: string;
  reportedAt: string;
  status: "reported" | "acknowledged" | "resolved" | "rejected";
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

// Comentario en la recepción
export interface TransferReceptionComment {
  id: string;
  transferReceptionId: string;
  authorId: string;
  authorName: string;
  comment: string;
  type: string;
  parentCommentId: string;
  attachmentUrls: string[];
  createdDatetime: string;
  active: boolean;
  replies: string[];
}

// Recepción principal
export interface TransferReception {
  id: string;
  transferId: string;
  transferNumber: string;
  receivingWarehouseId: string;
  receivingWarehouseName: string;
  receivedById: string;
  receivedByName: string;
  receivedAt: string;
  status: TransferReceptionStatus;
  notes: string;
  evidenceUrls: string[];
  discrepancyDescription: string;
  isDiscrepancyResolved: boolean;
  discrepancyResolvedAt: string;
  discrepancyResolvedById: string;
  discrepancyResolvedByName: string;
  resolutionDescription: string;
  createdDatetime: string;
  updatedDatetime: string;
  active: boolean;
  items: TransferReceptionItem[];
  comments: TransferReceptionComment[];
  documents: ReceptionDocument[];
  // Campos adicionales útiles del modelo anterior
  totalExpectedItems?: number;
  totalReceivedItems?: number;
  totalAcceptedItems?: number;
  totalRejectedItems?: number;
  hasDiscrepancies?: boolean;
  discrepanciesCount?: number;
}

// Documento de recepción
export interface ReceptionDocument {
  id: number;
  name: string;
  url: string;
  type: "receipt" | "evidence" | "discrepancy_report" | "resolution_document" | "other";
  uploadedBy: string;
  uploadedAt: string;
  size?: number;
  mimeType?: string;
}

// Respuesta paginada de recepciones
export type GetAllTransferReceptions = PaginatedResponse<TransferReception>;

// Filtros para recepciones
export interface TransferReceptionFilter {
  status?: TransferReceptionStatus;
  warehouseId?: number;
  supplierId?: number;
  hasDiscrepancies?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Form data para la recepción
export interface ReceptionFormItem {
  transferItemId: string;
  productVariantId: string;
  quantityReceived: number;
  unit: string;
  receivedBatch?: string | null;
  receivedExpiryDate?: string | null;
  discrepancyType?: DiscrepancyType | null;
  discrepancyNotes?: string | null;
  isAccepted?: boolean;
}

export interface UnexpectedProductFormData {
  productName: string;
  quantity: number;
  unit: string;
  batchNumber?: string;
  observations?: string;
}

// Datos para crear/actualizar recepción
export interface CreateReceptionData {
  transferId: string;
  receivingWarehouseId: string;
  notes?: string;
  items: ReceptionFormItem[];
}

// Datos para reportar discrepancia
export interface ReportDiscrepancyData {
  receptionId: number;
  itemId: number;
  type: DiscrepancyType;
  description: string;
  quantity?: number;
  evidence?: File[];
}

// Datos para resolver discrepancia
export interface ResolveDiscrepancyData {
  discrepancyId: number;
  resolution: string;
  action: "accept" | "return" | "adjust" | "compensate";
  newInventoryData?: {
    quantity: number;
    location?: string;
    notes?: string;
  };
}

// Log de recepción
export interface ReceptionLog {
  id: number;
  receptionId: number;
  action: string;
  description: string;
  performedBy: string;
  performedAt: string;
  metadata?: Record<string, any>;
}

// Respuesta de logs
export type GetReceptionLogs = PaginatedResponse<ReceptionLog>;

// Inventario nuevo creado
export interface NewInventoryFromReception {
  id: number;
  receptionId: number;
  productVariantId: number;
  quantity: number;
  supplierId: number;
  warehouseId: number;
  batchNumber?: string;
  expirationDate?: string;
  status: "pending" | "accepted" | "rejected";
  notes?: string;
  createdAt: string;
}