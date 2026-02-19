import {
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import ProgressiveImage from "@/components/image/progressive-image";
import React, { useEffect, useMemo, useState } from "react";

type UIDocument = {
  id?: number;
  fileName: string;
  // Approved docs are handled as remote resources; keep URL string only
  content: string | null;
};

export default function SupplierApprovedDocuments({
  initialDocuments,
}: {
  initialDocuments: { id?: number; fileName: string; content: string }[];
}) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [docs, setDocs] = useState<UIDocument[]>(
    () =>
      initialDocuments?.map((d) => ({
        id: d.id,
        fileName: d.fileName,
        content: d.content,
      })) || [],
  );
  const [docLoading] = useState<Record<number, boolean>>({});
  const fields = useMemo(
    () => docs.map((_, i) => ({ id: `doc-${i}` })),
    [docs],
  );
  const onRemove = (index: number) =>
    setDocs((prev) => prev.filter((_, i) => i !== index));
  const onView = async (index: number) => {
    const doc = docs[index];
    if (!doc) return;
    if (typeof doc.content === "string" && doc.content) {
      window.open(doc.content, "_blank", "noopener,noreferrer");
    }
  };

  const onDownload = async (index: number) => {
    const doc = docs[index];
    if (!doc) return;
    const filename = doc.fileName?.trim() || "document";
    if (typeof doc.content === "string" && doc.content) {
      const a = document.createElement("a");
      a.href = doc.content;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  // Re-sincronizar documentos aprobados cuando cambie la lista inicial desde el backend
  useEffect(() => {
    setDocs(
      initialDocuments?.map((d) => ({
        id: d.id,
        fileName: d.fileName,
        content: d.content,
      })) || [],
    );
  }, [initialDocuments]);

  const copyLink = async (index: number) => {
    const url = docs[index]?.content;
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedIdx(index);
      setTimeout(() => setCopiedIdx((i) => (i === index ? null : i)), 1500);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      setCopiedIdx(index);
      setTimeout(() => setCopiedIdx((i) => (i === index ? null : i)), 1500);
    }
  };

  const getKind = (name?: string | null) => {
    const n = (name || "").toLowerCase();
    if (/(\.png|\.jpe?g|\.gif|\.webp|\.bmp|\.svg)$/.test(n))
      return "image" as const;
    if (n.endsWith(".pdf")) return "pdf" as const;
    return "file" as const;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Documentos Aprobados
        </h3>
      </div>
      {fields.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No hay documentos aprobados cargados</p>
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
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block">
                    Nombre del Archivo
                  </label>
                  <div className="text-sm text-gray-900 dark:text-gray-100 break-words">
                    {docs[index]?.fileName || "Sin nombre"}
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block mb-2">
                    Archivo
                  </label>
                  {docs[index]?.content ? (
                    <div className="flex items-center gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40">
                      {getKind(docs[index]?.fileName) === "image" ? (
                        <ProgressiveImage
                          src={docs[index]!.content!}
                          alt={docs[index]?.fileName || "Documento"}
                          width={40}
                          height={40}
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        <div className="h-10 w-10 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                          <DocumentTextIcon className="h-6 w-6" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <a
                          href={docs[index]!.content!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate"
                          title={docs[index]?.fileName}
                        >
                          {docs[index]?.fileName || "Abrir documento"}
                        </a>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => copyLink(index)}
                            className="inline-flex items-center px-2 py-0.5 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {copiedIdx === index ? (
                              <>
                                <CheckIcon className="h-4 w-4 mr-1" /> Copiado
                              </>
                            ) : (
                              <>
                                <ClipboardDocumentIcon className="h-4 w-4 mr-1" />{" "}
                                Copiar enlace
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Sin archivo
                    </div>
                  )}
                </div>
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
                        onClick={() => onView(index)}
                        className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" /> Ver
                      </button>
                      <button
                        type="button"
                        onClick={() => onDownload(index)}
                        className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Descargar
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
  );
}
