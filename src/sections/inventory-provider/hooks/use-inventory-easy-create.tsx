"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createInventoryProvider } from "@/services/inventory-providers";
import {
  InventoryEasy,
  inventoryEasySchema,
} from "../schemas/inventory-easy.schema";
import { CreateEasyInventory } from "@/types/inventory";
import { useRouter } from "next/navigation";

export const useInventoryCreateForm = (
  initValues: Partial<InventoryEasy>,
  onClose: () => void
) => {
  const form = useForm<InventoryEasy>({
    resolver: zodResolver(inventoryEasySchema),
    defaultValues: initValues,
  });
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const onRedirect = (id: number) => {
    push(`/dashboard/inventory/${id}/edit`);
  };
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: InventoryEasy) => {
      const body: CreateEasyInventory = {
        storeId: payload.storeId,
        warehouseId: payload.physicalWarehouseId ?? payload.virtualWarehouseId,
        productId: payload.productId,
        supplierId: payload.supplierId,
        isPaqueteria: payload.isPaqueteria,
        isMayorista: payload.isMayorista,
      };
      const res = await createInventoryProvider(body);

      if (res.error) {
        throw res;
      }

      return res;
    },
    onSuccess({ data }) {
      toast.success(`Se creó el inventario correctamente`);
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey as string[];
          return Array.isArray(key) && key[0] === "stores";
        },
      });
      if (data) {
        onRedirect(data.id);
        return;
      }
      onClose();
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
