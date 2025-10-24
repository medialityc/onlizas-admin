"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  WarehouseVirtualTypeFormData,
  warehouseVirtualTypeSchema,
} from "../schemas/warehouse-virtual-type-schema";
import {
  createWarehouseVirtualType,
  updateWarehouseVirtualType,
} from "@/services/warehouses-virtual-types";

const initValues: WarehouseVirtualTypeFormData = {
  name: "",
  active: true,
  defaultRules: "",
};

export const useWarehouseVirtualTypeCreateForm = (
  defaultValues: WarehouseVirtualTypeFormData = initValues,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues,
    resolver: zodResolver(warehouseVirtualTypeSchema),
  });

  // Usar el ID de defaultValues para determinar si es edición o creación
  const isEditing = !!defaultValues?.id;
  const editingId = defaultValues?.id;

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: WarehouseVirtualTypeFormData) => {
      const res = isEditing && editingId
        ? await updateWarehouseVirtualType(editingId, payload)
        : await createWarehouseVirtualType(payload);
      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess: () => {
      toast.success(
        `Se ${isEditing ? "editó" : "creó"} correctamente el tipo`
      );
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["warehouse-virtual-types"] });
      form.reset();
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
