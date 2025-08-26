import { Button } from "@/components/button/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import InventoryVariantFrom from "../../inventory-variant-from/inventory-variant-from";

type Props = {
  storeIndex?: number;
  name?: string;
};
const StoreVariant = ({ storeIndex, name }: Props) => {
  const { control, watch } = useFormContext<any>();

  const storeName = useMemo(
    () => name || `storesWarehouses.${storeIndex}.productVariants`,
    [storeIndex, name]
  );

  const { append, remove, fields } = useFieldArray({
    control,
    name: storeName,
  });

  const features: any[] = watch("categoryFeatures");

  const handleAddVariant = useCallback(() => {
    append({
      details: features,

      //Información de Inventario
      quantity: 0,
      price: 0,
      discountType: 0,
      discountValue: 0,

      //Restricciones y Límites
      purchaseLimit: 0,
      isPrime: true,

      // Garantía
      warranty: {
        isWarranty: true,
        warrantyTime: 0,
        warrantyPrice: 0,
      },
      packageDelivery: false,
      images: [],
    });
  }, [append, features]);

  return (
    <div className="mt-1 flex flex-col gap-2">
      <div className="flex flex-row justify-between gap-2 items-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          Variantes del producto
        </h3>
        <Button
          disabled={features?.length === 0}
          variant="secondary"
          onClick={handleAddVariant}
        >
          <PlusIcon className="h-4 w-4" />
          Agregar variante
        </Button>
      </div>

      {/* lista de variantes */}
      <div className="w-full flex flex-col gap-2">
        {fields?.map((variant: any, variantIndex: number) => (
          <InventoryVariantFrom
            key={variant?.id}
            variantIndex={variantIndex}
            variantName={`${storeName}.${variantIndex}`} //variant name
            remove={remove}
          />
        ))}
      </div>
    </div>
  );
};

export default StoreVariant;
