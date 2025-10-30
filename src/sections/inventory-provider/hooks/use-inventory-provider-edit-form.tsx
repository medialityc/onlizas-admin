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
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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

export const useInventoryProviderEditForm = (
  defaultValues: ProductVariant = initValue,
  inventoryId: string
) => {
  const { reset, ...form } = useForm({
    defaultValues,
    resolver: zodResolver(productVariants),
  });

  const { push } = useRouter();

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: ProductVariant) => {
      const formData = await buildCreateProductVariantFormData(payload);
      const res = payload.id
        ? await editVariantInventory(payload.id, formData)
        : await addVariantToInventory(inventoryId, formData);

      if (res.error) throw res;
    },
    async onSuccess(data, variable) {
      toast.success(`Se editó el inventario correctamente`);
      console.log("variable", variable);
      if (variable.id === "") {
        push('/dashboard/inventory');
      }
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
    form: form,
    reset,
    isPending,
    onSubmit: form.handleSubmit((values) => {
      mutate(values);
    }),
  };
};
