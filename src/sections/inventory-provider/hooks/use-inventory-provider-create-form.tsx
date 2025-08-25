"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  InventoryProviderFormData,
  inventoryProviderSchema,
} from "../schemas/inventory-provider.schema";
import { setInventoryProviderFormData } from "../constants/inventory-provider-data";
import { createInventoryProvider } from "@/services/inventory-providers";
import { useRouter } from "next/navigation";

const initValues: InventoryProviderFormData = {
  storesWarehouses: [],
  productId: 0,
  supplierId: 0,
  categoryFeatures: [],
};

export const useInventoryProviderCreateForm = (
  defaultValues: InventoryProviderFormData = initValues
) => {
  const { push } = useRouter();

  const form = useForm({
    defaultValues,
    resolver: zodResolver(inventoryProviderSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: InventoryProviderFormData) => {
      const fromData = await setInventoryProviderFormData(payload);
      const res = await createInventoryProvider(fromData);

      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess() {
      toast.success(`Se creó el inventario correctamente`);
      push("/dashboard/inventory");
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
