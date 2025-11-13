"use client";

import { WarehouseTransfer } from "@/types/warehouses-transfers";
import { useFormContext } from "react-hook-form";
import { CreateTransferReceptionFormData } from "@/sections/warehouses/schemas/transfer-reception-schema";
import { useState, useEffect } from "react";
import showToast from "@/config/toast/toastConfig";
import { addReceptionComment, resolveTransferReception } from "@/services/warehouse-transfer-receptions";

// Componentes UI optimizados
import { DiscrepancyList } from "./ui/discrepancy-list";
import { CommentSection } from "./ui/comment-section";

interface Props {
  transfer: WarehouseTransfer;
  receptionId?: string;
  receptionData?: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  currentWarehouseId: string;
}

export default function IncidentsManagementTab({
  transfer,
  receptionId,
  receptionData,
  setData,
  currentWarehouseId,
}: Props) {
  const { watch, setValue } = useFormContext<CreateTransferReceptionFormData>();
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<string | null>(null);
  const [discrepancies, setDiscrepancies] = useState<any[]>([]);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [isCompletingResolution, setIsCompletingResolution] = useState(false);

  const formItems = watch("items") || [];
  const newComment = watch("newComment") || "";
  const resolutionNote = watch("resolutionNote") || "";

  // Determinar si este almacén puede resolver discrepancias (solo almacén origen)
  const canResolveDiscrepancies = currentWarehouseId === transfer.originId;

  // Determinar si las discrepancias están resueltas a nivel de recepción
  const isDiscrepancyResolved = receptionData?.isDiscrepancyResolved;

  // Inicializar discrepancias basadas únicamente en datos del backend
  useEffect(() => {
        // Determinar si las discrepancias están resueltas a nivel de recepción

    if (receptionData?.items && receptionData.items.length > 0) {
      const generatedDiscrepancies = receptionData.items
        .filter((item: any) => !item.isAccepted || item.discrepancyType || item.discrepancyNotes)
        .map((item: any) => {
          const transferItem = transfer.items?.find(ti => ti.id === item.transferItemId);

          // Separar discrepancyNotes en descripción y resolución si contiene "; "
          let description = "";
          let resolution = "";
          
          if (item.discrepancyNotes) {
            const notesParts = item.discrepancyNotes.split("; ");
            if (notesParts.length > 1) {
              // Tiene descripción y resolución separadas
              description = notesParts[0];
              resolution = notesParts.slice(1).join("; ");
            } else {
              // Solo tiene una parte - si está resuelto, es resolución; si no, es descripción
              if (isDiscrepancyResolved) {
                resolution = item.discrepancyNotes;
              } else {
                description = item.discrepancyNotes;
              }
            }
          }

          return {
            id: item.id,
            transferItemId: item.transferItemId,
            productId: item.productVariantId,
            productName: item.productName || transferItem?.productVariantName || "Producto desconocido",
            type: item.discrepancyType || "No definido",
            status: isDiscrepancyResolved ? "resolved" : "pending",
            description: description,
            resolution: resolution,
            createdAt: receptionData.receivedAt || new Date().toISOString(),
            quantityExpected: item.quantityExpected,
            quantityReceived: item.quantityReceived,
            isAccepted: item.isAccepted,
          };
        });
       
      setDiscrepancies(generatedDiscrepancies);
    } else {
      // Fallback para cuando no hay receptionData (modo creación)
      const generatedDiscrepancies = formItems
        .filter((itm) => !!itm.discrepancyType)
        .map((itm) => {
          const transferItem = transfer.items?.find(ti => ti.id === itm.transferItemId);

          return {
            id: itm.transferItemId,
            productId: itm.transferItemId,
            productName: transferItem?.productName || "Producto desconocido",
            type: itm.discrepancyType || "",
            status: "pending" as const,
            description: itm.discrepancyNotes || "",
            resolution: "",
            createdAt: new Date().toISOString(),
          };
        });

      setDiscrepancies(generatedDiscrepancies);
    }
  }, [receptionData?.isDiscrepancyResolved, receptionData?.items, transfer.items, formItems]);

  const comments = receptionData?.comments || [];

  // Manejar comentarios
  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    if (!receptionId) {
      showToast("No se encontró el ID de la recepción", "error");
      return;
    }

    setIsSendingComment(true);
    try {
      const response = await addReceptionComment(
        receptionId,
        newComment.trim(),
        "general"
      );

      if (response.error) {
        showToast("Error al enviar el comentario", "error");
        return;
      }

      const newCommentObj = {
        id: response.data?.id || Date.now().toString(),
        type: "general" as const,
        message: newComment.trim(),
        author: "Usuario actual",
        createdAt: new Date().toISOString(),
      };

      setData((prev: { comments?: any[] }) => ({
        ...prev,
        comments: [...(prev.comments || []), newCommentObj]
      }));
      setValue("newComment", "");
      showToast("Comentario enviado exitosamente", "success");
    } catch (error) {
      showToast("Error al enviar el comentario", "error");
    } finally {
      setIsSendingComment(false);
    }
  };

  // Solo mostrar funciones de resolución si es almacén origen
  const handleResolveDiscrepancy = canResolveDiscrepancies ? async (discrepancyId: string) => {
    if (!resolutionNote.trim()) {
      showToast("Debe agregar una nota de resolución", "error");
      return;
    }

    // Actualizar el estado de la discrepancia específica para mostrarla como resuelta
    setDiscrepancies(prev => prev.map(disc =>
      disc.id === discrepancyId
        ? { ...disc, status: "resolved" as const, resolution: resolutionNote.trim() }
        : disc
    ));

    setSelectedDiscrepancy(null);
    // Limpiar la nota de resolución después de un pequeño delay para evitar re-renders inmediatos
    setTimeout(() => setValue("resolutionNote", ""), 100);
    showToast("Discrepancia marcada como resuelta", "success");
  } : undefined;

  const handleCancelResolution = canResolveDiscrepancies ? () => {
    setSelectedDiscrepancy(null);
    // Limpiar la nota de resolución después de un pequeño delay para evitar re-renders inmediatos
    setTimeout(() => setValue("resolutionNote", ""), 100);
  } : undefined;

  const handleSelectForResolution = canResolveDiscrepancies ? setSelectedDiscrepancy : undefined;

  // Completar resolución manual de todas las discrepancias
  const handleCompleteResolution = async () => {
    if (!receptionId) {
      showToast("No se encontró el ID de la recepción", "error");
      return;
    }

    if (discrepancies.length === 0) {
      showToast("No hay discrepancias para resolver", "error");
      return;
    }

    setIsCompletingResolution(true);
    try {
      // Preparar datos para resolver la recepción completa
      const resolutionData = {
        resolutionDescription: "Todas las discrepancias han sido resueltas",
        resolutionType: 0,
        itemsToReturn: [],/* discrepancies.map(disc => disc.id), */
        itemsToAccept: discrepancies.map(disc => ({
          transferReceptionItemId: disc.id,
          finalQuantityAccepted: disc.quantityReceived || 0,
          adjustmentNotes: resolutionNote.trim() || "Resuelto"
        }))
      };

      const response = await resolveTransferReception(receptionId, resolutionData);

      if (response.error) {
        showToast("Error al completar la resolución", "error");
        return;
      }

      // Actualizar receptionData para reflejar que todas las discrepancias están resueltas
      setData((prev: any) => ({
        ...prev,
        status: 'RESOLVED',
        isDiscrepancyResolved: true,
        discrepancyResolvedAt: new Date().toISOString()
      }));

      // Limpiar discrepancias ya que están resueltas
      setDiscrepancies([]);

      showToast("Resolución completada exitosamente", "success");
    } catch (error) {
      showToast("Error al completar la resolución", "error");
    } finally {
      setIsCompletingResolution(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Lista de discrepancias */}
      {discrepancies.length > 0 && (
        <DiscrepancyList
          discrepancies={discrepancies}
          resolvedDiscrepancies={{}}
          permanentlyResolvedDiscrepancies={new Set()}
          onSelectForResolution={handleSelectForResolution}
          selectedDiscrepancy={selectedDiscrepancy}
          onResolveDiscrepancy={handleResolveDiscrepancy}
          onCancelResolution={handleCancelResolution}
          isResolvingAll={false}
          canResolve={canResolveDiscrepancies}
        />
      )}

      {/* Botón para completar resolución si hay discrepancias, se puede resolver, TODAS están resueltas individualmente y NO está resuelto a nivel de recepción */}
      {canResolveDiscrepancies && discrepancies.length > 0 && discrepancies.every(disc => disc.status === 'resolved') && !isDiscrepancyResolved && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCompleteResolution}
            disabled={isCompletingResolution}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isCompletingResolution ? "Completando..." : "Completar Resolución"}
          </button>
        </div>
      )}

      {/* Sección de comentarios */}
      <CommentSection
        comments={comments}
        newComment={newComment}
        isSendingComment={isSendingComment}
        onSendComment={handleSendComment}
        receptionId={receptionId}
        isLoadingComments={false}
      />
    </div>
  );
}