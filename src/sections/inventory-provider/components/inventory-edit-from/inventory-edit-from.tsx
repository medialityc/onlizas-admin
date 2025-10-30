"use client";
import { FormProvider } from "@/components/react-hook-form";
import { useInventoryProviderEditForm } from "../../hooks/use-inventory-provider-edit-form";
import InventoryEditVariantContent from "./inventory-edit-variant-content";
import { ProductVariant } from "../../schemas/inventory-provider.schema";
import { useInventoryVariantDelete } from "../../hooks/use-inventory-variant-delete";

type Props = {
  initValue?: ProductVariant;
  supplierId?: string;
  inventoryId?: string;
  index?: number;
  isPacking: boolean;
  onRemove: () => void;
};

const InventoryEditForm = ({
  initValue,
  inventoryId,
  index,
  isPacking,
  onRemove,
}: Props) => {
  const { form, isPending, onSubmit } = useInventoryProviderEditForm(
    initValue,
    inventoryId as string
  );

  const { onDelete, isPending: isDeleting } = useInventoryVariantDelete(
    inventoryId as string
  );

  return (
    <section>
      {/* details */}
      <FormProvider methods={form} onSubmit={onSubmit}>
        <InventoryEditVariantContent
          onDelete={async () => {
            try {
              await onDelete(initValue?.id as string);
              // after successful delete, call onRemove to remove from UI
              onRemove();
            } catch (err) {
              // error handling is done in the hook
            }
          }}
          onRemove={onRemove}
          index={index}
          isPending={isPending}
          isPacking={isPacking}
          deleteLoading={isDeleting}
        />
      </FormProvider>
    </section>
  );
};

export default InventoryEditForm;
