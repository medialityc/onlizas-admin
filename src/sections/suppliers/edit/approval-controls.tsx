"use client";

import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import ExternalReviewTokenModal from "./external-review/external-review-token-modal";
import { answerApprovalProcess } from "@/services/supplier";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { useModalState } from "@/hooks/use-modal-state";

interface ApprovalControlsProps {
  approvalProcessId: string;
  className?: string;
  pendingCategories?: { id: string; name: string }[];
}

export default function ApprovalControls({
  approvalProcessId,
  className,
  pendingCategories = [],
}: ApprovalControlsProps) {
  const [comments, setComments] = useState("");
  const [isPending, startTransition] = useTransition();
  const { openModal } = useModalState();

  // Control de permisos
  const { hasPermission } = usePermissions();
  const canApproveReject = hasPermission([PERMISSION_ENUM.UPDATE]);
  const openTokenModal = () => {
    openModal("external-review-token");
  };
  const submit = (isApproved: boolean) => {
    // Si se aprueba, comprobar que exista al menos 1 categoría pendiente
    if (isApproved && (!pendingCategories || pendingCategories.length === 0)) {
      toast.error(
        "No se puede aprobar: el proveedor debe tener al menos 1 categoría pendiente seleccionada."
      );
      return;
    }
    const data = {
      approvalProcessId,
      isApproved,
      comments,
      //  status: isApproved ? SUPPLIER_STATUS.Approved : SUPPLIER_STATUS.Rejected,
    };
    startTransition(async () => {
      const res = await answerApprovalProcess(data);
      if (res?.error) {
        toast.error(res?.message || "No se pudo procesar la solicitud");
        return;
      }

      if (res.data) {
        toast.success(
          res.data.isApproved ? "Solicitud aprobada" : "Solicitud rechazada"
        );
      }
    });
  };

  // Token generation moved to modal component

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Comentarios
      </label>
      <textarea
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Añade comentarios opcionales"
        rows={3}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />

      <div className="mt-3 flex gap-2">
        {canApproveReject ? (
          <>
            <button
              type="button"
              onClick={() => submit(true)}
              disabled={isPending}
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              Aprobar
            </button>
            <button
              type="button"
              onClick={() => submit(false)}
              disabled={isPending}
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              Rechazar
            </button>
            <button
              type="button"
              onClick={openTokenModal}
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              Generar Link Externo
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No tienes permisos para aprobar o rechazar esta solicitud
          </p>
        )}
      </div>
    </div>
  );
}
