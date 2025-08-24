"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  InventoryProviderFormData,
  inventoryProviderSchema,
} from "../schemas/inventory-provider.schema";
import { setInventoryProviderFormData } from "../constants/inventory-provider-data";
import { createInventoryProvider } from "@/services/inventory-providers";

const initValues: InventoryProviderFormData = {
  stores: [],
  productId: 0,
  supplierId: 0,
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
      toast.success(`Se creó el inventario`);
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
