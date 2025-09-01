"use client";
import { useMutation } from "@tanstack/react-query";
import {
  WarehouseFormData,
  warehouseSchema,
} from "../schemas/warehouse-schema";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWarehouse, updateWarehouse } from "@/services/warehouses";
import { toast } from "react-toastify";
import { WAREHOUSE_TYPE_ENUM } from "../constants/warehouse-type";

import { initValueWarehouse } from "../constants/warehouse-initvalues";

export const useWarehouseCreateForm = (
  defaultValues: WarehouseFormData = initValueWarehouse
) => {
  const { push } = useRouter();

  const { ...form } = useForm({
    resolver: zodResolver(warehouseSchema),
    defaultValues,
  });

  const warehouseType = form?.watch("type");

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: WarehouseFormData) => {
      const res = payload?.id
        ? await updateWarehouse(
            payload?.id,
            payload?.type as WAREHOUSE_TYPE_ENUM,
            payload
          )
        : await createWarehouse(payload);

      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess() {
      toast.success(
        `Se ${defaultValues?.id ? "editó" : "creó"} correctamente el almacén`
      );
      push("/dashboard/warehouses");
    },
    onError: async (error: any) => {
      toast.error(error?.message);
    },
  });

  return {
    form: form,
    isPending,
    warehouseType,
    onSubmit: form.handleSubmit((values) => {
      mutate(values);
    }),
  };
};
