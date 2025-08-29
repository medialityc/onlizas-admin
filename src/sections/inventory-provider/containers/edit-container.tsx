"use client";
import React from "react";
import EditHeader from "../components/inventory-edit-from/edit-header";
import { IUserProvider } from "@/types/users";
import { InventoryStoreFormData } from "../schemas/inventory-edit.schema";
import InventoryEditForm from "../components/inventory-edit-from/inventory-edit-from";
import { CategoryFeature } from "@/types/products";
import { getCategoryFeature } from "../constants/category-feature";
import { FeatureFormData } from "@/sections/categories/schemas/category-schema";

type Props = {
  userProvider: IUserProvider;
  inventory: InventoryStoreFormData;
  features: CategoryFeature[];
};
function EditContainer({ userProvider, inventory, features }: Props) {
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
        };

        return [feature?.name ?? "", val];
      }
    )
  );

  const handleAddVariant = () => {
    setVariants([
      {
        details: featuresNormalized,
        quantity: 0,
        price: 0,
        discountType: 0,
        discountValue: 0,
        purchaseLimit: 0,
        isPrime: false,
        warranty: {
          isWarranty: false,
          warrantyTime: 0,
          warrantyPrice: 0,
        },
        packageDelivery: false,
        images: [],
        id: 0,
        isLimit: false,
      },
      ...variants,
    ]);
  };

  const handleDeleteVariant = (id: number) => {
    setVariants(variants.filter((variant) => variant.id !== id));
  };

  return (
    <>
      <EditHeader handleAddVariant={handleAddVariant} />
      {variants.map((product, index) => (
        <InventoryEditForm
          key={`product-${product.id}`}
          userProvider={userProvider.id}
          initValue={product}
          inventoryId={inventory.id}
          index={index}
          onRemove={() => handleDeleteVariant(product.id)}
        />
      ))}
    </>
  );
}

export default EditContainer;
