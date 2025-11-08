"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { generateExternalReviewToken } from "@/services/external-review";
import { toast } from "react-toastify";
import { useModalState } from "@/hooks/use-modal-state";
import SimpleModal from "@/components/modal/modal";

interface Props {
  approvalProcessId: string;
}

type Step = "form" | "result";

interface ParameterSummaryProps {
  singleUse: boolean;
  maxUses: number | "";
  expiryMinutes: number | "";
  mode: "form" | "result";
}

function ParameterSummary({
  singleUse,
  maxUses,
  expiryMinutes,
  mode,
}: ParameterSummaryProps) {
  const label = mode === "form" ? "Resumen:" : "Configuración:";
  return (
    <div className="text-[11px] text-gray-400 space-y-1">
      <p>
        <span className="font-medium">{label}</span>{" "}
        {singleUse
          ? "Un solo uso"
          : `Multi-uso${typeof maxUses === "number" ? ` (máx ${maxUses})` : ""}`}
      </p>
      {typeof expiryMinutes === "number" && expiryMinutes > 0 ? (
        <p>Expira en {expiryMinutes} min</p>
      ) : (
        <p>Expiración por defecto{mode === "form" ? " del sistema" : ""}</p>
      )}
    </div>
  );
}

export default function ExternalReviewTokenModal({ approvalProcessId }: Props) {
  const { getModalState, closeModal } = useModalState();
  const modalState = getModalState("external-review-token");
  const [step, setStep] = useState<Step>("form");
  const [singleUse, setSingleUse] = useState(true);
  const [maxUses, setMaxUses] = useState<number | "">("");
  const [expiryMinutes, setExpiryMinutes] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [tokenLink, setTokenLink] = useState<string>("");
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(
    document.activeElement as HTMLElement
  );
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  // Simplified reset using confirmation modal instead of inline state toggle
  const requestRegenerate = useCallback(() => {
    setConfirmRegenerate(true);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!singleUse && (typeof maxUses !== "number" || maxUses <= 0)) {
      toast.error("Ingresa un número válido de usos máximos");
      return;
    }
    if (typeof expiryMinutes === "number" && expiryMinutes <= 0) {
      toast.error("Minutos de expiración deben ser mayores que 0");
      return;
    }
    setLoading(true);
    try {
      const res = await generateExternalReviewToken(approvalProcessId, {
        singleUse,
        maxUses: singleUse
          ? undefined
          : typeof maxUses === "number"
            ? maxUses
            : undefined,
        expiryMinutes:
          typeof expiryMinutes === "number" ? expiryMinutes : undefined,
      });
      if (res.error || !res.data?.token) {
        toast.error(res.message || "No se pudo generar el token");
        setLoading(false);
        return;
      }
      const link = `${window.location.origin}/external-review/${res.data.token}`;
      setTokenLink(link);
      setStep("result");
      try {
        await navigator.clipboard.writeText(link);
        toast.success("Link copiado al portapapeles");
      } catch {
        toast.info("Token generado. Copia manualmente si lo necesitas.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error al generar token");
    }
    setLoading(false);
  }

  function performRegenerate() {
    setConfirmRegenerate(false);
    setStep("form");
    setTokenLink("");
  }

  return (
    <SimpleModal
      open={modalState.open}
      onClose={() => {
        setConfirmRegenerate(false);
        closeModal("external-review-token");
      }}
      title="Generar Token de Revisión Externa"
      subtitle="Configura parámetros opcionales antes de generar el enlace."
      className=""
      footer={
        step === "result" ? (
          <div className="flex justify-between gap-2">
            <button
              type="button"
              onClick={requestRegenerate}
              className="px-3 py-2 text-xs rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Regenerar
            </button>
            <button
              type="button"
              onClick={() => closeModal("external-review-token")}
              className="px-3 py-2 text-xs rounded bg-indigo-600 text-white"
            >
              Cerrar
            </button>
          </div>
        ) : null
      }
    >
      <div className="space-y-6">
        {step === "form" ? (
          <form onSubmit={submit} className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                id="singleUse"
                type="checkbox"
                checked={singleUse}
                onChange={(e) => {
                  setSingleUse(e.target.checked);
                  if (e.target.checked) setMaxUses("");
                }}
                className="rounded border-gray-300 dark:border-gray-600"
                ref={firstFieldRef}
              />
              <label htmlFor="singleUse" className="text-sm">
                Un solo uso
              </label>
            </div>
            {!singleUse && (
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Máx. usos</label>
                <input
                  type="number"
                  min={1}
                  value={maxUses}
                  onChange={(e) =>
                    setMaxUses(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full px-3 py-2 rounded border text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  placeholder="Ej: 5"
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs text-gray-500">
                Expira en (minutos) - opcional
              </label>
              <input
                type="number"
                min={1}
                value={expiryMinutes}
                onChange={(e) =>
                  setExpiryMinutes(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full px-3 py-2 rounded border text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                placeholder="Default"
              />
            </div>
            <ParameterSummary
              singleUse={singleUse}
              maxUses={maxUses}
              expiryMinutes={expiryMinutes}
              mode="form"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => closeModal("external-review-token")}
                className="px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm rounded bg-indigo-600 text-white disabled:opacity-50"
              >
                {loading ? "Generando…" : "Generar"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-sm">
              <p className="font-medium">Token generado</p>
              <p className="text-xs text-gray-500">
                Comparte este enlace sólo con el revisor externo.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={tokenLink}
                className="flex-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 font-mono"
              />
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(tokenLink);
                    toast.success("Copiado");
                  } catch {
                    toast.error("No se pudo copiar");
                  }
                }}
                className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Copiar
              </button>
            </div>
            <ParameterSummary
              singleUse={singleUse}
              maxUses={maxUses}
              expiryMinutes={expiryMinutes}
              mode="result"
            />
          </div>
        )}
        {confirmRegenerate && step === "result" && (
          <div className="mt-2 p-3 rounded border border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 space-y-2">
            <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium">
              ¿Regenerar el token? El enlace actual dejará de ser válido una vez
              se use el nuevo.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setConfirmRegenerate(false)}
                className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={performRegenerate}
                className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </SimpleModal>
  );
}
