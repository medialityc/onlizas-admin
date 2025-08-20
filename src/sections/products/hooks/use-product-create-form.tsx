"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProductFormData, productSchema } from "../schema/product-schema";
import { useMutation } from "@tanstack/react-query";
import { createProduct, updateProduct } from "@/services/products";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { urlToFile } from "@/utils/format";
import { setProductFormData } from "../constants/product-data";

const initValues: ProductFormData = {
  name: "",
  description: "",
  dimensions: {
    width: 0,
    height: 0,
    length: 0,
  },
  isActive: false,
  categoryIds: [],
  supplierIds: [],
  about: [],
  details: [],
  features: [],
  images: [],
};

export const useProductCreateForm = (
  defaultValues: ProductFormData = initValues
) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const form = useForm({
    defaultValues,
    resolver: zodResolver(productSchema),
  });

  console.log(form.formState.errors, "ERRORS");

  useEffect(() => {
    const loadImagesAsFiles = async () => {
      if (defaultValues?.images?.length) {
        try {
          setLoadingImage(true);

          const imageFiles = await Promise.all(
            defaultValues.images.map(async (imageUrl, index) => {
              try {
                return await urlToFile(imageUrl, `category-image-${index}.jpg`);
              } catch (error) {
                console.error(`Error loading image ${index}:`, error);
                return null;
              }
            })
          );

          const validFiles = imageFiles.filter((file) => file !== null);
          form.setValue("images", validFiles);
        } catch (error) {
          console.error("Error loading images:", error);
          form.setValue("images", defaultValues.images);
        } finally {
          setLoadingImage(false);
        }
      }
    };

    loadImagesAsFiles();
  }, [defaultValues?.images, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: ProductFormData) => {
      const fromData = await setProductFormData(payload);
      if (payload?.id) {
        return await updateProduct(payload?.id, fromData);
      }
      return await createProduct(fromData);
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
    loadingImage,
    onSubmit: form.handleSubmit((values) => {
      mutate(values);
    }),
  };
};
