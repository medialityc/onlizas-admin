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
import { DETAILS_MAX_ITEMS } from "@/utils/format";

type VariantDetailRow = {
  key: string;
  value: string;
  isRequired?: boolean;
  featureName?: string;
  featureDescription?: string;
  suggestions?: string[];
  isFeature?: boolean;
};

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
    [openModal],
  );

  const handleCreateOpen = () => {
    openModal("create");
  };

  const featureDetails = useMemo<VariantDetailRow[]>(
    () =>
      getCategoryFeature(features as unknown as FeatureFormData[]).map(
        (feature: any) => ({
          key: feature?.name ?? "",
          value: feature?.value ?? "",
          featureName: feature?.name ?? "",
          isRequired: feature?.isRequired,
          featureDescription: feature?.featureDescription,
          suggestions: feature?.suggestions ?? [],
          isFeature: true,
        }),
      ),
    [features],
  );

  const mergeDetailsForForm = useCallback(
    (variant?: ProductVariant | null): VariantDetailRow[] => {
      const currentDetails = Array.isArray(variant?.details)
        ? (variant?.details as VariantDetailRow[])
        : [];

      const detailValue = (input: unknown) => {
        if (input && typeof input === "object" && "value" in (input as any)) {
          return String((input as any).value ?? "").trim();
        }
        return String(input ?? "").trim();
      };

      const byKey = new Map(
        currentDetails
          .map((detail) => {
            const key = String(detail?.key ?? "").trim();
            return [key.toLowerCase(), detail] as const;
          })
          .filter(([key]) => !!key),
      );

      const featureRows = featureDetails.map((feature) => {
        const normalizedKey = feature.key.trim().toLowerCase();
        const current = byKey.get(normalizedKey);

        if (!current) {
          return feature;
        }

        byKey.delete(normalizedKey);

        return {
          ...feature,
          value: detailValue(current.value),
        };
      });

      const customRows = Array.from(byKey.values()).map((detail) => ({
        key: String(detail?.key ?? "").trim(),
        value: detailValue(detail?.value),
        isRequired: detail?.isRequired,
        isFeature: false,
      }));

      return [...featureRows, ...customRows].slice(0, DETAILS_MAX_ITEMS);
    },
    [featureDetails],
  );

  const selectedVariantWithDetails = useMemo(() => {
    if (!selectedVariant) return null;

    return {
      ...selectedVariant,
      details: mergeDetailsForForm(selectedVariant) as any,
    };
  }, [mergeDetailsForForm, selectedVariant]);

  const initValue = useMemo<ProductVariant>(
    (): ProductVariant => ({
      sku: "",
      upc: "",
      ean: "",
      gtin: "",
      condition: 0,
      details: featureDetails as any,
      isActive: true,
      stock: 0,
      price: 0,
      purchaseLimit: 0,
      isPrime: false,
      warranty: {
        isWarranty: false,
        warrantyType: "GRATIS",
        warrantyTime: 0,
        warrantyPrice: 0,
        timeUnit: 1,
      },
      packageDelivery: false,
      images: [],
      isLimit: false,
      costPrice: 0,
      deliveryMode: "ONLIZAS" as "ONLIZAS" | "PROVEEDOR",
      zones: [],
      zoneIds: [],
    }),
    [featureDetails],
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
        allVariants={inventory?.products || []}
        inventoryId={inventory.id as string}
        supplierId={inventory.supplierId}
        isPacking={inventory.isPacking}
      />

      {selectedVariantWithDetails && (
        <CreateInventoryVariantModal
          open={editModal.open}
          onClose={() => closeModal("edit")}
          initValue={selectedVariantWithDetails}
          allVariants={inventory?.products || []}
          inventoryId={inventory.id as string}
          supplierId={inventory.supplierId}
          isPacking={inventory.isPacking}
        />
      )}
    </>
  );
}

export default EditContainer;
