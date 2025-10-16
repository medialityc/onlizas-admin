"use client";
import React, { useCallback } from "react";
import { FormProvider } from "@/components/react-hook-form";
import { useRouter } from "next/navigation";
import { useInventoryProviderEditForm } from "../../hooks/use-inventory-provider-edit-form";
import InventoryEditVariantContent from "./inventory-edit-variant-content";
import { ProductVariant } from "../../schemas/inventory-provider.schema";

type Props = {
  initValue?: ProductVariant;
  userProvider?: string;
  inventoryId?: string;
  index?: number;
  onRemove: () => void;
  isPacking: boolean;
};

const InventoryEditForm = ({
  initValue,
  userProvider,
  inventoryId,
  index,
  onRemove,
  isPacking,
}: Props) => {
  const { push } = useRouter();
  const handleCancel = useCallback(
    () => push(`/dashboard/inventory/list/${userProvider}`),
    [push, userProvider]
  );

  const { form, isPending, onSubmit } = useInventoryProviderEditForm(
    initValue,
    handleCancel,
    inventoryId ?? ""
  );

  return (
    <section>
      {/* details */}
      <FormProvider methods={form} onSubmit={onSubmit}>
        <InventoryEditVariantContent
          onRemove={onRemove}
          index={index}
          isPending={isPending}
          isPacking={isPacking}
        />
      </FormProvider>
    </section>
  );
};

export default InventoryEditForm;
