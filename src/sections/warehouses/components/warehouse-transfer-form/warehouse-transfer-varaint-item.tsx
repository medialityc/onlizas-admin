import React, { useMemo, useCallback } from "react";
import Image from "next/image";
import Badge from "@/components/badge/badge";
import { InventoryProductItem } from "@/services/inventory-providers";
import { detailsObjectToArray } from "@/utils/format";

type Props = {
  variant: InventoryProductItem;
  isSelected: boolean;
  onToggleSelect: (variant: InventoryProductItem) => void;
};

// Componente ProductVariantCard modificado con checkbox
const ProductTransferVariantCard = ({
  variant,
  isSelected,
  onToggleSelect,
}: Props) => {
  const variantDetails = useMemo(() => {
    if (typeof variant?.details === "object") {
      return detailsObjectToArray(variant.details);
    }
    return variant.details;
  }, [variant.details]);

  const handleCheckboxChange = useCallback(() => {
    onToggleSelect(variant);
  }, [variant, onToggleSelect]);

  return (
    <div
      className={`bg-gray-50 dark:bg-gray-700/60 rounded-lg p-2 border transition-all ${
        isSelected
          ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-100 dark:border-gray-600"
      }`}
    >
      <div className="flex flex-row gap-2 items-start">
        {/* Checkbox para selección */}
        <div className="flex items-center mt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div className="object-contain w-14 h-14 bg-slate-100 border dark:border-slate-700 dark:bg-slate-700 rounded-md overflow-hidden relative">
          <Image
            src={
              variant?.images?.[0] || "/assets/images/placeholder-product.webp"
            }
            alt={variant?.productName}
            fill
          />
        </div>

        <div className="flex w-full gap-1 flex-1 flex-wrap xl:flex-row justify-between font-medium text-gray-900 dark:text-white">
          <div className="flex flex-col gap-2 items-start">
            <h5 className="text-lg leading-none">{variant.productName}</h5>
            <Badge variant="outline-secondary">
              Cantidad: {variant.quantity || 0}
            </Badge>
            {variant.storeName && (
              <Badge variant="outline-primary">
                Tienda: {variant.storeName}
              </Badge>
            )}
          </div>
          <div className="flex flex-row gap-1 items-center mb-auto">
            <span className="font-bold">Precio:</span> ${variant.price}
            {variant.discountedPrice && (
              <Badge variant="danger" className="m-0">
                {variant.discountedPrice || 0}
                {variant?.discountType === 0 ? "%" : "$"}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 text-xs flex flex-wrap gap-2 text-gray-600 dark:text-gray-300">
        {variant.details &&
          variantDetails?.map((detail) => (
            <Badge
              className="!bg-transparent !text-gray-900 dark:!text-gray-100 border border-gray-900 dark:!border-gray-100"
              key={detail.key}
            >
              {detail.key}: {detail.value}
            </Badge>
          ))}
      </div>
    </div>
  );
};

export default ProductTransferVariantCard;
