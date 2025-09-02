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
  editVariantInventory,
} from "@/services/inventory-providers";

const initValue: ProductVariant = {
  //Información de Inventario
  quantity: 0,
  price: 0,

  //Restricciones y Límites
  purchaseLimit: 0,
  isPrime: false,
  // Garantía
  warranty: {
    isWarranty: false,
    warrantyTime: 0,
    warrantyPrice: 0,
  },
  packageDelivery: false,
  images: [],
  id: 0,
  details: {},
  isLimit: false,
};

export const useInventoryProviderEditForm = (
  defaultValues: ProductVariant = initValue,
  onRedirect: () => void,
  inventoryId: number
) => {
  const form = useForm({
    defaultValues,
    resolver: zodResolver(productVariants),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: ProductVariant) => {
      const fromData = buildCreateProductVariantFormData(payload);
      const res = await (payload.id
        ? editVariantInventory(payload.id, fromData)
        : addVariantToInventory(inventoryId, fromData));
      console.log(res);
      return;
    },
    onSuccess() {
      toast.success(`Se editó el inventario correctamente`);
      // onRedirect?.();
    },
    onError: async (error: any) => {
      toast.error(error?.message);
    },
  });

  return {
    form: form,
    isPending,
    onSubmit: form.handleSubmit((values) => {
      mutate(values);
    }),
  };
};
