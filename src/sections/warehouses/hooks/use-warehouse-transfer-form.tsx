"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  WarehouseTransferFormData,
  warehouseVirtualTransferSchema,
} from "../schemas/warehouse-transfer-schema";
import { createWarehouseTransfer } from "@/services/warehouses-transfers";

export const useWarehouseTransferForm = (
  defaultValues: WarehouseTransferFormData
) => {
  const { push } = useRouter();

  const form = useForm({
    resolver: zodResolver(warehouseVirtualTransferSchema),
    defaultValues,
  });

  console.log(form.formState.errors, "ERRORS");

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
      push("/dashboard/warehouses");
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
