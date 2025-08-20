"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProductFormData, productSchema } from "../schema/product-schema";
import { useMutation } from "@tanstack/react-query";
import { createProduct } from "@/services/products";
import { toast } from "react-toastify";

const initValues: ProductFormData = {
  name: "",
  description: "",
  dimensions: {
    width: 0,
    height: 0,
    length: 0,
  },
  isActive: false,
  categories: [],
  details: [],
  features: [],
  images: [],
};

export const useProductCreateForm = (
  defaultValues: ProductFormData = initValues
) => {
  const form = useForm({
    defaultValues,
    resolver: zodResolver(productSchema),
  });

  console.log(form.formState.errors, "ERRORS");

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      /*  if (payload.images && payload.images.length > 0) {
        const formData = new FormData();
        await Promise.all(
          payload.images.map(async (image: any, index: number) => {
            if (typeof image === "string" && isValidUrl(image)) {
              try {
                const imageFile = await urlToFile(image);
                formData.append(`photoObjectCodes[${index}]`, imageFile);
              } catch {
                toast.error(`Error al procesar la imagen desde URL (${image})`);
              }
            } else if (image instanceof File) {
              formData.append(`images[${index}]`, image);
            }
          })
        );
      } */

      console.log(payload, "PRODUCT");
      return Promise.resolve({});
      return createProduct(payload);
    },
    onSuccess() {
      toast.success("Se creo correctamente el producto");
    },
    onError() {
      toast.error("Ocurrió un error");
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
