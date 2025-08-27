"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateInventoryProvider } from "@/services/inventory-providers";
import { setInventoryEditFormData } from "../constants/inventory-edit-data";
import {
  InventoryStoreFormData,
  InventoryStoreSchema,
} from "../schemas/inventory-edit.schema";

const initValue: InventoryStoreFormData = {
  products: [],
  storeId: 0,
  warehouseId: 0,
  supplierId: 0,
  parentProductId: 0,
  parentProductName: "",
  warehouseName: "",
  supplierName: "",
  storeName: "",
  limitPurchaseLimit: 0,
};

export const useInventoryProviderEditForm = (
  defaultValues: InventoryStoreFormData = initValue,
  onRedirect: () => void
) => {
  const form = useForm({
    defaultValues,
    resolver: zodResolver(InventoryStoreSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: InventoryStoreFormData) => {
      const fromData = setInventoryEditFormData(payload);
      const res = await updateInventoryProvider(
        payload?.parentProductId,
        fromData
      );

      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess() {
      toast.success(`Se editó el inventario correctamente`);
      onRedirect?.();
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
