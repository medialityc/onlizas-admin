"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateSupplierSchema,
  type UpdateSupplierFormData,
} from "@/sections/suppliers/modals/suppliers-schema";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { RHFFileUpload } from "@/components/react-hook-form/rhf-file-upload";
import LoaderButton from "@/components/loaders/loader-button";
import { SupplierDetails } from "@/types/suppliers";
import {
  TrashIcon,
  PlusIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { updateSupplierData } from "@/services/supplier";
import { urlToFile } from "@/lib/utils";
import { toast } from "react-toastify";

export default function SupplierEditForm({
  supplierDetails,
}: {
  supplierDetails: SupplierDetails;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [docLoading, setDocLoading] = useState<Record<number, boolean>>({});

  const methods = useForm<UpdateSupplierFormData>({
    resolver: zodResolver(updateSupplierSchema),
    defaultValues: {
      name: supplierDetails.name,
      email: supplierDetails.email,
      phone: supplierDetails.phone,
      address: supplierDetails.address,
      message: supplierDetails.message || "",
      type: supplierDetails.type,
      isActive: supplierDetails.isActive,
      pendingDocuments:
        supplierDetails.pendingDocuments?.map((doc) => ({
          fileName: doc.fileName,
          content: doc.content,
        })) || [],
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = methods;

  useEffect(() => {
    const isUrl = (val: unknown): val is string =>
      typeof val === "string" && /^https?:\/\//i.test(val);
    const prefill = async () => {
      const docs = methods.getValues("pendingDocuments") as
        | Array<{
            fileName: string;
            content: unknown;
          }>
        | undefined;
      if (!docs || docs.length === 0) return;

      await Promise.all(
        docs.map(async (doc, idx) => {
          if (isUrl(doc.content)) {
            try {
              setDocLoading((p) => ({ ...p, [idx]: true }));
              const file = await urlToFile(doc.content, doc.fileName);
              methods.setValue(
                `pendingDocuments.${idx}.content` as const,
                file,
                {
                  shouldDirty: false,
                  shouldValidate: false,
                }
              );
            } catch (e) {
              // Si falla la descarga, dejamos el valor original (string)
              console.error("No se pudo convertir la URL a archivo:", e);
            } finally {
              setDocLoading((p) => ({ ...p, [idx]: false }));
            }
          }
        })
      );
    };

    prefill();
    // Ejecutar solo al montar con los valores iniciales
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    fields: documentFields,
    append: appendDocument,
    remove: removeDocument,
  } = useFieldArray({
    control,
    name: "pendingDocuments",
  });

  const onSubmit = async (data: UpdateSupplierFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Agregar campos básicos
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("message", data.message || "");
      formData.append("type", data.type);
      formData.append("isActive", data.isActive.toString());

      // Agregar documentos
      if (data.pendingDocuments && data.pendingDocuments.length > 0) {
        data.pendingDocuments.forEach((doc, index) => {
          formData.append(`pendingDocuments[${index}][fileName]`, doc.fileName);
          if (doc.content instanceof File) {
            formData.append(`pendingDocuments[${index}][content]`, doc.content);
          } else {
            formData.append(`pendingDocuments[${index}][content]`, doc.content);
          }
        });
      }

      const response = await updateSupplierData(supplierDetails.id, formData);

      if (response.error) {
        throw new Error(response.message || "Error al actualizar proveedor");
      }
      toast.success("Solicitud actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
      toast.error("Error al actualizar proveedor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDocument = () => {
    appendDocument({
      fileName: "",
      content: "",
    });
  };

  // Helpers para visualizar/descargar documentos
  const withObjectUrl = async (
    file: File,
    cb: (url: string) => void
  ): Promise<void> => {
    const url = URL.createObjectURL(file);
    try {
      cb(url);
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  };

  const handleViewDocument = async (index: number) => {
    const doc = methods.getValues(`pendingDocuments.${index}` as const) as {
      fileName: string;
      content: unknown;
    };
    if (!doc) return;
    if (doc.content instanceof File) {
      await withObjectUrl(doc.content, (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
      });
    } else if (typeof doc.content === "string" && doc.content) {
      // Si aún es URL string
      window.open(doc.content, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownloadDocument = async (index: number) => {
    const doc = methods.getValues(`pendingDocuments.${index}` as const) as {
      fileName: string;
      content: unknown;
    };
    if (!doc) return;
    const filename = doc.fileName?.trim() || "document";
    if (doc.content instanceof File) {
      await withObjectUrl(doc.content, (url) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    } else if (typeof doc.content === "string" && doc.content) {
      // Descarga directa de la URL
      const a = document.createElement("a");
      a.href = doc.content;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RHFInputWithLabel
            name="name"
            label="Nombre del Proveedor"
            placeholder="Ingresa el nombre del proveedor"
            type="text"
            required
          />

          <RHFInputWithLabel
            name="email"
            label="Email"
            type="email"
            placeholder="correo@ejemplo.com"
            required
          />

          <RHFInputWithLabel
            name="phone"
            label="Teléfono"
            placeholder="Ingresa el número de teléfono"
            type="tel"
            required
          />
        </div>

        <RHFInputWithLabel
          name="address"
          label="Dirección"
          placeholder="Ingresa la dirección completa"
          type="text"
          required
        />

        <div className="space-y-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Mensaje/Comentarios
          </label>
          <textarea
            {...methods.register("message")}
            rows={4}
            placeholder="Comentarios adicionales sobre el proveedor"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          {errors.message && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Documentos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Documentos
            </h3>
            <button
              type="button"
              onClick={handleAddDocument}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Agregar Documento
            </button>
          </div>

          {documentFields.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No hay documentos cargados</p>
              <p className="text-sm">
                Haz clic en &ldquo;Agregar Documento&rdquo; para añadir uno
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {documentFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Documento {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 p-1"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RHFInputWithLabel
                      name={`pendingDocuments.${index}.fileName`}
                      label="Nombre del Archivo"
                      placeholder="ej: contrato.pdf"
                      type="text"
                    />

                    <RHFFileUpload
                      name={`pendingDocuments.${index}.content`}
                      label="Archivo"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      disabled={!!docLoading[index]}
                    />
                    <div className="flex items-center gap-2 md:col-span-2">
                      {docLoading[index] ? (
                        <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg
                            className="animate-spin h-4 w-4 mr-2 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                          Cargando documento...
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewDocument(index)}
                            className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" /> Ver
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadDocument(index)}
                            className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />{" "}
                            Descargar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancelar
          </button>
          <LoaderButton
            type="submit"
            loading={isLoading}
            disabled={!isDirty || isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </LoaderButton>
        </div>

        {/* Indicador de cambios */}
        {isDirty && (
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Tienes cambios sin guardar. Asegúrate de guardar antes de
                  salir.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
