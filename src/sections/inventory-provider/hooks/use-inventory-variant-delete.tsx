"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  ProductVariant,
  productVariants,
} from "../schemas/inventory-provider.schema";
import { buildCreateProductVariantFormData } from "../constants/inventory-edit-data";
import {
  addVariantToInventory,
  deleteVariantInventory,
  editVariantInventory,
} from "@/services/inventory-providers";

const initValue: ProductVariant = {
  id: "",
  sku: "",
  details: {},
  isActive: true,
  stock: 0,
  price: 0,
  volume: 0,
  weight: 0,
  purchaseLimit: 0,
  warranty: {
    isWarranty: false,
    warrantyTime: 0,
    warrantyPrice: 0,
  },
  isLimit: false,
  isPrime: false,
  packageDelivery: false,
  images: [],
};

export const useInventoryVariantDelete = (
  inventoryId: string,
  onRemove: () => void
) => {
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (variantId: string) => {
      const res = await deleteVariantInventory(inventoryId, variantId);

      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess() {
      toast.success(`Se eliminó la variante de el inventario correctamente`);
      onRemove();
    },
    onError: (error: unknown) => {
      let msg = "Ocurrió un error al guardar el inventario";
      if (error instanceof Error) {
        msg = error.message;
      } else if (typeof error === "string") {
        msg = error;
      }
      toast.error(msg);
    },
  });

  return {
    isPending,
    // expose the async version so callers can await and react to success
    onDelete: mutateAsync,
    // keep mutate for compatibility if needed
    mutate,
  };
};
