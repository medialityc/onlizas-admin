"use client";
import React from "react";
import { FormProvider } from "@/components/react-hook-form";
import { Button } from "@/components/button/button";
import LoaderButton from "@/components/loaders/loader-button";
import { useInventoryCreateForm } from "../../hooks/use-inventory-easy-create";
import InventoryForm from "./inventory-form";
import { usePermissions } from "zas-sso-client";

type Props = {
  provider?: number;
  onClose: () => void;
};

const InventoryProviderForm = ({ provider, onClose }: Props) => {
  const { form, isPending, onSubmit } = useInventoryCreateForm(
    { supplierId: provider },
    onClose
  );

  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every((perm) =>
      permissions.some((p) => p.code === perm)
    );
  };
  const canCreate = hasPermission(["Create"]);

  return (
    <section>
      <FormProvider methods={form} onSubmit={onSubmit}>
        <InventoryForm provider={provider} />
        {/* Botones de acción */}
        <div className="flex gap-4 pt-6 mt-6 border-t justify-end">
          <Button type="button" variant="secondary" outline onClick={onClose}>
            Cancelar
          </Button>
          {canCreate && (
            <LoaderButton type="submit" loading={isPending} disabled={isPending}>
              Crear Inventario
            </LoaderButton>
          )}
        </div>
      </FormProvider>
    </section>
  );
};

export default InventoryProviderForm;
