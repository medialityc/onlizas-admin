"use client";
import React, { useCallback } from "react";
import { FormProvider } from "@/components/react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button/button";
import { useRouter } from "next/navigation";
import LoaderButton from "@/components/loaders/loader-button";
import { InventoryProviderFormData } from "../../schemas/inventory-provider.schema";
import { useInventoryProviderCreateForm } from "../../hooks/use-inventory-provider-create-form";
import { IUserProvider } from "@/types/users";

type Props = {
  initValue?: InventoryProviderFormData;
  userProvider?: IUserProvider;
};

const InventoryProviderForm = ({ initValue, userProvider }: Props) => {
  const { form, isPending, onSubmit } =
    useInventoryProviderCreateForm(initValue);
  const { push } = useRouter();

  const handleCancel = useCallback(
    () => push(`/dashboard/inventory/${userProvider?.id}/inventory/`),
    [push, userProvider?.id]
  );

  return (
    <section>
      <FormProvider methods={form} onSubmit={onSubmit} id="product-form">
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-2 md:gap-4"></div>
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
          form="product-form"
          type="submit"
          loading={isPending}
          disabled={isPending}
        >
          {"Crear Inventario"}
        </LoaderButton>
      </div>
    </section>
  );
};

export default InventoryProviderForm;
