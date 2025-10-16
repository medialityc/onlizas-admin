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
  id: 0,
  sku: "",
  details: {},
  quantity: 0,
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

export const useInventoryProviderEditForm = (
  defaultValues: ProductVariant = initValue,
  handleCancel: () => void,
  inventoryId: string
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

      if (res.error) {
        const msg =
          typeof res.error === "string"
            ? res.error
            : res?.message ||
              res.message ||
              "Ocurrió un error al guardar el inventario";
        throw new Error(msg);
      }
      return;
    },
    onSuccess(data) {
      toast.success(`Se editó el inventario correctamente`);
      console.log({ data });
      // onRedirect?.();
    },
    onError: (error: unknown) => {
      let msg = "Error desconocido";
      if (error instanceof Error) {
        msg = error.message;
      } else if (typeof error === "string") {
        msg = error;
      }
      toast.error(msg);
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
