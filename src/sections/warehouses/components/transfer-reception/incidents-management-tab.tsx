"use client";

import { Button } from "@/components/button/button";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { WarehouseTransfer } from "@/types/warehouses-transfers";
import { useFormContext } from "react-hook-form";
import { CreateTransferReceptionFormData } from "@/sections/warehouses/schemas/transfer-reception-schema";
import { useState, useEffect } from "react";
import showToast from "@/config/toast/toastConfig";
import { addReceptionComment, resolveDiscrepancy } from "@/services/warehouse-transfer-receptions";
import { DISCREPANCY_TYPE_OPTIONS } from "@/types/warehouse-transfer-receptions";
import { set } from "lodash";


interface Props {
  transfer: WarehouseTransfer;
  receptionId?: string; // ID de la recepción para poder enviar comentarios
  receptionData?: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  resolvedDiscrepancies: Record<string, { resolution: string; resolvedAt: string; quantityAccepted: number }>;
  permanentlyResolvedDiscrepancies: Set<string>;
  setResolvedDiscrepancies: React.Dispatch<React.SetStateAction<Record<string, { resolution: string; resolvedAt: string; quantityAccepted: number }>>>;
  setPermanentlyResolvedDiscrepancies: React.Dispatch<React.SetStateAction<Set<string>>>;
}

interface Comment {
  id: string;
  type: "general" | "discrepancy";
  message: string;
  author: string;
  createdAt: string;
  discrepancyId?: string;
}

interface Discrepancy {
  id: string;
  productId: string;
  productName: string;
  type: string;
  status: "pending" | "resolved";
  description: string;
  resolution?: string;
  createdAt: string;
}

export default function IncidentsManagementTab({ 
  transfer, 
  receptionId, 
  receptionData,
  setData,
  resolvedDiscrepancies,
  permanentlyResolvedDiscrepancies,
  setResolvedDiscrepancies,
  setPermanentlyResolvedDiscrepancies
}: Props) {
  const { watch, setValue } = useFormContext<CreateTransferReceptionFormData>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [isResolvingAll, setIsResolvingAll] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<string | null>(null);

  const formItems = watch("items") || [];
  const newComment = watch("newComment") || "";
  const resolutionNote = watch("resolutionNote") || "";
  
 
  // Watch para resolver todas las discrepancias cuando estén completas
  useEffect(() => {
    const totalDiscrepancies = discrepancies.length;
    const resolvedCount = Object.keys(resolvedDiscrepancies).length;
    const permanentlyResolvedCount = permanentlyResolvedDiscrepancies.size;

    // Si todas las discrepancias están resueltas (ya sea temporal o permanentemente) y no estamos ya resolviendo
    const totalResolved = resolvedCount + permanentlyResolvedCount;
    if (totalDiscrepancies > 0 && totalResolved === totalDiscrepancies && resolvedCount > 0 && !isResolvingAll) {
      handleResolveAllDiscrepancies();
    }
  }, [discrepancies.length, resolvedDiscrepancies, permanentlyResolvedDiscrepancies, isResolvingAll]);
  useEffect(() => {
    if (!Array.isArray(formItems)) {
      setDiscrepancies([]);
      return;
    }
    const generated = formItems
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
        } as Discrepancy;
      });
    setDiscrepancies(generated);
  }, [formItems, transfer.items, resolvedDiscrepancies, permanentlyResolvedDiscrepancies]);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    if (!receptionId) {
      showToast("No se encontró el ID de la recepción", "error");
      return;
    }

    try {
      setIsSendingComment(true);

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
      const newCommentObj: Comment = {
        id: response.data?.id || Date.now().toString(),
        type: "general",
        message: newComment.trim(),
        author: "Usuario actual", // En el futuro se puede obtener del contexto de usuario
        createdAt: new Date().toISOString(),
      };

      setComments(prev => [...prev, newCommentObj]);
      setData((prev: { comments?: Comment[] }) => ({ ...prev, comments: [...(prev.comments || []), newCommentObj] }));
      setValue("newComment", ""); // Limpiar el campo del formulario
      showToast("Comentario enviado exitosamente", "success");
      
    } catch (error) {
      console.error("💥 [COMMENT EXCEPTION] Error inesperado:", error);
      showToast("Error al enviar el comentario", "error");
    } finally {
      setIsSendingComment(false);
    }
  };
  const handleResolveDiscrepancy = async (discrepancyId: string) => {
    if (!resolutionNote.trim()) {
      showToast("Debe agregar una nota de resolución", "error");
      return;
    }

    // Obtener la cantidad recibida del formulario para este item
    const formItem = formItems.find(item => item.transferItemId === discrepancyId);
    const finalQuantityAccepted = formItem?.quantityReceived || 0;

    // Guardar localmente la resolución (sin llamar al backend aún)
    setResolvedDiscrepancies(prev => ({
      ...prev,
      [discrepancyId]: {
        resolution: resolutionNote.trim(),
        resolvedAt: new Date().toISOString(),
        quantityAccepted: finalQuantityAccepted
      }
    }));

    setSelectedDiscrepancy(null);
    setValue("resolutionNote", ""); // Limpiar el campo del formulario
    showToast("Discrepancia marcada como resuelta", "success");
  };

  const handleResolveAllDiscrepancies = async () => {
    if (!receptionData?.id) {
      console.error("❌ [RESOLVE ALL ERROR] No hay ID de recepción");
      return;
    }

    try {
      setIsResolvingAll(true);

      // Construir payload con todas las discrepancias resueltas
      const itemsToAccept = Object.entries(resolvedDiscrepancies).map(([discrepancyId, resolutionData]) => {
        // Buscar el transferReceptionItemId correcto en receptionData.items
        const receptionItem = receptionData.items?.find((it: any) => it.transferItemId === discrepancyId);
        if (!receptionItem) {
          throw new Error(`No se encontró el item de recepción para ${discrepancyId}`);
        }

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

  return (
    <div className="space-y-6">
      {/* Discrepancias Detectadas */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Discrepancias Detectadas
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gestiona las incidencias encontradas durante la recepción
            </p>
          </div>
        </div>

        {discrepancies.length > 0 ? (
          <div className="space-y-4">
            {isResolvingAll && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                    Resolviendo todas las discrepancias...
                  </p>
                </div>
              </div>
            )}
            {discrepancies.map((discrepancy) => (
              <div
                key={discrepancy.id}
                className={`bg-white dark:bg-gray-800 rounded-lg p-4 border ${discrepancy.status === "resolved"
                    ? "border-green-200 dark:border-green-800"
                    : "border-orange-200 dark:border-orange-800"
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${discrepancy.status === "resolved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                          : "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300"
                        }`}>
                        {discrepancy.status === "resolved" ? "Resuelto" : "Pendiente"}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        {DISCREPANCY_TYPE_OPTIONS.find(opt => opt.value === discrepancy.type)?.label || discrepancy.type}
                      </span>
                      
                    </div>

                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {discrepancy.productName}
                    </h4>

                    {discrepancy.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {discrepancy.description}
                      </p>
                    )}

                    {!discrepancy.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 italic">
                        Sin notas adicionales
                      </p>
                    )}

                    {discrepancy.resolution && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                        <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                          Resolución:
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          {discrepancy.resolution}
                        </p>
                      </div>
                    )}
                  </div>

                  {discrepancy.status === "pending" && (
                    <div className="ml-4">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => setSelectedDiscrepancy(discrepancy.id)}
                      >
                        Resolver
                      </Button>
                    </div>
                  )}
                </div>

                {/* Formulario de resolución */}
                {selectedDiscrepancy === discrepancy.id && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <RHFInputWithLabel
                      name="resolutionNote"
                      type="textarea"
                      label="Nota de Resolución"
                      placeholder="Describe cómo se resolvió la discrepancia..."
                      rows={3}
                      showError={false}
                    />
                    <div className="flex justify-end space-x-3 mt-3">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedDiscrepancy(null);
                          setValue("resolutionNote", "");
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleResolveDiscrepancy(discrepancy.id)}
                      >
                        Marcar como Resuelta
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              No se han detectado discrepancias
            </p>
          </div>
        )}
      </div>

      {/* Comunicación */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Comunicación
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comunícate con el almacén origen sobre cualquier incidencia
            </p>
          </div>
        </div>

        {/* Lista de comentarios */}
        <div className="mb-4 max-h-60 overflow-y-auto">
          {isLoadingComments ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Cargando comentarios...</p>
            </div>
          ) : receptionData.comments.length > 0 ? (
            <div className="space-y-3">
              {receptionData.comments.map((comment:any) => (
                <div
                  key={comment.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {comment.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No hay comentarios aún
              </p>
            </div>
          )}
        </div>

        {/* Nuevo comentario */}
        <div className="border-t border-blue-200 dark:border-blue-800 pt-4">
          <div className="flex space-x-3">
            <div className="flex-1">
              <RHFInputWithLabel
                name="newComment"
                placeholder="Escribe un comentario..."
                showError={false}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    // Aquí iría la lógica para enviar comentario
                  }
                }}
              />
            </div>
            <Button
              type="button"
              variant="primary"
              onClick={handleSendComment}
              disabled={isSendingComment || !newComment.trim()}
            >
              {isSendingComment ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}