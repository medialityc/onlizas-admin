import { WarehouseTransfer } from '@/types/warehouses-transfers';

export interface DiscrepancyResolution {
  resolution: string;
  resolvedAt: string;
  quantityAccepted: number;
}

/**
 * Construye el payload para resolver todas las discrepancias
 */
export const buildResolveAllDiscrepanciesPayload = (
  resolvedDiscrepancies: Record<string, DiscrepancyResolution>,
  receptionData: any
) => {
  const itemsToAccept = Object.entries(resolvedDiscrepancies).map(([discrepancyId, resolutionData]) => {
    const receptionItem = receptionData.items?.find((it: any) => it.transferItemId === discrepancyId);
    
    if (!receptionItem) {
      throw new Error(`No se encontró el item de recepción para transferItemId: ${discrepancyId}`);
    }

    return {
      transferReceptionItemId: receptionItem.id,
      finalQuantityAccepted: resolutionData.quantityAccepted,
      adjustmentNotes: resolutionData.resolution,
    };
  });

  return {
    resolutionDescription: "Todas las discrepancias han sido resueltas",
    resolutionType: 2,
    itemsToReturn: itemsToAccept.map(item => item.transferReceptionItemId),
    itemsToAccept: itemsToAccept
  };
};

/**
 * Genera discrepancias desde los items del formulario
 */
export const generateDiscrepanciesFromFormItems = (
  formItems: any[],
  transfer: WarehouseTransfer,
  resolvedDiscrepancies: Record<string, DiscrepancyResolution>,
  permanentlyResolvedDiscrepancies: Set<string>
) => {
  if (!Array.isArray(formItems)) {
    return [];
  }

  return formItems
    .filter((itm) => !!itm.discrepancyType)
    .map((itm) => {
      const transferItem = transfer.items?.find(ti => ti.id === itm.transferItemId);
      const resolvedInfo = resolvedDiscrepancies[itm.transferItemId];
      const isPermanentlyResolved = permanentlyResolvedDiscrepancies.has(itm.transferItemId);
      
      return {
        id: itm.transferItemId,
        productId: itm.transferItemId,
        productName: transferItem?.productVariantName || "Producto desconocido",
        type: itm.discrepancyType || "",
        status: (resolvedInfo || isPermanentlyResolved) ? "resolved" as const : "pending" as const,
        description: itm.discrepancyNotes || "",
        resolution: resolvedInfo?.resolution,
        createdAt: new Date().toISOString(),
      };
    });
};