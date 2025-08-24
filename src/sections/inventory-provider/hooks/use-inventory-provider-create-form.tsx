"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  InventoryProviderFormData,
  inventoryProviderSchema,
} from "../schemas/inventory-provider.schema";

const initValues: InventoryProviderFormData = {
  stores: [],
  productId: 0,
  supplierId: 0,
  categoryFeatures: [],
};

export const useInventoryProviderCreateForm = (
  defaultValues: InventoryProviderFormData = initValues
) => {
  // const { push } = useRouter();

  const form = useForm({
    defaultValues,
    resolver: zodResolver(inventoryProviderSchema),
  });

  console.log(form.formState.errors, "ERRORS");

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: InventoryProviderFormData) => {
      console.log(payload, "INVENTORY");
      /*  const fromData = await setInventoryProviderFormData(payload);
      const res = await createInventoryProvider(fromData);

      if (res.error) {
        throw res;
      } */

      return;
    },
    onSuccess() {
      toast.success(`Se creó el inventario`);
      // push("/dashboard/inventory");
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
