import { ExternalReviewApprovalProcessResponse } from "@/services/external-review";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

interface Props {
  title: string;
  docs: ExternalReviewApprovalProcessResponse["approvalProcess"]["pendingDocuments"];
  empty: string;
}

// Helper para icono según extensión
function getFileMeta(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, { label: string; cls: string }> = {
    pdf: { label: "PDF", cls: "bg-red-50 text-red-600 border-red-200" },
    doc: { label: "DOC", cls: "bg-blue-50 text-blue-600 border-blue-200" },
    docx: { label: "DOCX", cls: "bg-blue-50 text-blue-600 border-blue-200" },
    xls: { label: "XLS", cls: "bg-green-50 text-green-600 border-green-200" },
    xlsx: { label: "XLSX", cls: "bg-green-50 text-green-600 border-green-200" },
    jpg: { label: "JPG", cls: "bg-amber-50 text-amber-600 border-amber-200" },
    jpeg: { label: "JPG", cls: "bg-amber-50 text-amber-600 border-amber-200" },
    png: { label: "PNG", cls: "bg-amber-50 text-amber-600 border-amber-200" },
  };
  return (
    map[ext] || {
      label: ext.toUpperCase() || "FILE",
      cls: "bg-gray-50 text-gray-600 border-gray-200",
    }
  );
}

export default function DocumentsSection({ title, docs, empty }: Props) {
  const headingId = `${title.replace(/\s+/g, "-").toLowerCase()}-heading`;

  if (!docs.length)
    return (
      <section aria-labelledby={headingId} className="space-y-2">
        <h3 id={headingId} className="font-semibold text-sm">
          {title}
        </h3>
        <div
          className="border rounded p-3 text-xs bg-gray-50 text-gray-500 flex items-center gap-2"
          role="status"
          aria-live="polite"
        >
          <DocumentTextIcon className="w-4 h-4 text-gray-400" />
          {empty}
        </div>
      </section>
    );

  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 id={headingId} className="font-semibold text-sm">
          {title}
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
          {docs.length}
        </span>
      </div>
      <ul className="space-y-3" role="list">
        {docs.map((d) => {
          const fileMeta = getFileMeta(d.fileName);
          const approved = d.beApproved;
          return (
            <li
              key={d.id}
              role="listitem"
              className="group relative border rounded-xl p-3 text-xs flex flex-col gap-2 bg-white dark:bg-gray-900 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/50 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${fileMeta.cls}`}
                    aria-label={`Tipo de archivo ${fileMeta.label}`}
                  >
                    <DocumentTextIcon className="w-3.5 h-3.5" />
                    {fileMeta.label}
                  </span>
                  <span
                    className="font-medium truncate max-w-[180px]"
                    title={d.fileName}
                  >
                    {d.fileName}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border ${approved ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}
                  aria-label={`Estado ${approved ? "aprobado" : "pendiente"}`}
                >
                  {approved ? (
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                  ) : (
                    <ClockIcon className="w-3.5 h-3.5" />
                  )}
                  {approved ? "Aprobado" : "Pendiente"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <a
                  href={d.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded px-1 break-all"
                  aria-label={`Abrir documento ${d.fileName} en nueva pestaña`}
                >
                  Ver documento
                </a>
                {d.rejectionReason && (
                  <p
                    className="text-red-600 text-[11px] flex items-center gap-1"
                    aria-label={`Motivo de rechazo: ${d.rejectionReason}`}
                  >
                    <XCircleIcon className="w-3.5 h-3.5" />
                    <span className="font-medium">Rechazado:</span>
                    <span>{d.rejectionReason}</span>
                  </p>
                )}
              </div>
              {/* Indicador de hover decorativo */}
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 group-hover:ring-1 group-hover:ring-indigo-300/60 transition" />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
