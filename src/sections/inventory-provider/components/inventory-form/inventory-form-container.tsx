"use client";
import React from "react";
import { FormProvider } from "@/components/react-hook-form";
import { Button } from "@/components/button/button";
import LoaderButton from "@/components/loaders/loader-button";
import { useInventoryCreateForm } from "../../hooks/use-inventory-easy-create";
import InventoryForm from "./inventory-form";
import { PendingApprovalBanner } from "@/components/pending-approval-banner";

type Props = {
  provider?: string;
  onClose: () => void;
  forProvider?: boolean;
};

type InventoryProviderFormProps = Props & {
  afterCreateRedirectTo?: string;
};

const InventoryProviderForm = ({
  provider,
  onClose,
  forProvider,
  afterCreateRedirectTo,
}: InventoryProviderFormProps) => {
  const { form, isPending, onSubmit } = useInventoryCreateForm(
    { supplierId: provider },
    onClose,
    { afterCreateRedirectTo },
  );

  return (
    <section>
      <PendingApprovalBanner />
      <FormProvider methods={form} onSubmit={onSubmit}>
        <InventoryForm provider={provider} forProvider={forProvider} />
        {/* Botones de acción */}
        <div className="flex gap-4 pt-6 mt-6  justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <LoaderButton type="submit" loading={isPending} disabled={isPending}>
            Crear Inventario
          </LoaderButton>
        </div>
      </FormProvider>
    </section>
  );
};

export default InventoryProviderForm;
