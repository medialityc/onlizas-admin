import { Button } from "@/components/button/button";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";
import React from "react";
type Props = {
  rejectIdx: number | null;
  setRejectIdx: (idx: number | null) => void;
  rejectReason: string;
  setRejectReason: (reason: string) => void;
  rejectLoading: boolean;
  handleConfirmReject: () => void;
};
function RejectModal({
  rejectIdx,
  setRejectIdx,
  rejectReason,
  setRejectReason,
  rejectLoading,
  handleConfirmReject,
}: Props) {
  return (
    <SimpleModal
      open={rejectIdx !== null}
      onClose={() => setRejectIdx(null)}
      title="Motivo de Rechazo"
    >
      <div className="p-5 space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Describe el motivo del rechazo
        </label>
        <textarea
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Escribe el motivo..."
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" onClick={() => setRejectIdx(null)}>
            Cancelar
          </Button>
          <LoaderButton
            onClick={handleConfirmReject}
            className="btn btn-danger"
            disabled={rejectLoading || rejectReason.trim().length === 0}
          >
            Rechazar
          </LoaderButton>
        </div>
      </div>
    </SimpleModal>
  );
}

export default RejectModal;
