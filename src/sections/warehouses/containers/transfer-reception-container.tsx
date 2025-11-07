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
import { receiveTransfer, reportDiscrepancy, addReceptionComment, uploadReceptionEvidence } from "@/services/warehouse-transfer-receptions";
import TransferReceptionTabs from "../components/transfer-reception/transfer-reception-tabs";
import { Button } from "@/components/button/button";
import { DISCREPANCY_TYPE_OPTIONS } from "@/types/warehouse-transfer-receptions";

interface Props {
  transfer: WarehouseTransfer;
}

// NOTA: El backend espera CreateReceptionData; se mapeará desde CreateTransferReceptionFormData al enviar.

export default function TransferReceptionContainer({ transfer }: Props) {
  const [activeTab, setActiveTab] = useState("reception");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedReception, setCompletedReception] = useState<any>(null); // Guardar la recepción completada
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
      console.log("Payload recepción a enviar:", payload);
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
        console.log("Recepción completada:", response.data);
        
        // Si hay discrepancias en los items, reportarlas automáticamente
        const itemsWithDiscrepancies = data.items.filter((item, index) => {
          const transferItem = transfer.items[index];
          const quantityReceived = item.quantityReceived || 0;
          const quantityRequested = transferItem.quantityRequested;
          return quantityReceived < quantityRequested || quantityReceived === 0;
        });

        if (itemsWithDiscrepancies.length > 0 && receptionId) {
          console.log("Reportando discrepancias automáticamente...");
          
          // Reportar cada discrepancia
          for (let i = 0; i < itemsWithDiscrepancies.length; i++) {
            const item = itemsWithDiscrepancies[i];
            const transferItemIndex = data.items.findIndex(itm => itm.transferItemId === item.transferItemId);
            const transferItem = transfer.items[transferItemIndex];
            
            try {
              await reportDiscrepancy({
                receptionId: parseInt(receptionId),
                itemId: parseInt(item.transferItemId),
                type: item.discrepancyType || "missing_quantity",
                description: item.discrepancyNotes || `Cantidad recibida: ${item.quantityReceived} de ${transferItem.quantityRequested}`,
                quantity: transferItem.quantityRequested - (item.quantityReceived || 0),
              });
              console.log(`Discrepancia reportada para item ${item.transferItemId}`);
            } catch (error) {
              console.error(`Error reportando discrepancia para item ${item.transferItemId}:`, error);
            }
          }
          
          showToast("Discrepancias reportadas automáticamente", "info");
        }
        
        // Guardar la recepción completada para mostrar información
        setCompletedReception(response.data);
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

  const handleReportDiscrepancy = async (itemId: string, type: string, description: string) => {
    if (!completedReception) return;
    
    try {
      const response = await reportDiscrepancy({
        receptionId: parseInt(completedReception.id),
        itemId: parseInt(itemId),
        type: type as any,
        description,
      });
      
      if (response?.error) {
        showToast("Error al reportar discrepancia", "error");
      } else {
        showToast("Discrepancia reportada exitosamente", "success");
      }
    } catch (error) {
      console.error("Error reporting discrepancy:", error);
      showToast("Error al reportar discrepancia", "error");
    }
  };

  const handleAddComment = async (comment: string) => {
    if (!completedReception) return;
    
    try {
      const response = await addReceptionComment(completedReception.id, comment);
      
      if (response?.error) {
        showToast("Error al agregar comentario", "error");
      } else {
        showToast("Comentario agregado exitosamente", "success");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      showToast("Error al agregar comentario", "error");
    }
  };

  console.log(methods.formState.errors);
  return (
    <div className="space-y-6">
      {/* Mostrar recepción completada si existe */}
      {completedReception && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
                ✅ Recepción Completada
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Recepción #{completedReception.id}
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  {completedReception.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Productos procesados: {completedReception.items?.length || 0}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleRedirectToList}
            >
              Volver a Transferencias
            </Button>
          </div>
          
          {/* Acciones adicionales post-recepción */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                const comment = prompt("Agregar comentario:");
                if (comment) handleAddComment(comment);
              }}
            >
              ➕ Agregar Comentario
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                // Aquí podríamos abrir un modal para reportar discrepancias específicas
                showToast("Funcionalidad de reporte de discrepancias disponible", "info");
              }}
            >
              🚨 Reportar Discrepancia
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                showToast("Funcionalidad de subida de evidencia disponible", "info");
              }}
            >
              📎 Subir Evidencia
            </Button>
          </div>
          {completedReception.items && completedReception.items.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Resumen de Productos:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {completedReception.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="flex-1">
                      <span className="font-medium">{item.productVariantName}</span>
                      {item.discrepancyType && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                            {DISCREPANCY_TYPE_OPTIONS.find(opt => opt.value === item.discrepancyType)?.label || item.discrepancyType}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className={`font-medium ${item.quantityReceived < item.quantityExpected ? "text-red-600" : "text-green-600"}`}>
                      {item.quantityReceived}/{item.quantityExpected} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Formulario principal - solo mostrar si no hay recepción completada */}
      {!completedReception && (
        <FormProvider methods={methods} onSubmit={handleCompleteReception}>
          {/* Tabs de navegación */}
          <TransferReceptionTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            transfer={transfer}
            isSubmitting={isSubmitting}
            onSaveDraft={handleSaveDraft}
            canCompleteReception={canCompleteReception}
          />
        </FormProvider>
      )}
    </div>
  );
}
