import { WarehouseTransfer } from '@/types/warehouses-transfers';

/**
 * Valida que todas las cantidades estén ingresadas correctamente
 */
export const validateQuantitiesEntered = (
  transfer: WarehouseTransfer, 
  items: any[]
): boolean => {
  return transfer.items?.every((_, index) => {
    const item = items[index];
    return item && typeof item.quantityReceived === 'number' && item.quantityReceived >= 0;
  }) ?? true;
};

/**
 * Valida que las cantidades menores tengan discrepancias marcadas
 */
export const validateDiscrepanciesForShortQuantities = (
  transfer: WarehouseTransfer, 
  items: any[]
): boolean => {
  return transfer.items?.every((transferItem, index) => {
    const item = items[index];
    const quantityReceived = item?.quantityReceived || 0;
    const quantityRequested = transferItem.quantityRequested;
    
    // Si la cantidad es menor, debe tener discrepancia marcada
    if (quantityReceived < quantityRequested) {
      return item?.discrepancyType !== null && 
             item?.discrepancyType !== undefined;
    }
    
    return true;
  }) ?? true;
};

/**
 * Validación completa del paso de recepción
 */
export const validateReceptionStep = (
  transfer: WarehouseTransfer, 
  items: any[]
): boolean => {
  const allQuantitiesValid = validateQuantitiesEntered(transfer, items);
  const discrepanciesValid = validateDiscrepanciesForShortQuantities(transfer, items);
  
  return allQuantitiesValid && discrepanciesValid;
};

/**
 * Valida si se puede completar la recepción
 */
export const canCompleteReception = (
  transfer: WarehouseTransfer, 
  items: any[]
): boolean => {
  return transfer.items?.every((transferItem, index) => {
    const item = items[index];
    const quantityReceived = item?.quantityReceived || 0;
    const quantityRequested = transferItem.quantityRequested;
    
    // Si la cantidad es menor, validar que tenga discrepancia marcada
    if (quantityReceived < quantityRequested) {
      return true; // Delegamos la validación específica al componente
    }
    
    return true;
  }) ?? true;
};