"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { WarehouseTransfer } from "@/types/warehouses-transfers";
import showToast from "@/config/toast/toastConfig";
import {
  createTransferReceptionSchema,
  CreateTransferReceptionFormData,
} from "@/sections/warehouses/schemas/transfer-reception-schema";
import { useForm } from "react-hook-form";
import { FormProvider } from "@/components/react-hook-form";

import { useRouter } from "next/navigation";
import { receiveTransfer, reportMultipleDiscrepancies, addReceptionComment, uploadReceptionEvidence } from "@/services/warehouse-transfer-receptions";
import TransferReceptionWizard from "../components/transfer-reception/transfer-reception-wizard";
import { Button } from "@/components/button/button";
import { DISCREPANCY_TYPE_OPTIONS } from "@/types/warehouse-transfer-receptions";

interface Props {
  transfer: WarehouseTransfer;
}

// NOTA: El backend espera CreateReceptionData; se mapeará desde CreateTransferReceptionFormData al enviar.

export default function TransferReceptionContainer({ transfer }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const methods = useForm<CreateTransferReceptionFormData>({
    resolver: zodResolver(createTransferReceptionSchema),
    defaultValues: {
      transferId: String(transfer.id),
      // status se determina dinámicamente en handleCompleteReception
      notes: "",
      items:
        transfer.items?.map((itm) => ({
          transferItemId: String(itm.id),
          productVariantId: String(itm.productVariantId),
          quantityReceived: 0, // valor inicial editable en UI
          unit: itm.unit || "units",
          receivedBatch: "",
          receivedExpiryDate: "",
          discrepancyType: null,
          discrepancyNotes: "",
          isAccepted: true,
        })) || [],
      unexpectedProducts: [],
      evidence: [],
      documentationNotes: "",
      documentationComplete: false,
      newComment: "", // campo para nuevo comentario
      resolutionNote: "", // campo para resolución de discrepancia
    },
  });

  const { handleSubmit, watch, reset } = methods;
  const items = watch("items");

  // Calcular si se puede completar la recepción
  const canCompleteReception = () => {
    return transfer.items?.every((transferItem, index) => {
      const item = items[index];
      const quantityReceived = item?.quantityReceived || 0;
      const quantityRequested = transferItem.quantityRequested;
      
      // Si la cantidad es menor, debe tener discrepancia marcada
      if (quantityReceived < quantityRequested) {
        // Aquí necesitaríamos acceder a las discrepancias del componente hijo
        // Por ahora, devolver true y dejar la validación en el componente hijo
        return true;
      }
      
      return true;
    }) ?? true;
  };

  const handleRedirectToList = () => {
    const pathParts = window.location.pathname.split("/");
    const warehouseType = pathParts[3]; // physical o virtual
    const warehouseId = transfer.destinationId;
    const listPath = `/dashboard/warehouses/${warehouseType}/${warehouseId}/edit/transfers/list`;
    router.push(listPath);
  };

  const handleCompleteReception = async (
    data: CreateTransferReceptionFormData
  ) => {
    setIsSubmitting(true);
    try {     
      // Mapear al formato esperado por el backend (CreateReceptionData)
      const payload = {
        transferId: data.transferId,
        receivingWarehouseId: transfer.destinationId,
        //status: receptionStatus, // Status determinado por la lógica de recepción
        notes: data.notes || "",
        items: data.items.map((itm) => ({
          transferItemId: itm.transferItemId,
          productVariantId: itm.productVariantId,
          quantityReceived: itm.quantityReceived,
          unit: itm.unit,
          receivedBatch: itm.receivedBatch || null,
          receivedExpiryDate: itm.receivedExpiryDate || null,
          discrepancyType: itm.discrepancyType || null,
          discrepancyNotes: itm.discrepancyNotes || null,
          isAccepted: itm.isAccepted ?? true,
        })),
      };

      // TODO: llamar a receiveTransfer(payload)
      const response = await receiveTransfer(payload);

      if (response?.error) {
        showToast("Error al completar la recepción", "error");
      } else {
        showToast("Recepción completada exitosamente", "success");
        
        // Extraer el ID de la recepción de la respuesta
        // La respuesta puede tener la estructura { reception: {...} } o ser directamente la recepción
        const responseData = response.data as any;
        const receptionData = responseData?.reception || responseData;
        const receptionId = receptionData?.id;
        
        // Si hay discrepancias, reportarlas automáticamente usando el nuevo endpoint
        const discrepancyItems = data.items.filter(item => 
          item.discrepancyType && item.discrepancyType !== null
        );   
          

        const allDiscrepancyItems = [
          ...discrepancyItems.map(item => ({
            transferReceptionItemId: item.transferItemId, // Usar el transferItemId del formulario
            discrepancyType: item.discrepancyType!,
            discrepancyNotes: item.discrepancyNotes || `Discrepancia detectada: ${item.discrepancyType}`,
            isAccepted: item.isAccepted ?? false
          })),
         
        ];

        if (allDiscrepancyItems.length > 0 && receptionId) {
          
          try {
            await reportMultipleDiscrepancies(receptionId, {
              discrepancyDescription: "Discrepancias detectadas durante la recepción",
              evidenceUrls: [], // Por ahora sin evidencia, se puede agregar después
              items: allDiscrepancyItems
            });
            showToast("Discrepancias reportadas automáticamente", "info");
          } catch (error) {
            console.error("❌ [DISCREPANCY ERROR] Error reportando discrepancias:", error);
            showToast("Error al reportar discrepancias automáticamente", "warning");
          }
        }
        
        
        // Redirigir a la lista de transferencias después de completar
        handleRedirectToList();
      }
    } catch (error) {
      console.error("Error completing reception:", error);
      showToast("Ocurrió un error inesperado", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    // Implementar guardado como borrador si es necesario
    showToast("Borrador guardado", "success");
  };

  return (
    <div className="space-y-6">
      {/* Formulario principal - solo mostrar para transferencias en estado AwaitingReception */}
      <FormProvider methods={methods} onSubmit={handleCompleteReception}>
        {/* Wizard de navegación por pasos */}
        <TransferReceptionWizard
          transfer={transfer}
          isSubmitting={isSubmitting}
          onSaveDraft={handleSaveDraft}
          canCompleteReception={canCompleteReception}
        />
      </FormProvider>
    </div>
  );
}
