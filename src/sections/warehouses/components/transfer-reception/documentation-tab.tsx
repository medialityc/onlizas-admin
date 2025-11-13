"use client";

import { Button } from "@/components/button/button";
import { WarehouseTransfer } from "@/types/warehouses-transfers";
import { useState, useRef, useEffect } from "react";
import showToast from "@/config/toast/toastConfig";
import {
  uploadReceptionEvidence,
  getTransferReceptionById,
} from "@/services/warehouse-transfer-receptions";

interface Props {
  transfer: WarehouseTransfer;
  receptionData?: any;
}

export default function DocumentationTab({ transfer, receptionData }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [existingEvidence, setExistingEvidence] = useState<string[]>(
    receptionData?.evidenceUrls || []
  );

  // Update existingEvidence when receptionData changes
  useEffect(() => {
    if (receptionData?.evidenceUrls) {
      setExistingEvidence(receptionData.evidenceUrls);
    }
  }, [receptionData?.evidenceUrls]);

  // Function to refresh reception data after upload
  const refreshReceptionData = async () => {
    if (receptionData?.id) {
      try {
        const result = await getTransferReceptionById(receptionData.id);
        if (!result.error && result.data?.evidenceUrls) {
          setExistingEvidence(result.data.evidenceUrls);
        }
      } catch (error) {
        console.error("Error refreshing reception data:", error);
      }
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        showToast(`Tipo de archivo no permitido: ${file.name}`, "error");
        continue;
      }

      if (file.size > maxSize) {
        showToast(
          `Archivo demasiado grande: ${file.name} (máximo 10MB)`,
          "error"
        );
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    try {
      setIsUploading(true);

      // Upload files using real API
      const result = await uploadReceptionEvidence(
        receptionData?.id || transfer.id,
        validFiles
      );

      if (!result.error) {
        // Upload was successful, handle different response formats
        let newUrls: string[] = [];

        if (result.data) {
          const data = result.data as any; // Type assertion to handle different formats

          if (Array.isArray(data.urls)) {
            newUrls = data.urls;
          } else if (typeof data.urls === "string") {
            newUrls = [data.urls];
          } else if (data.url) {
            // Some APIs return single url instead of urls array
            newUrls = [data.url];
          }
        }
        // Add new URLs to existing evidence if we got any
        if (newUrls.length > 0) {
          const updatedEvidence = [...existingEvidence, ...newUrls];
          setExistingEvidence(updatedEvidence);
        } else {
          // If no URLs returned, refresh reception data to get updated evidenceUrls
          await refreshReceptionData();
        }

        showToast(
          `${validFiles.length} archivo(s) subido(s) correctamente`,
          "success"
        );
      } else {
        console.error("Upload failed:", result);
        throw new Error(result.message || "Error en la subida de archivos");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      showToast("Error al subir los archivos", "error");
    } finally {
      setIsUploading(false);
    }

    // Limpiar el input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "webp"].includes(extension || "")) {
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    }

    if (extension === "pdf") {
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    }

    return (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    );
  };

  const getFileName = (url: string) => {
    return url.split("/").pop() || "Documento";
  };

  const getFileTypeColor = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "webp"].includes(extension || ""))
      return "text-purple-600 dark:text-purple-400";
    if (extension === "pdf") return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Subir Evidencia */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-purple-600 dark:text-purple-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V17a4 4 0 01-4 4z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Documentación y Evidencia
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sube fotos, documentos y evidencia relacionada con la recepción
            </p>
          </div>
        </div>

        {/* Zona de subida */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Arrastra archivos aquí o haz clic para seleccionar
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Tipos permitidos: Imágenes (JPG, PNG, WebP), PDF, DOC, TXT
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
            Tamaño máximo: 10MB por archivo
          </p>

          <Button
            type="button"
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "Subiendo..." : "Seleccionar Archivos"}
          </Button>
        </div>
      </div>

      {/* Lista de Archivos */}
      {existingEvidence.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Archivos Subidos ({existingEvidence.length})
          </h3>

          <div className="space-y-3">
            {existingEvidence.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`${getFileTypeColor(url)}`}>
                    {getFileIcon(url)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {getFileName(url)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Archivo subido
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => window.open(url, "_blank")}
                  >
                    Ver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tipos de Documentos Recomendados */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Documentos Recomendados
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              📋 Documentos Obligatorios
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Albarán de entrega firmado</li>
              <li>• Lista de verificación completada</li>
              <li>• Fotos del estado general de los productos</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              📷 Evidencia Adicional
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Fotos de productos dañados (si aplica)</li>
              <li>• Certificados de calidad</li>
              <li>• Notas de discrepancias</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
