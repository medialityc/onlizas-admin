import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { WarehouseTransfer } from '@/types/warehouses-transfers';
import { CreateTransferReceptionFormData } from '@/sections/warehouses/schemas/transfer-reception-schema';
import { receiveTransfer } from '@/services/warehouse-transfer-receptions';
import { transformFormDataToPayload, normalizeReceptionResponse } from '@/sections/warehouses/utils/receptionDataTransformers';
import { ReceptionData } from '@/sections/warehouses/hooks/useReceptionState';
import showToast from '@/config/toast/toastConfig';

export const useReceptionOperations = (
  transfer: WarehouseTransfer,
  isReceiving: boolean,
  receptionData: ReceptionData | null,
  setIsReceiving: (loading: boolean) => void,
  setReceptionData: (data: ReceptionData) => void,
  setIsReceptionCompleted: (completed: boolean) => void
) => {
  const { getValues } = useFormContext<CreateTransferReceptionFormData>();

  const handleReceiveTransfer = useCallback(async () => {
    if (isReceiving || receptionData?.id) {
      return { success: true, skipToNext: true };
    }

    try {
      setIsReceiving(true);
      const formData = getValues();
      const payload = transformFormDataToPayload(formData, transfer);
      
      const response = await receiveTransfer(payload);

      if (response?.error) {
        console.error("❌ [RECEIVE ERROR] Error en la respuesta del receive:", response.error);
        showToast("Error al recibir la transferencia", "error");
        return { success: false };
      }

      const normalizedData = normalizeReceptionResponse(response);
      setReceptionData(normalizedData);
      setIsReceptionCompleted(true);
      showToast("Transferencia recibida exitosamente", "success");

      return { success: true };
    } catch (error) {
      console.error("💥 [RECEIVE EXCEPTION] Error inesperado en receive:", error);
      showToast("Error inesperado al recibir la transferencia", "error");
      return { success: false };
    } finally {
      setIsReceiving(false);
    }
  }, [transfer, getValues, isReceiving, receptionData, setIsReceiving, setReceptionData, setIsReceptionCompleted]);

  return {
    handleReceiveTransfer,
  };
};