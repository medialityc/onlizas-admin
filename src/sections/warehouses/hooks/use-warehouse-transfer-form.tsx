"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  WarehouseTransferFormData,
  warehouseTransferSchema,
} from "../schemas/warehouse-transfer-schema";
import { createWarehouseTransfer } from "@/services/warehouses-transfers";
import { useWarehouseInventoryActions } from "../contexts/warehouse-inventory-transfer.stote";
import { useEffect } from "react";

export const useWarehouseTransferForm = (
  defaultValues: WarehouseTransferFormData
) => {
  const { push } = useRouter();
  const { items } = useWarehouseInventoryActions();

  const form = useForm({
    resolver: zodResolver(warehouseTransferSchema),
    defaultValues,
  });

  useEffect(() => {
    if (items) {
      form.setValue(
        "items",
        items?.map((item) => ({
          productVariantId: item?.productVariantId,
          quantityRequested: item?.quantityRequested,
          unit: item?.unit,
          allowPartialFulfillment: true,
        }))
      );
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: WarehouseTransferFormData) => {
      const res = await createWarehouseTransfer(payload);

      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess() {
      toast.success(`Transferencia entre almacenes completada`);
      push("transfers/list"); // navegación relativa
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
