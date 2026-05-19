"use client";

import SimpleModal from "@/components/modal/modal";
import { Button } from "@/components/button/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  rejectWholesaleBuyer,
  revokeWholesaleBuyer,
} from "@/services/wholesale-buyers";
import showToast from "@/config/toast/toastConfig";
import { WholesaleBuyerDTO } from "@/types/wholesale-buyers";

interface Props {
  open: boolean;
  onClose: () => void;
  buyer: WholesaleBuyerDTO;
  mode: "reject" | "revoke";
}

export default function RejectRevokeWholesaleBuyerModal({
  open,
  onClose,
  buyer,
  mode,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const router = useRouter();

  const isRevoke = mode === "revoke";
  const title = isRevoke
    ? "Revocar acceso mayorista"
    : "Rechazar solicitud mayorista";
  const actionLabel = isRevoke ? "Revocar" : "Rechazar";

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { rejectionReason: reason || null };
      const res = isRevoke
        ? await revokeWholesaleBuyer(buyer.id, payload)
        : await rejectWholesaleBuyer(buyer.id, payload);

      if (res.error) {
        showToast(
          res.message ||
            `Error al ${isRevoke ? "revocar" : "rechazar"} la solicitud`,
          "error",
        );
        return;
      }

      showToast(
        isRevoke
          ? "Acceso revocado correctamente"
          : "Solicitud rechazada correctamente",
        "success",
      );
      router.refresh();
      onClose();
    } catch {
      showToast("Ocurrió un error, intente nuevamente", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={`${buyer.userName} — ${buyer.businessName}`}
      size="sm"
    >
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Motivo {isRevoke ? "de revocación" : "de rechazo"} (opcional)
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            rows={3}
            placeholder="Ingrese el motivo..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant={isRevoke ? "outline" : "destructive"}
            loading={loading}
            onClick={handleSubmit}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </SimpleModal>
  );
}
