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
  details: [],
  image: "",

  // Aduanera
  /* customsValueAduanaUsd: 0,
  valuePerUnit: 0, */
  isDurable: false,
  aduanaCategoryGuid: "",
  // unitGuid: "",
};

export const useProductCreateForm = (
  defaultValues: ProductFormData = initValues
) => {
  const { push } = useRouter();
  const form = useForm({
    defaultValues,
    resolver: zodResolver(productSchema),
  });

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
        `Se ${defaultValues?.id ? "editó" : "creó"} correctamente el producto`
      );
      push("/dashboard/products");
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
  };
};
