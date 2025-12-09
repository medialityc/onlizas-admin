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

const initValue: ProductVariant = {
  id: "",
  sku: "",
  upc: "",
  ean: "",
  condition: 0,
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
  costPrice: 0,
  deliveryMode: "ONLIZAS" as "ONLIZAS" | "PROVEEDOR",
  zoneIds: [],
  zones: [],
};

export const useInventoryProviderEditForm = (
  defaultValues: ProductVariant = initValue,
  inventoryId: string,
  handleClose?: () => void
) => {
  const { reset, ...form } = useForm({
    defaultValues,
    resolver: zodResolver(productVariants),
  });

  // Solo resetear cuando el ID cambia (edición de diferentes variantes)
  // No resetear en cada cambio de defaultValues para evitar perder valores del formulario
  const variantId = defaultValues?.id;
  
  useEffect(() => {
    if (defaultValues && variantId) {
      reset(defaultValues);
    }
  }, [variantId, reset, defaultValues]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: ProductVariant) => {
      const formData = await buildCreateProductVariantFormData(payload);
      
      const res = payload.id
        ? await editVariantInventory(payload.id, formData)
        : await addVariantToInventory(inventoryId, formData);

      if (res.error) {
        throw new Error(res.message || "Error al guardar");
      }
      return res;
    },
    async onSuccess() {
      toast.success(`Se editó el inventario correctamente`);
      handleClose?.();
    },
    onError: (error: unknown) => {
      let msg = "Ocurrió un error al guardar el inventario";
      if (error instanceof Error) {
        msg = error.message;
      } else if (typeof error === "string") {
        msg = error;
      } else if (error && typeof error === "object" && "message" in error) {
        msg = (error as any).message;
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
