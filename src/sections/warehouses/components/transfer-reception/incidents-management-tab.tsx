"use client";

import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";
import { WarehouseTransfer } from "@/types/warehouses-transfers";
import { useFormContext } from "react-hook-form";
import { ReceptionFormData } from "@/types/transfer-reception";
import { useState, useEffect } from "react";
import { addReceptionComment } from "@/services/transfer-reception";
import showToast from "@/config/toast/toastConfig";

interface Props {
  transfer: WarehouseTransfer;
}

interface Comment {
  id: number;
  type: "general" | "discrepancy";
  message: string;
  author: string;
  createdAt: string;
  discrepancyId?: number;
}

interface Discrepancy {
  id: number;
  productId: number;
  productName: string;
  type: string;
  status: "pending" | "resolved";
  description: string;
  resolution?: string;
  createdAt: string;
}

export default function IncidentsManagementTab({ transfer }: Props) {
  const { watch } = useFormContext<ReceptionFormData>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<number | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const formDiscrepancies = watch("discrepancies") || {};

  // Cargar comentarios existentes
  useEffect(() => {
    loadComments();
  }, [transfer.id]);

  const loadComments = async () => {
    try {
      setIsLoadingComments(true);
      // Simular carga de comentarios para demo
      console.log("Loading comments for transfer:", transfer.id);
      setComments([]);
    } catch (error) {
      console.error("Error loading comments:", error);
      showToast("Error al cargar los comentarios", "error");
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Generar discrepancias desde el formulario
  useEffect(() => {
    const generatedDiscrepancies = Object.entries(formDiscrepancies)
      .filter(([_, discrepancy]) => discrepancy.type && discrepancy.type.trim())
      .map(([productId, discrepancy], index) => {
        const item = transfer.items?.find(item => item.id === Number(productId));
        return {
          id: index + 1,
          productId: Number(productId),
          productName: item?.productVariantName || "Producto desconocido",
          type: discrepancy.type,
          status: "pending" as const,
          description: discrepancy.notes || "",
          createdAt: new Date().toISOString(),
        };
      });

    setDiscrepancies(generatedDiscrepancies);
  }, [formDiscrepancies, transfer.items]);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsSendingComment(true);

      // Simular envío de comentario usando la función del servicio
      console.log("Enviando comentario:", {
        transferId: transfer.id,
        type: "general",
        message: newComment.trim(),
      });

      // Aquí iría la llamada real: await addReceptionComment(transfer.id, { ... })

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));

      setNewComment("");
      showToast("Comentario enviado", "success");
      loadComments(); // Recargar comentarios
    } catch (error) {
      console.error("Error sending comment:", error);
      showToast("Error al enviar el comentario", "error");
    } finally {
      setIsSendingComment(false);
    }
  };

  const handleResolveDiscrepancy = async (discrepancyId: number) => {
    if (!resolutionNote.trim()) {
      showToast("Debe agregar una nota de resolución", "error");
      return;
    }

    try {
      // Simular resolución de discrepancia
      console.log("Resolviendo discrepancia:", {
        discrepancyId,
        transferId: transfer.id,
        resolutionDescription: resolutionNote.trim(),
      });

      // Aquí iría la llamada real: await resolveDiscrepancy(discrepancyId, { ... })

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));

      setDiscrepancies(prev =>
        prev.map(d =>
          d.id === discrepancyId
            ? { ...d, status: "resolved", resolution: resolutionNote }
            : d
        )
      );

      setSelectedDiscrepancy(null);
      setResolutionNote("");
      showToast("Discrepancia resuelta", "success");
    } catch (error) {
      console.error("Error resolving discrepancy:", error);
      showToast("Error al resolver la discrepancia", "error");
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
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {discrepancy.type}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nota de Resolución
                    </label>
                    <textarea
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      rows={3}
                      placeholder="Describe cómo se resolvió la discrepancia..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-3"
                    />
                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedDiscrepancy(null);
                          setResolutionNote("");
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
                        Confirmar Resolución
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
          ) : comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
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
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendComment();
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

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-800 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {discrepancies.filter(d => d.status === "pending").length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pendientes
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {discrepancies.filter(d => d.status === "resolved").length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Resueltas
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {comments.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comentarios
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}