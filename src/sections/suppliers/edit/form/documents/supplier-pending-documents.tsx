import {
  PlusIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { useFieldArray, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { RHFFileUpload } from "@/components/react-hook-form/rhf-file-upload";
import { toast } from "react-toastify";
import { uploadDocument, validateDocument } from "@/services/documents";

import RejectModal from "./reject-modal";
import RejectDetails from "./rejectdetails";
import {
  PendingDocumentsForm,
  pendingDocumentsFormSchema,
} from "./pending-docs-schema";
import { usePermissions } from "@/hooks/use-permissions";

export default function SupplierPendingDocuments({
  approvalProcessId,
  initialDocuments,
}: {
  approvalProcessId: number | string;
  initialDocuments: {
    id?: number;
    fileName: string;
    content: string;
    beApproved?: boolean;
    rejectionReason?: string | null;
  }[];
}) {
  const methods = useForm<PendingDocumentsForm>({
    resolver: zodResolver(pendingDocumentsFormSchema),
    defaultValues: {
      approvalProcessId,
      pendingDocuments:
        initialDocuments?.map((d) => ({
          id: d.id,
          fileName: d.fileName,
          content: d.content,
          beApproved: d.beApproved,
          rejectionReason: d.rejectionReason ?? null,
        })) || [],
    },
  });
  const { control, getValues, setValue } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pendingDocuments",
  });
  const docs = methods.watch("pendingDocuments");
  const [docLoading, setDocLoading] = useState<Record<number, boolean>>({});
  const [approveLoading, setApproveLoading] = useState<Record<number, boolean>>(
    {}
  );
  const [rejectIdx, setRejectIdx] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);
  const [viewReasonIdx, setViewReasonIdx] = useState<number | null>(null);

  // Control de permisos
  const { hasPermission } = usePermissions();
  const canValidateDocuments = hasPermission(["DOCUMENT_VALIDATE"]);

  const onAdd = () => append({ fileName: "", content: undefined });
  const onRemove = (index: number) => remove(index);

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

  const onDownload = async (index: number) => {
    const doc = getValues(`pendingDocuments.${index}`);
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
      const a = document.createElement("a");
      a.href = doc.content;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const onUpload = async (index: number) => {
    const doc = getValues(`pendingDocuments.${index}`);
    if (!doc) return;
    const apId = getValues("approvalProcessId");
    if (!apId) {
      toast.error("No se encontró el proceso de aprobación.");
      return;
    }
    if (!(doc.content instanceof File)) {
      toast.error("Selecciona un archivo para subir.");
      return;
    }
    try {
      setValue(`pendingDocuments.${index}.fileName`, doc.fileName);
      setDocLoading((m) => ({ ...m, [index]: true }));
      const form = new FormData();
      form.append("approvalProcessId", String(apId));
      form.append("fileName", doc.fileName);
      form.append("content", doc.content);
      const res = await uploadDocument(form);
      if (res.error || !res.data) throw new Error(res.message || "Error");
      const uploaded = res.data;
      // Persist the returned id and content URL
      setValue(`pendingDocuments.${index}.id`, uploaded.id, {
        shouldDirty: false,
      });
      setValue(`pendingDocuments.${index}.content`, uploaded.content as any, {
        shouldDirty: false,
      });
      toast.success("Documento subido");
    } catch (e) {
      console.error(e);
      toast.error("No se pudo subir el documento");
    } finally {
      setDocLoading((m) => ({ ...m, [index]: false }));
    }
  };

  const onApprove = async (index: number) => {
    const doc = getValues(`pendingDocuments.${index}`);
    if (!doc?.id) {
      toast.error("Debes subir el documento antes de aprobarlo.");
      return;
    }
    try {
      setApproveLoading((m) => ({ ...m, [index]: true }));
      const res = await validateDocument(doc.id, {
        beValid: true,
        rejectionReason: "",
      });
      if (res.error) throw new Error(res.message || "Error");
      toast.success("Documento aprobado");
      // Update local status
      setValue(`pendingDocuments.${index}.beApproved`, true, {
        shouldDirty: false,
      });
      setValue(`pendingDocuments.${index}.rejectionReason`, null as any, {
        shouldDirty: false,
      });
    } catch (e) {
      console.error(e);
      toast.error("No se pudo aprobar el documento");
    } finally {
      setApproveLoading((m) => ({ ...m, [index]: false }));
    }
  };

  const onReject = (index: number) => {
    const doc = getValues(`pendingDocuments.${index}`);
    if (!doc?.id) {
      toast.error("Debes subir el documento antes de rechazarlo.");
      return;
    }
    setRejectIdx(index);
    setRejectReason("");
  };

  const handleConfirmReject = async () => {
    if (rejectIdx === null) return;
    const doc = getValues(`pendingDocuments.${rejectIdx}`);
    if (!doc?.id) {
      toast.error("Debes subir el documento antes de rechazarlo.");
      return;
    }
    if (rejectReason.trim().length === 0) {
      toast.info("Debes especificar un motivo de rechazo.");
      return;
    }
    try {
      setRejectLoading(true);
      const res = await validateDocument(doc.id, {
        beValid: false,
        rejectionReason: rejectReason.trim(),
      });
      if (res.error) throw new Error(res.message || "Error");
      toast.success("Documento rechazado");
      // Update local status
      setValue(`pendingDocuments.${rejectIdx}.beApproved`, false, {
        shouldDirty: false,
      });
      setValue(
        `pendingDocuments.${rejectIdx}.rejectionReason`,
        rejectReason.trim() as any,
        { shouldDirty: false }
      );
      setRejectIdx(null);
      setRejectReason("");
    } catch (e) {
      console.error(e);
      toast.error("No se pudo rechazar el documento");
    } finally {
      setRejectLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Documentos Pendientes
          </h3>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Agregar Documento
          </button>
        </div>
        {fields.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No hay documentos pendinetes de revisión cargados</p>
            <p className="text-sm">
              Haz clic en &ldquo;Agregar Documento&rdquo; para añadir uno
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
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
                    onClick={() => onRemove(index)}
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
                  <div className="flex items-center justify-between md:col-span-2">
                    {/* Status badge */}
                    {(() => {
                      const item = docs?.[index] as
                        | {
                            beApproved?: boolean;
                            rejectionReason?: string | null;
                          }
                        | undefined;
                      if (item?.beApproved) {
                        return (
                          <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            Aprobado
                          </span>
                        );
                      }
                      if (item?.rejectionReason) {
                        return (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                              Rechazado
                            </span>
                            <button
                              type="button"
                              onClick={() => setViewReasonIdx(index)}
                              className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                            >
                              Ver motivo
                            </button>
                          </div>
                        );
                      }
                      return (
                        <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          Pendiente
                        </span>
                      );
                    })()}
                    {/* Actions */}
                    <div className="flex items-center gap-2">
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
                          {/** compute capability: only allow approve/reject when there is a persisted id (uploaded or preloaded) */}
                          {(() => {
                            const item = docs?.[index] as
                              | {
                                  id?: number;
                                  content?: string;
                                  beApproved?: boolean;
                                  rejectionReason?: string | null;
                                }
                              | undefined;
                            const canValidate =
                              typeof item?.id === "number" &&
                              item!.id > 0 &&
                              canValidateDocuments;
                            return (
                              <>
                                <button
                                  type="button"
                                  onClick={() => onDownload(index)}
                                  className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />{" "}
                                  Descargar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onUpload(index)}
                                  className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
                                >
                                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />{" "}
                                  Subir
                                </button>
                                {canValidate ? (
                                  <>
                                    {!item.beApproved && (
                                      <button
                                        type="button"
                                        onClick={() => onApprove(index)}
                                        className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900 disabled:opacity-60"
                                        disabled={!!approveLoading[index]}
                                      >
                                        {approveLoading[index] ? (
                                          <>
                                            <svg
                                              className="animate-spin h-4 w-4 mr-1 text-green-600"
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
                                            Aprobando
                                          </>
                                        ) : (
                                          <>
                                            <CheckIcon className="h-4 w-4 mr-1" />{" "}
                                            Aprobar
                                          </>
                                        )}
                                      </button>
                                    )}
                                    {!item.rejectionReason && (
                                      <button
                                        type="button"
                                        onClick={() => onReject(index)}
                                        className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900"
                                      >
                                        <XMarkIcon className="h-4 w-4 mr-1" />{" "}
                                        Rechazar
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {typeof item?.id === "number" &&
                                    item!.id > 0
                                      ? "No tienes permisos para validar documentos"
                                      : "Sube el archivo para habilitar aprobación/rechazo"}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Rejection Reason Modal */}
      <RejectModal
        rejectIdx={rejectIdx}
        setRejectIdx={setRejectIdx}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        rejectLoading={rejectLoading}
        handleConfirmReject={handleConfirmReject}
      />
      {/* View Rejection Reason Modal */}
      <RejectDetails
        viewReasonIdx={viewReasonIdx}
        setViewReasonIdx={setViewReasonIdx}
        getValues={getValues}
      />
    </FormProvider>
  );
}
