"use client";

import { useState } from "react";
import { FormProvider } from "react-hook-form";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";

import { WarehouseVirtualTypeFormData } from "../schemas/warehouse-virtual-type-schema";
import { useWarehouseVirtualTypeCreateForm } from "../hooks/use-warehouse-virtual-type-create-form";
import { usePermissions } from "zas-sso-client";

interface Props {
  open: boolean;
  onClose: () => void;
  initValue?: WarehouseVirtualTypeFormData;
  isDetailsView?: boolean;
  loading?: boolean;
}

export default function WarehouseVirtualTypeModal({
  open,
  onClose,
  initValue,
  isDetailsView = false,
  loading,
}: Props) {
  const [error, setError] = useState<string | null>(null);

  // Control de permisos
  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every((perm) =>
      permissions.some((p) => p.code === perm)
    );
  };
  const canSave = initValue?.id ? hasPermission(["Update"]) : hasPermission(["Create"]);

  const { form, isPending, onSubmit } = useWarehouseVirtualTypeCreateForm(
    initValue,
    onClose
  );

  const handleClose = () => {
    form.reset();
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading}
      title={
        initValue
          ? "Editar Tipo de almacén virtual"
          : "Crear Tipo de almacén virtual"
      }
    >
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}

        <FormProvider {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Primera fila: Código y Nombre */}
            <div className="grid grid-cols-1  gap-4">
              <RHFInputWithLabel
                name="name"
                label="Nombre"
                placeholder="Nombre del negocio"
                required
                disabled={isDetailsView}
              />
            </div>
            <div className="grid grid-cols-1  gap-4">
              <RHFInputWithLabel
                name="defaultRules"
                label="Regla"
                placeholder="Escribe una regla"
                required
                disabled={isDetailsView}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-outline-secondary"
                disabled={isPending}
              >
                Cancelar
              </button>
              <LoaderButton
                type="submit"
                loading={isPending}
                className="btn btn-primary "
                disabled={isPending || !canSave}
              >
                {initValue?.id ? "Guardar Cambios" : "Crear Tipo"}
              </LoaderButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
