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
import { getCreateWarehouseAdapter } from "../adapter/warehouse-create.adapter";

interface WarehouseFormProps {
  warehouse?: WarehouseFormData;
  onSuccess?: () => void;
}

export const useWarehouseCreateForm = ({
  onSuccess,
  warehouse,
}: WarehouseFormProps) => {
  const { push } = useRouter();

  const form = useForm({
    resolver: zodResolver(warehouseSchema),
    defaultValues: warehouse,
  });

  console.log(form.formState.errors, "ERRORS");

  const warehouseType = form?.watch("type");

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: WarehouseFormData) => {
      const res = payload?.id
        ? await updateWarehouse(payload?.id, payload)
        : await createWarehouse(getCreateWarehouseAdapter(payload));

      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess() {
      toast.success(
        `Se ${warehouse?.id ? "editó" : "creó"} correctamente el almacén`
      );
      onSuccess?.();
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
