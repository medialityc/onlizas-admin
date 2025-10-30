"use client";
import React from "react";
import EditHeader from "../components/inventory-edit-from/edit-header";
import { IUser } from "@/types/users";
import { InventoryStoreFormData } from "../schemas/inventory-edit.schema";
import InventoryEditForm from "../components/inventory-edit-from/inventory-edit-from";
import { CategoryFeature } from "@/types/products";
import { getCategoryFeature } from "../constants/category-feature";
import { FeatureFormData } from "@/sections/categories/schemas/category-schema";

type Props = {
  inventory: InventoryStoreFormData;
  features: CategoryFeature[];
};
function EditContainer({ inventory, features }: Props) {
  const [variants, setVariants] = React.useState(inventory.products);
  const featuresNormalized: Record<
    string,
    { value: string; isRequired?: boolean }
  > = Object.fromEntries(
    getCategoryFeature(features as unknown as FeatureFormData[]).map(
      (feature: any) => {
        const val = {
          value: feature?.value ?? "",
          isRequired: feature?.isRequired,
          featureDescription: feature?.featureDescription,
          suggestions: feature?.suggestions ?? [],
        };

        return [feature?.name ?? "", val];
      }
    )
  );

  const handleAddVariant = () => {
    setVariants([
      {
        sku: "",
        details: featuresNormalized,
        isActive: true,
        stock: 0,
        price: 0,
        purchaseLimit: 0,
        isPrime: false,
        warranty: {
          isWarranty: false,
          warrantyTime: 0,
          warrantyPrice: 0,
        },
        packageDelivery: false,
        images: [],
        id: "",
        isLimit: false,
      },
      ...variants,
    ]);
  };

  const handleRemoveVariant = (indexToRemove: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <>
      <EditHeader handleAddVariant={handleAddVariant} />
      {variants.map((product, index) => {
        return (
          <InventoryEditForm
            key={`product-${product.id}`}
            supplierId={inventory.supplierId}
            initValue={product}
            inventoryId={inventory.id}
            index={index}
            onRemove={() => handleRemoveVariant(index)}
            isPacking={inventory.isPacking}
          />
        );
      })}
    </>
  );
}

export default EditContainer;
