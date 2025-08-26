"use client";
import React, { useCallback } from "react";
import { FormProvider } from "@/components/react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button/button";
import { useRouter } from "next/navigation";
import LoaderButton from "@/components/loaders/loader-button";
import { IUserProvider } from "@/types/users";
import { useInventoryProviderEditForm } from "../../hooks/use-inventory-provider-edit-form";
import InventoryHeader from "./inventory-info";
import { InventoryStoreFormData } from "../../schemas/inventory-edit.schema";
import InventoryEditVariantContent from "./inventory-edit-variant-content";

type Props = {
  initValue?: InventoryStoreFormData;
  userProvider?: IUserProvider;
};

const InventoryEditForm = ({ initValue, userProvider }: Props) => {
  const { push } = useRouter();
  const handleCancel = useCallback(
    () => push(`/dashboard/inventory/${userProvider?.id}/list`),
    [push, userProvider?.id]
  );

  const { form, isPending, onSubmit } = useInventoryProviderEditForm(
    initValue,
    handleCancel
  );

  return (
    <section>
      {/* details */}
      <InventoryHeader inventory={initValue as InventoryStoreFormData} />
      <FormProvider
        methods={form}
        onSubmit={onSubmit}
        id="inventory-provider-edit-form"
      >
        <InventoryEditVariantContent />
      </FormProvider>
      {/* Botones de acción */}
      <div className={cn("flex gap-4 pt-6 mt-6 border-t justify-end")}>
        <Button
          type="button"
          variant="secondary"
          outline
          onClick={handleCancel}
        >
          Cancelar
        </Button>
        <LoaderButton
          form="inventory-provider-edit-form"
          type="submit"
          loading={isPending}
          disabled={isPending}
        >
          {"Editar Inventario"}
        </LoaderButton>
      </div>
    </section>
  );
};

export default InventoryEditForm;
