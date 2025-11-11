import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { WarehouseTransfer } from "@/types/warehouses-transfers";
import { CreateTransferReceptionFormData } from "@/sections/warehouses/schemas/transfer-reception-schema";
import showToast from "@/config/toast/toastConfig";

export function useProductReception(
  transfer: WarehouseTransfer,
  items: any[],
  canCompleteReception?: () => boolean
) {
  const [discrepancies, setDiscrepancies] = useState<Set<string>>(new Set());
  const [showUnexpectedForm, setShowUnexpectedForm] = useState(false);
  const { setValue } = useFormContext<CreateTransferReceptionFormData>();

  // Validación de finalización
  const validateCompletion = canCompleteReception || (() => {
    return transfer.items?.every((transferItem, index) => {
      const item = items[index];
      const quantityReceived = item?.quantityReceived || 0;
      const quantityRequested = transferItem.quantityRequested;
      
      if (quantityReceived < quantityRequested) {
        return discrepancies.has(transferItem.id.toString());
      }
      
      return true;
    }) ?? true;
  });

  // Toggle de discrepancia
  const toggleDiscrepancy = (index: number) => {
    const newDiscrepancies = new Set(discrepancies);
    const itemId = transfer.items[index].id.toString();
    
    if (newDiscrepancies.has(itemId)) {
      newDiscrepancies.delete(itemId);
      setValue(`items.${index}.discrepancyType`, null);
      setValue(`items.${index}.discrepancyNotes`, "");
      setValue(`items.${index}.isAccepted`, true);
    } else {
      newDiscrepancies.add(itemId);
      setValue(`items.${index}.discrepancyType`, "missing_quantity");
      setValue(`items.${index}.discrepancyNotes`, "");
      setValue(`items.${index}.isAccepted`, false);
    }
    setDiscrepancies(newDiscrepancies);
  };

  // Actualizar cantidad
  const updateQuantity = (index: number, value: number) => {
    setValue(`items.${index}.quantityReceived`, value);
    
    // Auto-sugerir discrepancia si la cantidad es menor
    const transferItem = transfer.items[index];
    if (value < transferItem.quantityRequested && !discrepancies.has(transferItem.id.toString())) {
      showToast("La cantidad recibida es menor a la esperada. Considere marcar una discrepancia.", "warning");
    }
  };

  return {
    discrepancies,
    showUnexpectedForm,
    setShowUnexpectedForm,
    validateCompletion,
    toggleDiscrepancy,
    updateQuantity,
  };
}