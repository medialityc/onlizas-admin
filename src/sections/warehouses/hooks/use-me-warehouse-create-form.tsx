"use client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMeWarehouse, updateMeWarehouse } from "@/services/warehouses";
import { toast } from "react-toastify";

import { initValueMeWarehouse } from "../constants/warehouse-initvalues";
import {
  MeWarehouseFormData,
  meWarehouseSchema,
} from "../schemas/me-warehouse-schema";
import { useAuth } from "zas-sso-client";

export const useMeWarehouseCreateForm = (
  defaultValues: MeWarehouseFormData = initValueMeWarehouse,
  onClose?: () => void,
) => {
  const { ...form } = useForm({
    resolver: zodResolver(meWarehouseSchema),
    defaultValues,
  });
  const { user } = useAuth();
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: MeWarehouseFormData) => {
      const res = payload?.id
        ? await updateMeWarehouse(payload?.id, payload)
        : await createMeWarehouse({ ...payload, supplierId: String(user?.id) });

      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess() {
      toast.success(
        `Se ${defaultValues?.id ? "editó" : "creó"} correctamente el almacén`,
      );
      onClose?.();
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
