"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createInventoryProvider } from "@/services/inventory-providers";
import {
  InventoryEasy,
  inventoryEasySchema,
} from "../schemas/inventory-easy.schema";
import { CreateEasyInventory } from "@/types/inventory";

export const useInventoryCreateForm = (
  initValues: Partial<InventoryEasy>,
  onRedirect: () => void
) => {
  const form = useForm<InventoryEasy>({
    resolver: zodResolver(inventoryEasySchema),
    defaultValues: initValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: InventoryEasy) => {
      const body: CreateEasyInventory = {
        storeId: payload.storeId,
        warehouseId: payload.physicalWarehouseId ?? payload.virtualWarehouseId,
        productId: payload.productId,
        supplierId: payload.supplierId,
      };
      const res = await createInventoryProvider(body);

      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess() {
      toast.success(`Se creó el inventario correctamente`);
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
