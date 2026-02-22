"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProductFormData, productSchema } from "../schema/product-schema";
import { useMutation } from "@tanstack/react-query";
import { createProduct, updateProduct } from "@/services/products";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { setProductFormData } from "../constants/product-data";

const initValues: ProductFormData = {
  id: "",
  name: "",
  description: "",
  length: 0,
  width: 0,
  height: 0,
  weight: 0,
  active: false,
  categoryIds: [],
  supplierUserIds: [],
  aboutThis: [],
  tutorials: [],
  details: [],
  image: "",
  brandId: "",
  gtin: "",
  aduanaCategoryGuid: "",
};

type UseProductCreateFormOptions = {
  afterCreateRedirectTo?: string;
};

export const useProductCreateForm = (
  defaultValues: ProductFormData = initValues,
  options?: UseProductCreateFormOptions,
) => {
  const { push } = useRouter();
  const form = useForm({
    defaultValues,
    resolver: zodResolver(productSchema),
  });
  const isDraft = form.watch("isDraft");

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: ProductFormData) => {
      const fromData = await setProductFormData(payload);

      const res = payload?.id
        ? await updateProduct(payload?.id, fromData)
        : await createProduct(fromData);

      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess() {
      toast.success(
        `Se ${defaultValues?.id ? "editó" : "creó"} correctamente el producto`,
      );
      const isEdit = !!defaultValues?.id;
      const redirectTo = !isEdit
        ? (options?.afterCreateRedirectTo ?? "/dashboard/products")
        : "/dashboard/products";

      push(redirectTo);
    },
    onError: async (error: any) => {
      toast.error(error?.message);
    },
  });

  return {
    form,
    isPending,
    onSubmit: form.handleSubmit((values) => {
      mutate(values);
    }),
    isDraft,
  };
};
