"use client";

import SimpleModal from "@/components/modal/modal";
import Badge from "@/components/badge/badge";
import { Claim } from "@/types/claims";
import { ClaimStatus, statusVariantMap } from "../constants/claim-status";
import { typeLabelMap } from "../constants/claim-type";

interface Props {
  open: boolean;
  onClose: () => void;
  claim?: Claim | null;
}

export default function ViewClaimModal({ open, onClose, claim }: Props) {
  if (!claim) return null;

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title="Detalles de la reclamación"
      size="md"
    >
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Tipo
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {typeLabelMap[claim.type]}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Estado
            </span>
            <div className="mt-1">
              <Badge variant={statusVariantMap[claim.status].variant} rounded>
                {statusVariantMap[claim.status].label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Monto reclamado
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              ${claim.claimedAmount}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Fecha de creación
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {claim.createdAt
                ? new Date(claim.createdAt).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>

        {claim.resolvedAt && (
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Fecha de resolución
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {new Date(claim.resolvedAt).toLocaleDateString()}
            </p>
          </div>
        )}

        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Descripción
          </span>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            {claim.description}
          </p>
        </div>

        {claim.status !== ClaimStatus.PENDING && claim.resolutionNotes && (
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Notas de resolución
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {claim.resolutionNotes}
            </p>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline-secondary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
