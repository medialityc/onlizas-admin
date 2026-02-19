"use client";
import React from "react";
import { FormProvider } from "@/components/react-hook-form";
import { Button } from "@/components/button/button";
import LoaderButton from "@/components/loaders/loader-button";
import { useInventoryCreateForm } from "../../hooks/use-inventory-easy-create";
import InventoryForm from "./inventory-form";

type Props = {
  provider?: string;
  onClose: () => void;
  forProvider?: boolean;
};

const InventoryProviderForm = ({ provider, onClose, forProvider }: Props) => {
  const { form, isPending, onSubmit } = useInventoryCreateForm(
    { supplierId: provider },
    onClose,
  );

  return (
    <section>
      <FormProvider methods={form} onSubmit={onSubmit}>
        <InventoryForm provider={provider} forProvider={forProvider} />
        {/* Botones de acción */}
        <div className="flex gap-4 pt-6 mt-6 border-t justify-end">
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
