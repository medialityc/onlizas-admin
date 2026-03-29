"use client";
import { FormProvider } from "@/components/react-hook-form";
import { useInventoryProviderEditForm } from "../../hooks/use-inventory-provider-edit-form";
import InventoryEditVariantContent from "./inventory-edit-variant-content";
import { ProductVariant } from "../../schemas/inventory-provider.schema";

type Props = {
  initValue?: ProductVariant;
  allVariants?: ProductVariant[];
  inventoryId?: string;
  index?: number;
  supplierId?: string;
  isPacking: boolean;
  handleClose: () => void;
};

const InventoryEditForm = ({
  initValue,
  allVariants = [],
  inventoryId,
  index,
  supplierId,
  isPacking,
  handleClose,
}: Props) => {
  const { form, isPending, reset, onSubmit } = useInventoryProviderEditForm(
    initValue,
    inventoryId as string,
    allVariants,
    handleClose,
  );

  return (
    <section>
      {/* details */}
      <FormProvider methods={{ ...form, reset }} onSubmit={onSubmit}>
        <InventoryEditVariantContent
          index={index}
          isPending={isPending}
          isPacking={isPacking}
          supplierId={supplierId}
          handleClose={handleClose}
        />
      </FormProvider>
    </section>
  );
};

export default InventoryEditForm;
