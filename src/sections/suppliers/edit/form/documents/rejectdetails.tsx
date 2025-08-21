import SimpleModal from "@/components/modal/modal";
import React from "react";

type Props = {
  viewReasonIdx: number | null;
  setViewReasonIdx: (idx: number | null) => void;
  getValues: (path: string) => any;
};

function RejectDetails({ viewReasonIdx, setViewReasonIdx, getValues }: Props) {
  return (
    <SimpleModal
      open={viewReasonIdx !== null}
      onClose={() => setViewReasonIdx(null)}
      loading={false}
      title="Motivo del Rechazo"
    >
      <div className="p-5 space-y-4">
        <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
          {(() => {
            if (viewReasonIdx === null) return "";
            const item = getValues(`pendingDocuments.${viewReasonIdx}`) as
              | { rejectionReason?: string | null }
              | undefined;
            return item?.rejectionReason || "Sin motivo";
          })()}
        </p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setViewReasonIdx(null)}
            className="btn btn-primary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}

export default RejectDetails;
