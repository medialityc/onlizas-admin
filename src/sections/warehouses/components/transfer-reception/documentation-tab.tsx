"use client";

import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";
import { WarehouseTransfer } from "@/types/warehouses-transfers";
import { useFormContext, useFieldArray } from "react-hook-form";
import { CreateTransferReceptionFormData, ReceptionEvidenceFormData } from "@/sections/warehouses/schemas/transfer-reception-schema";
import { useState, useRef } from "react";
import showToast from "@/config/toast/toastConfig";

interface Props {
  transfer: WarehouseTransfer;
}

interface DocumentFile {
  id?: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  file?: File;
  uploadProgress?: number;
  isUploading?: boolean;
}

export default function DocumentationTab({ transfer }: Props) {
  // Usamos el schema unificado del flujo de recepción
  const { control, register } = useFormContext<CreateTransferReceptionFormData>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { fields: evidence, append: addEvidence, remove: removeEvidence } = useFieldArray({
    control,
    name: "evidence",
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        showToast(`Tipo de archivo no permitido: ${file.name}`, "error");
        continue;
      }

      if (file.size > maxSize) {
        showToast(`Archivo demasiado grande: ${file.name} (máximo 10MB)`, "error");
        continue;
      }

      // Estructura compatible con ReceptionEvidenceFormData en el schema
      const documentFile: ReceptionEvidenceFormData = {
        id: `temp-${Date.now()}-${i}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadProgress: 0,
        isUploading: true,
      };

      addEvidence(documentFile);

      try {
        setIsUploading(true);

        // Simular progreso de subida
        const progressInterval = setInterval(() => {
          documentFile.uploadProgress = Math.min((documentFile.uploadProgress || 0) + 10, 90);
        }, 200);

        // Simular subida de archivo
        console.log("Uploading file:", file.name, "for transfer:", transfer.id);

        // Aquí iría la llamada real: const result = await uploadReceptionEvidence([file], transfer.id);

        // Simular delay de subida
        await new Promise(resolve => setTimeout(resolve, 1000));

        const result = {
          id: `file-${Date.now()}`,
          url: URL.createObjectURL(file),
        };

        clearInterval(progressInterval);

        // Actualizar con el resultado final
        const updatedDocument: ReceptionEvidenceFormData = {
          ...documentFile,
          id: result.id,
          url: result.url,
          uploadProgress: 100,
          isUploading: false,
        };

        // Actualizar el documento en la lista
        const currentEvidence = evidence;
        const index = currentEvidence.findIndex((doc: any) => doc.id === documentFile.id);
        if (index !== -1) {
          // Usar replace no está disponible en useFieldArray, así que removemos y agregamos
          removeEvidence(index);
          addEvidence(updatedDocument);
        }

        showToast(`Archivo subido: ${file.name}`, "success");
      } catch (error) {
        console.error("Error uploading file:", error);
        showToast(`Error al subir ${file.name}`, "error");

        // Remover el archivo fallido
        const index = evidence.findIndex((doc: any) => doc.id === documentFile.id);
        if (index !== -1) {
          removeEvidence(index);
        }
      }
    }

    setIsUploading(false);

    // Limpiar el input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }

    if (type === "application/pdf") {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }

    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeColor = (type: string) => {
    if (type.startsWith("image/")) return "text-purple-600 dark:text-purple-400";
    if (type === "application/pdf") return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Subir Evidencia */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V17a4 4 0 01-4 4z" />
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

          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
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
      {evidence.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Archivos Subidos ({evidence.length})
          </h3>

          <div className="space-y-3">
            {evidence.map((doc, index) => (
              <div
                key={doc.id || index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`${getFileTypeColor(doc.type)}`}>
                    {getFileIcon(doc.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(doc.size)} • {doc.type.split('/')[1]?.toUpperCase()}
                    </p>

                    {/* Barra de progreso */}
                    {doc.isUploading && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${doc.uploadProgress || 0}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Subiendo... {doc.uploadProgress || 0}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {doc.url && !doc.isUploading && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(doc.url, "_blank")}
                    >
                      Ver
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeEvidence(index)}
                    disabled={doc.isUploading}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notas Adicionales */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Notas de Documentación
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observaciones sobre la Documentación
            </label>
            <textarea
                {...register("documentationNotes")}
              rows={4}
              placeholder="Añade cualquier observación sobre los documentos, fotos o evidencia subida..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("documentationComplete")}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Confirmo que toda la documentación requerida ha sido subida
              </span>
            </label>
          </div>
        </div>
      </div>

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