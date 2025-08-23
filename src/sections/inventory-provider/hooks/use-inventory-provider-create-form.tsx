"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createProduct, updateProduct } from "@/services/products";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { urlToFile } from "@/utils/format";
import { useRouter } from "next/navigation";
import {
  InventoryProviderFormData,
  inventoryProviderSchema,
} from "../schemas/inventory-provider.schema";
import { setInventoryProviderFormData } from "../constants/inventory-provider-data";

const initValues: InventoryProviderFormData = {
  name: "",

  image: "",
};

export const useInventoryProviderCreateForm = (
  defaultValues: InventoryProviderFormData = initValues
) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const { push } = useRouter();
  const form = useForm({
    defaultValues,
    resolver: zodResolver(inventoryProviderSchema),
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
    mutationFn: async (payload: InventoryProviderFormData) => {
      const fromData = await setInventoryProviderFormData(payload);
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
    form: form,
    isPending,
    loadingImage,
    onSubmit: form.handleSubmit((values) => {
      mutate(values);
    }),
  };
};
