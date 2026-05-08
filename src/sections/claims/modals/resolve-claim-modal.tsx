"use client";

import { useState } from "react";
import SimpleModal from "@/components/modal/modal";
import ConfirmationDialog from "@/components/modal/confirm-modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import Badge from "@/components/badge/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Claim, ResolveClaimPayload } from "@/types/claims";
import { resolveClaim } from "@/services/claims";
import {
  resolveClaimSchema,
  ResolveClaimFormData,
} from "../schemas/claims-schema";
import { ClaimStatus, statusVariantMap } from "../constants/claim-status";
import { typeLabelMap } from "../constants/claim-type";

interface Props {
  open: boolean;
  onClose: () => void;
  claim?: Claim | null;
  onSuccess?: () => void;
}

export default function ResolveClaimModal({
  open,
  onClose,
  claim,
  onSuccess,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const methods = useForm<ResolveClaimFormData>({
    resolver: zodResolver(resolveClaimSchema),
    defaultValues: {
      favorClient: "true",
      resolutionNotes: "",
    },
  });

  const { reset, handleSubmit, trigger } = methods;

  const handleClose = () => {
    reset();
    setConfirmOpen(false);
    onClose();
  };

  const handleOpenConfirm = async () => {
    const isValid = await trigger();
    if (isValid) setConfirmOpen(true);
  };

  const submit = async (data: ResolveClaimFormData) => {
    if (!claim) return;
    setLoading(true);
    try {
      const payload: ResolveClaimPayload = {
        claimId: claim.id,
        favorClient: data.favorClient === "true",
        resolutionNotes: data.resolutionNotes,
      };
      const res = await resolveClaim(claim.id, payload);
      if (!res.error) {
        toast.success("Reclamación resuelta correctamente");
        onSuccess?.();
        handleClose();
      } else {
        toast.error(res.message || "No se pudo resolver la reclamación");
      }
    } catch {
      toast.error("Error resolviendo la reclamación");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  if (!claim) return null;

  return (
    <>
      <SimpleModal
        open={open}
        onClose={handleClose}
        title="Resolver reclamación"
        size="md"
      >
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Cliente
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {claim.customerId}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Proveedor
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {claim.supplierId}
              </p>
            </div>
          </div>

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
                Monto reclamado
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {claim.claimedAmount}
              </p>
            </div>
          </div>

          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Descripción
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {claim.description}
            </p>
          </div>

          {claim.status !== ClaimStatus.PENDING && (
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          )}

          {claim.status !== ClaimStatus.PENDING && claim.resolutionNotes && (
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Notas de resolución
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {claim.resolutionNotes}
              </p>
            </div>
          )}

          {claim.status === ClaimStatus.PENDING && (
            <FormProvider methods={methods} onSubmit={submit}>
              <div className="space-y-4 pt-2">
                <RHFSelectWithLabel
                  name="favorClient"
                  label="Resolución"
                  required
                  options={[
                    { value: "true", label: "A favor del cliente" },
                    { value: "false", label: "A favor del proveedor" },
                  ]}
                />
                <RHFInputWithLabel
                  name="resolutionNotes"
                  label="Notas de resolución"
                  type="textarea"
                  placeholder="Opcional: añade notas sobre esta resolución..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-outline-secondary"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleOpenConfirm}
                  className="btn btn-success"
                  disabled={loading}
                >
                  Resolver
                </button>
              </div>
            </FormProvider>
          )}

          {claim.status !== ClaimStatus.PENDING && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-outline-secondary"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </SimpleModal>

      {claim.status === ClaimStatus.PENDING && (
        <ConfirmationDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleSubmit(submit)}
          actionType="confirm"
          title="¿Confirmar resolución?"
          description="Esta acción resolverá la reclamación de forma definitiva."
          loading={loading}
        />
      )}
    </>
  );
}
