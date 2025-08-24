"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProductFormData, productSchema } from "../schema/product-schema";
import { useMutation } from "@tanstack/react-query";
import {
  createProductAsProvider,
  updateProductAsProvider,
} from "@/services/provider-products";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { urlToFile } from "@/utils/format";
import { setProductFormData } from "../constants/product-data";
import { useRouter } from "next/navigation";

const initValues: ProductFormData = {
  name: "",
  description: "",

  //dimensions
  length: 0,
  width: 0,
  height: 0,
  weight: 0,

  isActive: false,
  categoryIds: [],
  aboutThis: [],
  details: {},
  detailsArray: [],
  image: "",
};

export const useProductCreateForm = (
  defaultValues: ProductFormData = initValues
) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const { push } = useRouter();
  const form = useForm({
    defaultValues,
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    const loadImageAsFile = async () => {
      if (defaultValues?.image) {
        try {
          setLoadingImage(true);
          const file = await urlToFile(
            defaultValues?.image as string,
            "product-image.jpg"
          );
          form.setValue("image", file);
        } catch {
          form.setValue("image", defaultValues.image);
        } finally {
          setLoadingImage(false);
        }
      }
    };
    loadImageAsFile();
  }, [defaultValues.image, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: ProductFormData) => {
      const fromData = await setProductFormData(payload);
      const res = payload?.id
        ? await updateProductAsProvider(payload?.id, fromData)
        : await createProductAsProvider(fromData);

      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess() {
      toast.success(
        `Se ${defaultValues?.id ? "editó" : "creó"} correctamente el producto`
      );
      push("/provider/products");
    },
    onError: async (error: any) => {
      toast.error(error?.message);
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
