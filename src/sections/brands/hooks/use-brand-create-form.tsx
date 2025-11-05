"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BrandFormData, brandSchema } from "../schemas/brand-schema";
import { createBrand, updateBrand } from "@/services/brands";
import { useRouter } from "next/navigation";

const initValues: BrandFormData = {
  name: "",
};

export const useBrandCreateForm = (
  defaultValues: BrandFormData = initValues
) => {
  const { push } = useRouter();
  const form = useForm({
    defaultValues,
    resolver: zodResolver(brandSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: BrandFormData) => {
      const res = payload?.id
        ? await updateBrand(payload?.id, { name: payload.name })
        : await createBrand({ name: payload.name });
      if (res.error) {
        throw res;
      }
      return;
    },
    onSuccess: () => {
      toast.success(
        `Se ${defaultValues?.id ? "editó" : "creó"} correctamente la marca`
      );
      push("/dashboard/brands");
    },
    onError: async (error: any) => {
      toast.error(error?.message);
    },
  });

  return {
    form,
    isPending,
    onSubmit: form.handleSubmit((values) => mutate(values)),
  };
};
