"use client";

import { useState } from "react";
import SimpleModal from "@/components/modal/modal";
import ConfirmationDialog from "@/components/modal/confirm-modal";
import {
  CategorySuggestion,
  ReviewCategorySuggestionPayload,
} from "@/types/category-suggestions";
import { reviewCategorySuggestion } from "@/services/category-suggestions";
import { CategorySuggestionState } from "../constants/suggestion-state";
import Badge from "@/components/badge/badge";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  suggestion?: CategorySuggestion | null;
  onSuccess?: () => void;
}

export default function ReviewSuggestionModal({
  open,
  onClose,
  suggestion,
  onSuccess,
}: Props) {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!suggestion) return null;

  const handleReview = async (payload: ReviewCategorySuggestionPayload) => {
    setLoading(true);
    try {
      const res = await reviewCategorySuggestion(suggestion.id, payload);
      if (!res.error) {
        toast.success(
          payload.approved ? "Sugerencia aprobada" : "Sugerencia rechazada",
        );
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.message || "No se pudo procesar la revisión");
      }
    } catch {
      toast.error("Error procesando la revisión");
    } finally {
      setLoading(false);
      setApproveDialogOpen(false);
      setRejectDialogOpen(false);
    }
  };

  const stateVariantMap: Record<
    CategorySuggestionState,
    { variant: Parameters<typeof Badge>[0]["variant"]; label: string }
  > = {
    [CategorySuggestionState.PENDING]: {
      variant: "outline-warning",
      label: "Pendiente",
    },
    [CategorySuggestionState.APPROVED]: {
      variant: "outline-success",
      label: "Aprobada",
    },
    [CategorySuggestionState.REJECTED]: {
      variant: "outline-danger",
      label: "Rechazada",
    },
  };

  const stateInfo = stateVariantMap[suggestion.state];

  return (
    <>
      <SimpleModal
        open={open}
        onClose={onClose}
        title="Revisar sugerencia de categoría"
        size="md"
      >
        <div className="space-y-4 p-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Nombre
            </span>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {suggestion.name}
            </p>
          </div>

          {suggestion.description && (
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Descripción
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {suggestion.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Proveedor
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {suggestion.suggestedByUserName || "-"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Estado
              </span>
              <div className="mt-1">
                <Badge variant={stateInfo.variant} rounded>
                  {stateInfo.label}
                </Badge>
              </div>
            </div>
          </div>

          {suggestion.state === CategorySuggestionState.PENDING && (
            <div>
              <label
                htmlFor="adminNotes"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Notas del administrador
              </label>
              <textarea
                id="adminNotes"
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-[#1a1c23] dark:text-white"
                placeholder="Opcional: añade notas sobre esta decisión..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>
          )}

          {suggestion.state !== CategorySuggestionState.PENDING && (
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Notas del administrador
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {suggestion.adminNotes || "-"}
              </p>
            </div>
          )}

          {suggestion.reviewedByUserName && (
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Revisado por
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {suggestion.reviewedByUserName}
                {suggestion.reviewedAt
                  ? ` el ${new Date(suggestion.reviewedAt).toLocaleDateString()}`
                  : ""}
              </p>
            </div>
          )}

          {suggestion.state === CategorySuggestionState.PENDING && (
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline-secondary"
                disabled={loading}
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => setRejectDialogOpen(true)}
                className="btn btn-danger"
                disabled={loading}
              >
                Rechazar
              </button>
              <button
                type="button"
                onClick={() => setApproveDialogOpen(true)}
                className="btn btn-success"
                disabled={loading}
              >
                Aprobar
              </button>
            </div>
          )}

          {suggestion.state !== CategorySuggestionState.PENDING && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline-secondary"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </SimpleModal>

      <ConfirmationDialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        onConfirm={() => handleReview({ approved: true, adminNotes })}
        actionType="approve"
        loading={loading}
      />

      <ConfirmationDialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        onConfirm={() => handleReview({ approved: false, adminNotes })}
        customAction={{
          label: "Rechazar",
          loadingLabel: "Rechazando...",
          className: "bg-red-600 hover:bg-red-700",
          variant: "danger",
        }}
        loading={loading}
      />
    </>
  );
}
