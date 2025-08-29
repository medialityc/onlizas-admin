import Badge from "@/components/badge/badge";
import { InventoryProductItem } from "@/services/inventory-providers";
import { detailsObjectToArray } from "@/utils/format";
import Image from "next/image";
import React, { useMemo } from "react";

type Props = {
  variant: InventoryProductItem;
};
const ProductVariantCard = ({ variant }: Props) => {
  const variantDetails = useMemo(() => {
    if (typeof variant?.details === "object") {
      return detailsObjectToArray(variant.details);
    }
    return variant.details;
  }, [variant.details]);

  return (
    <div className="bg-gray-50 dark:bg-gray-700/60 rounded-lg p-2 border border-gray-100 dark:border-gray-600">
      <div className="flex flex-row gap-2 items-start">
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
      <div className=" mt-2 text-xs flex flex-wrap gap-2 text-gray-600 dark:text-gray-300">
        {variant.details &&
          variantDetails?.map((detail) => (
            <Badge
              className="!bg-transparent !text-gray-900 dark:!text-gray-100 border border-gray-900 dark:!border-gray-100"
              key={detail.key}
            >
              ${detail.key}: {detail.value}
            </Badge>
          ))}
      </div>
    </div>
  );
};

export default ProductVariantCard;
