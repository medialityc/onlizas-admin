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
import { Store } from "@/types/stores";
import StoresCheck from "./stores-check/stores-check";
import ProductSupplierSection from "./product-suppliers-section";

type Props = {
  initValue?: InventoryProviderFormData;
  userProvider?: IUserProvider;
  stores: Store[];
};

const InventoryProviderForm = ({ initValue, userProvider, stores }: Props) => {
  const { form, isPending, onSubmit } =
    useInventoryProviderCreateForm(initValue);
  const { push } = useRouter();

  const handleCancel = useCallback(
    () => push(`/dashboard/inventory/${userProvider?.id}/list`),
    [push, userProvider?.id]
  );

  return (
    <section>
      <FormProvider methods={form} onSubmit={onSubmit} id="inventory-provider-form">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-4">
          <div className="col-span-1 lg:col-span-2">
            <ProductSupplierSection supplierId={userProvider?.id as number} />
          </div>
          <div className="col-span-1 lg:col-span-2">
            <StoresCheck control={form.control} stores={stores} name="storesWarehouses"/>
          </div>
        </div>
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
          form="inventory-provider-form"
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
