"use client";

import { WarehouseTransfer } from "@/types/warehouses-transfers";
import { useFormContext } from "react-hook-form";
import { CreateTransferReceptionFormData } from "@/sections/warehouses/schemas/transfer-reception-schema";
import { useState, useEffect } from "react";
import showToast from "@/config/toast/toastConfig";
import { addReceptionComment, resolveDiscrepancy } from "@/services/warehouse-transfer-receptions";

// Componentes UI optimizados
import { DiscrepancyList } from "./ui/discrepancy-list";
import { CommentSection } from "./ui/comment-section";

interface Props {
  transfer: WarehouseTransfer;
  receptionId?: string;
  receptionData?: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  resolvedDiscrepancies: Record<string, { resolution: string; resolvedAt: string; quantityAccepted: number }>;
  permanentlyResolvedDiscrepancies: Set<string>;
  setResolvedDiscrepancies: React.Dispatch<React.SetStateAction<Record<string, { resolution: string; resolvedAt: string; quantityAccepted: number }>>>;
  setPermanentlyResolvedDiscrepancies: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export default function IncidentsManagementTab({
  transfer,
  receptionId,
  receptionData,
  setData,
  resolvedDiscrepancies,
  permanentlyResolvedDiscrepancies,
  setResolvedDiscrepancies,
  setPermanentlyResolvedDiscrepancies,
}: Props) {
  const { watch, setValue } = useFormContext<CreateTransferReceptionFormData>();
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<string | null>(null);
  const [discrepancies, setDiscrepancies] = useState<any[]>([]);
  const [isResolvingAll, setIsResolvingAll] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);

  console.log(transfer)
  console.log(receptionData)
  console.log(receptionId)
  console.log(discrepancies)


  const formItems = watch("items") || [];
  const newComment = watch("newComment") || "";
  const resolutionNote = watch("resolutionNote") || "";

  // Inicializar discrepancias basado en formItems
  useEffect(() => {
    const generatedDiscrepancies = formItems
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

    setDiscrepancies(generatedDiscrepancies);
  }, [formItems, transfer.items, resolvedDiscrepancies, permanentlyResolvedDiscrepancies]);

  // Inicializar comentarios desde receptionData
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
      // Llamar al endpoint real
      const response = await addReceptionComment(
        receptionId,
        newComment.trim(),
        "general"
      );

      if (response.error) {
        console.error("❌ [COMMENT ERROR] Error en la respuesta:", response.error);
        showToast("Error al enviar el comentario", "error");
        return;
      }

      // Agregar el comentario al estado local para mostrarlo inmediatamente
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
      console.error("💥 [COMMENT EXCEPTION] Error inesperado:", error);
      showToast("Error al enviar el comentario", "error");
    } finally {
      setIsSendingComment(false);
    }
  };

  // Manejar resolución de discrepancia individual
  const handleResolveDiscrepancy = async (discrepancyId: string) => {
    if (!resolutionNote.trim()) {
      showToast("Debe agregar una nota de resolución", "error");
      return;
    }

    const formItem = formItems.find(item => item.transferItemId === discrepancyId);
    const finalQuantityAccepted = formItem?.quantityReceived || 0;

    setResolvedDiscrepancies(prev => ({
      ...prev,
      [discrepancyId]: {
        resolution: resolutionNote.trim(),
        resolvedAt: new Date().toISOString(),
        quantityAccepted: finalQuantityAccepted
      }
    }));

    setSelectedDiscrepancy(null);
    setValue("resolutionNote", "");
    showToast("Discrepancia marcada como resuelta", "success");
  };

  // Manejar cancelación de resolución
  const handleCancelResolution = () => {
    setSelectedDiscrepancy(null);
    setValue("resolutionNote", "");
  };

  // Manejar resolución de todas las discrepancias
  const handleResolveAllDiscrepancies = async () => {
    if (!receptionData?.id) {
      console.error("❌ [RESOLVE ALL ERROR] No hay ID de recepción");
      return;
    }

    try {
      setIsResolvingAll(true);

      // Construir payload con todas las discrepancias resueltas
      const itemsToAccept = Object.entries(resolvedDiscrepancies).map(([discrepancyId, resolutionData]) => {
        // Debug: Log para ver qué datos tenemos
        console.log("🔍 [DEBUG] Buscando discrepancyId:", discrepancyId);
        console.log("🔍 [DEBUG] receptionData.items:", receptionData.items);
        
        // Buscar el transferReceptionItemId correcto en receptionData.items
        const receptionItem = receptionData.items?.find((it: any) => {
          console.log("🔍 [DEBUG] Comparando con item:", it.transferItemId, "===", discrepancyId);
          return it.transferItemId === discrepancyId;
        });
        
        if (!receptionItem) {
          console.error("❌ [RESOLVE ERROR] No se encontró el item de recepción para:", discrepancyId);
          console.error("❌ [RESOLVE ERROR] Items disponibles:", receptionData.items?.map((it: any) => ({
            id: it.id,
            transferItemId: it.transferItemId,
            productName: it.productName
          })));
          
          // En lugar de lanzar error, intentar buscar de manera alternativa
          const alternativeItem = receptionData.items?.find((it: any) => 
            it.id === discrepancyId || it.productId === discrepancyId
          );
          
          if (!alternativeItem) {
            throw new Error(`No se encontró el item de recepción para ${discrepancyId}. Items disponibles: ${receptionData.items?.map((it: any) => it.transferItemId).join(', ')}`);
          }
          
          console.log("✅ [RESOLVE INFO] Encontrado item alternativo:", alternativeItem);
          return {
            transferReceptionItemId: alternativeItem.id,
            finalQuantityAccepted: resolutionData.quantityAccepted,
            adjustmentNotes: resolutionData.resolution,
          };
        }

        console.log("✅ [RESOLVE INFO] Item encontrado correctamente:", receptionItem);
        return {
          transferReceptionItemId: receptionItem.id,
          finalQuantityAccepted: resolutionData.quantityAccepted,
          adjustmentNotes: resolutionData.resolution,
        };
      });

      const resolveData = {
        resolutionDescription: "Todas las discrepancias han sido resueltas",
        resolutionType: 2, // Resolución mixta
        itemsToReturn: itemsToAccept.map(item => item.transferReceptionItemId), // Enviar los IDs de los items aceptados
        itemsToAccept: itemsToAccept
      };

      // Llamar al endpoint real con todas las discrepancias
      const response = await resolveDiscrepancy(receptionData.id, resolveData);

      if (response.error) {
        console.error("❌ [RESOLVE ALL ERROR] Error al resolver todas las discrepancias:", response.error);
        showToast("Error al resolver las discrepancias", "error");
        return;
      }

      // Limpiar el estado de discrepancias resueltas temporales y marcar como permanentemente resueltas
      const resolvedIds = Object.keys(resolvedDiscrepancies);
      setPermanentlyResolvedDiscrepancies(prev => new Set([...Array.from(prev), ...resolvedIds]));
      setResolvedDiscrepancies({});

      showToast("Todas las discrepancias han sido resueltas exitosamente", "success");

    } catch (error) {
      console.error("💥 [RESOLVE ALL EXCEPTION] Error inesperado:", error);
      showToast("Error al resolver las discrepancias", "error");
    } finally {
      setIsResolvingAll(false);
    }
  };

  // Auto-resolver cuando todas las discrepancias estén marcadas
  useEffect(() => {
    const totalDiscrepancies = discrepancies.length;
    const resolvedCount = Object.keys(resolvedDiscrepancies).length;
    const permanentlyResolvedCount = permanentlyResolvedDiscrepancies.size;
    const totalResolved = resolvedCount + permanentlyResolvedCount;

    if (totalDiscrepancies > 0 && totalResolved === totalDiscrepancies && resolvedCount > 0 && !isResolvingAll) {
      handleResolveAllDiscrepancies();
    }
  }, [discrepancies.length, resolvedDiscrepancies, permanentlyResolvedDiscrepancies, isResolvingAll]);

  return (
    <div className="space-y-6">
      {/* Lista de discrepancias */}
      {discrepancies.length > 0 && (
        <DiscrepancyList
          discrepancies={discrepancies}
          resolvedDiscrepancies={resolvedDiscrepancies}
          permanentlyResolvedDiscrepancies={permanentlyResolvedDiscrepancies}
          onSelectForResolution={setSelectedDiscrepancy}
          selectedDiscrepancy={selectedDiscrepancy}
          onResolveDiscrepancy={handleResolveDiscrepancy}
          onCancelResolution={handleCancelResolution}
          isResolvingAll={isResolvingAll}
        />
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