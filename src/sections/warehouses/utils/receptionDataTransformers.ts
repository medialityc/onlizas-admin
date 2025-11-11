import { WarehouseTransfer } from '@/types/warehouses-transfers';
import { CreateTransferReceptionFormData } from '@/sections/warehouses/schemas/transfer-reception-schema';

/**
 * Genera un GUID simple para productos inesperados
 */
export const generateGuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Transforma los datos del formulario al formato esperado por el backend
 */
export const transformFormDataToPayload = (
  formData: CreateTransferReceptionFormData, 
  transfer: WarehouseTransfer
) => {
  return {
    transferId: formData.transferId,
    receivingWarehouseId: transfer.destinationId,
    notes: formData.notes || "",
    items: [
      // Items esperados
      ...formData.items.map((item) => ({
        transferItemId: item.transferItemId,
        productVariantId: item.productVariantId,
        quantityReceived: item.quantityReceived,
        unit: item.unit,
        receivedBatch: item.receivedBatch || null,
        receivedExpiryDate: item.receivedExpiryDate || null,
        discrepancyType: item.discrepancyType || null,
        discrepancyNotes: item.discrepancyNotes || null,
        isAccepted: item.isAccepted ?? true,
      })),
      // Productos inesperados con GUID generado
      ...(formData.unexpectedProducts || []).map((product) => ({
        transferItemId: generateGuid(),
        productVariantId: generateGuid(),
        quantityReceived: product.quantity,
        unit: product.unit,
        receivedBatch: product.batchNumber || null,
        receivedExpiryDate: null,
        discrepancyType: "unexpected_product" as any,
        discrepancyNotes: `Producto no esperado: ${product.productName}. ${product.observations || ""}`,
        isAccepted: true,
      }))
    ]
  };
};

/**
 * Extrae y normaliza los datos de respuesta del backend
 */
export const normalizeReceptionResponse = (response: any) => {
  const responseData = response.data as any;
  const reception = responseData?.reception || responseData;
  
  const receptionId = reception?.id || responseData?.id;
  if (!receptionId) {
    throw new Error('No se pudo obtener el ID de la recepción');
  }
  
  return {
    id: receptionId,
    transferId: reception?.transferId || responseData?.transferId,
    status: reception?.status || responseData?.status,
    hasDiscrepancies: reception?.hasDiscrepancies || responseData?.hasDiscrepancies,
    items: reception?.items || responseData?.items || [],
    comments: reception?.comments || responseData?.comments || [],
    receivedAt: reception?.receivedAt || responseData?.receivedAt,
    notes: reception?.notes || responseData?.notes,
    ...reception,
    ...responseData
  };
};

/**
 * Construye el payload para reportar múltiples discrepancias
 */
export const buildDiscrepancyReportPayload = (items: any[]) => {
  const discrepancyItems = items.filter(item => 
    item.discrepancyType && item.discrepancyType !== null
  );
  
  if (discrepancyItems.length === 0) {
    return null;
  }

  return {
    discrepancyDescription: "Discrepancias detectadas durante la recepción",
    evidenceUrls: [],
    items: discrepancyItems.map(item => ({
      transferReceptionItemId: item.transferItemId,
      discrepancyType: item.discrepancyType,
      discrepancyNotes: item.discrepancyNotes || `Discrepancia detectada: ${item.discrepancyType}`,
      isAccepted: item.isAccepted ?? false
    }))
  };
};