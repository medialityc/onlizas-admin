import { PaginatedResponse } from "./common";

// Estados de recepción de transferencia
export type TransferReceptionStatus = 
  | "pending"           // Pendiente de recepción
  | "in_progress"       // En proceso de recepción
  | "completed"         // Recepción completa
  | "with_discrepancies" // Con incidencias/discrepancias
  | "resolved"          // Discrepancias resueltas
  | "cancelled";        // Recepción cancelada

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
export interface ReceptionItem {
  id: number;
  transferItemId: number;
  productVariantId: number;
  productVariantName: string;
  expectedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unit: string;
  batchNumber?: string;
  expirationDate?: string;
  notes?: string;
  hasDiscrepancy: boolean;
  discrepancies?: Discrepancy[];
}

// Discrepancia específica
export interface Discrepancy {
  id: number;
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
export interface ReceptionComment {
  id: number;
  message: string;
  author: string;
  authorRole: string;
  createdAt: string;
  attachments?: string[];
}

// Recepción principal
export interface TransferReception {
  id: number;
  transferId: number;
  transferNumber: string;
  destinationWarehouseId: number;
  destinationWarehouseName: string;
  originWarehouseId: number;
  originWarehouseName: string;
  supplierId: number;
  supplierName: string;
  status: TransferReceptionStatus;
  receivedBy?: string;
  receivedAt?: string;
  completedAt?: string;
  items: ReceptionItem[];
  totalExpectedItems: number;
  totalReceivedItems: number;
  totalAcceptedItems: number;
  totalRejectedItems: number;
  hasDiscrepancies: boolean;
  discrepanciesCount: number;
  comments: ReceptionComment[];
  documents: ReceptionDocument[];
  createdAt: string;
  updatedAt: string;
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

// Datos para crear/actualizar recepción
export interface CreateReceptionData {
  transferId: number;
  items: {
    transferItemId: number;
    receivedQuantity: number;
    acceptedQuantity: number;
    rejectedQuantity: number;
    batchNumber?: string;
    expirationDate?: string;
    notes?: string;
  }[];
  notes?: string;
  status: TransferReceptionStatus;
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