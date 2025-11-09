"use client";
import { useEffect, useState } from "react";
import BadgeUI from "@/components/badge/badge";
import StatusBadge from "@/components/badge/status-badge";
import { getErrorMessage } from "@/lib/api";
import showToast from "@/config/toast/toastConfig";
import {
  submitExternalApprovalDecision,
  ExternalReviewApprovalProcessResponse,
} from "@/services/external-review";
import { useRouter } from "next/navigation";
import Metric from "./components/metric";
import DocumentsSection from "./components/documents-section";
import CategoriesSection from "./components/categories-section";
import ActionButton from "./components/action-button";
import TerminalMessage from "./components/terminal-message";
import EntityDetails from "./components/entity-details";

// Nuevo contrato ApprovalProcess external review
export interface ExternalReviewEntityDetails {
  name: string;
  email: string;
  state: string;
  isApproved: boolean;
  approvedAt: string | null;
  type?: string;
  sellerType?: string;
  nacionality?: string;
  expirationDate?: string;
  currentRating?: number;
  evaluationCount?: number;
  approvedCategoriesCount?: number;
  requestedCategoriesCount?: number;
}

interface Props {
  token: string;
  data: ExternalReviewApprovalProcessResponse;
}

export default function ExternalReviewClient({ token, data }: Props) {
  const [commentValue, setCommentValue] = useState("");
  const [actionStatus, setActionStatus] = useState<"idle" | "submitting">(
    "idle"
  );
  const router = useRouter();

  // Redirigir si el proceso ya está aprobado y token no activo
  useEffect(() => {
    if (data.approvalProcess.isAproved && data.tokenStatus !== "ACTIVE") {
      router.replace("/external-review/success");
    }
  }, [data.approvalProcess.isAproved, data.tokenStatus, router]);

  async function submitAction(action: "approve" | "reject") {
    if (action === "reject" && !commentValue.trim()) {
      showToast("Agrega un comentario para rechazo", "error");
      return;
    }
    setActionStatus("submitting");
    try {
      const approve = action === "approve";
      const res = await submitExternalApprovalDecision({
        token,
        approve,
        comment:
          commentValue.trim() || (approve ? undefined : "Sin comentario"),
        reviewerEmail: "externo@dominio.com",
        reviewerName: undefined,
      });
      if (res.error || !res.data) {
        if (/404|not found/i.test(res.message || ""))
          showToast(res.message || "La acción no pudo completarse", "error");
        return;
      }
      showToast(res.data.message, "success");
      if (approve) {
        // En aprobación exitosa redirigimos inmediatamente a página de éxito
        router.replace("/external-review/success");
        return;
      }
      setCommentValue("");
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
    setActionStatus("idle");
  }

  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto">
      <header className="space-y-4">
        <div className="rounded-xl border bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-5 shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">
                  Revisión de Solicitud para proveedor
                </h1>
                <p className="text-xs text-gray-500">
                  Token expira: {new Date(data.tokenExpiresAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                <StatusBadge
                  active={data.tokenStatus === "ACTIVE"}
                  activeText="Activo"
                  inactiveText={data.tokenStatus}
                />
                {data.tokenSingleUse && (
                  <BadgeUI variant="outline-info" className="text-xs">
                    Single Use
                  </BadgeUI>
                )}
                <BadgeUI variant="outline-dark" className="text-xs">
                  Usos {data.tokenUses}/{data.tokenMaxUses ?? "—"}
                </BadgeUI>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <Metric label="Estado Token" value={data.tokenStatus} />
              <Metric label="Proceso ID" value={data.approvalProcess.id} />
              <Metric
                label="Docs Pend."
                value={data.approvalProcess.pendingDocuments.length}
              />
              <Metric
                label="Docs Aprob."
                value={data.approvalProcess.approvedDocuments.length}
              />
            </div>
          </div>
        </div>
      </header>

      <EntityDetails
        details={{
          name: data.approvalProcess.name,
          email: data.approvalProcess.email,
          state: data.approvalProcess.state,
          isApproved: data.approvalProcess.isAproved,
          approvedAt: null,
          type: data.approvalProcess.type,
          sellerType: data.approvalProcess.sellerType,
          nacionality: data.approvalProcess.nacionality,
          expirationDate: data.approvalProcess.expirationDate,
          currentRating: undefined,
          evaluationCount: undefined,
          approvedCategoriesCount:
            data.approvalProcess.approvedCategories.length,
          requestedCategoriesCount:
            data.approvalProcess.pendingCategories.length,
        }}
      />

      <DocumentsSection
        title="Documentos Pendientes"
        docs={data.approvalProcess.pendingDocuments}
        empty="No hay documentos pendientes"
      />
      <DocumentsSection
        title="Documentos Aprobados"
        docs={data.approvalProcess.approvedDocuments}
        empty="No hay documentos aprobados"
      />
      <CategoriesSection
        title="Categorías Pendientes"
        categories={data.approvalProcess.pendingCategories}
        empty="No hay categorías pendientes"
      />
      <CategoriesSection
        title="Categorías Aprobadas"
        categories={data.approvalProcess.approvedCategories}
        empty="No hay categorías aprobadas"
      />

      {data.tokenStatus === "ACTIVE" ? (
        <section className="space-y-4 rounded-xl border bg-white dark:bg-gray-900 shadow-sm p-5">
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-200">
            Decisión del Proceso
          </h2>
          <div className="space-y-2">
            <label
              htmlFor="comment"
              className="block text-xs font-medium text-gray-600 dark:text-gray-300"
            >
              Comentario (requerido si rechazas)
            </label>
            <textarea
              id="comment"
              className="w-full border rounded-lg p-3 text-sm bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              rows={4}
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              placeholder="Escribe tu comentario…"
              maxLength={500}
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>{commentValue.length}/500</span>
              {commentValue.length > 450 && (
                <span className="text-red-500">Límite cercano</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionButton
              variant="approve"
              loading={actionStatus === "submitting"}
              onClick={() => submitAction("approve")}
            >
              Aprobar
            </ActionButton>
            <ActionButton
              variant="reject"
              loading={actionStatus === "submitting"}
              onClick={() => submitAction("reject")}
            >
              Rechazar
            </ActionButton>
          </div>
          <div aria-live="polite" className="min-h-[1.25rem]" />
        </section>
      ) : (
        <TerminalMessage
          status={data.tokenStatus}
          entity={{
            name: data.approvalProcess.name,
            email: data.approvalProcess.email,
            state: data.approvalProcess.state,
            isApproved: data.approvalProcess.isAproved,
            approvedAt: null,
          }}
        />
      )}
    </div>
  );
}

// Sección de Documentos

// Sección de Categorías
