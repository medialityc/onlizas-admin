"use client";
import React, { useCallback, useMemo } from "react";
import EditHeader from "../components/inventory-edit-from/edit-header";
import { IUser } from "@/types/users";
import { InventoryStoreFormData } from "../schemas/inventory-edit.schema";
import InventoryEditForm from "../components/inventory-edit-from/inventory-edit-from";
import { CategoryFeature } from "@/types/products";
import { getCategoryFeature } from "../constants/category-feature";
import { FeatureFormData } from "@/sections/categories/schemas/category-schema";
import { useModalState } from "@/hooks/use-modal-state";
import CreateInventoryVariantModal from "../modal/create-inventory-variant-modal";
import VariantsManager from "../components/inventory-variant-list/inventory-variant-list";
import { ProductVariant } from "../schemas/inventory-provider.schema";

type Props = {
  inventory: InventoryStoreFormData;
  features: CategoryFeature[];
};
function EditContainer({ inventory, features }: Props) {
  const { getModalState, openModal, closeModal } = useModalState();
  const createModal = getModalState("create");

  // edit variant
  const editModal = getModalState("edit");
  const selectedVariant = useMemo(() => {
    const id = editModal.id;
    if (!id || !inventory?.products) return null;
    return inventory?.products.find((variant) => variant.id == id);
  }, [editModal, inventory?.products]);

  const handleEditOpen = useCallback(
    (variantId: string) => {
      openModal("edit", variantId);
    },
    [openModal]
  );

  const handleCreateOpen = () => {
    openModal("create");
  };

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

  const initValue = useMemo(
    () => ({
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
      isLimit: false,
    }),
    [featuresNormalized]
  );

  return (
    <>
      {/* <EditHeader handleAddVariant={handleAddVariant} /> */}

      <VariantsManager
        inventoryId={inventory.id as string}
        variants={inventory?.products || []}
        onAdd={handleCreateOpen}
        onEdit={handleEditOpen}
      />

      <CreateInventoryVariantModal
        open={createModal.open}
        onClose={() => closeModal("create")}
        initValue={initValue}
        inventoryId={inventory.id as string}
        isPacking={inventory.isPacking}
      />

      {selectedVariant && (
        <CreateInventoryVariantModal
          open={editModal.open}
          onClose={() => closeModal("edit")}
          initValue={selectedVariant}
          inventoryId={inventory.id as string}
          isPacking={inventory.isPacking}
        />
      )}
    </>
  );
}

export default EditContainer;
