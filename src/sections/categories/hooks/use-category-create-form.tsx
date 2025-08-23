"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CategoryFormData, categorySchema } from "../schemas/category-schema";
import { createCategory, updateCategory } from "@/services/categories";
import { useEffect, useState } from "react";
import { urlToFile } from "@/utils/format";
import { useRouter } from "next/navigation";
import { setCategoryFormData } from "../constants/category-data";

const initValues: CategoryFormData = {
  name: "",
  description: "",
  image: "",
  isActive: false,
  features: [
    {
      featureName: "",
      featureDescription: "",
      isPrimary: false,
      isRequired: false,
      suggestions: [],
    },
  ],
  departmentId: 0,
};

export const useCategoryCreateForm = (
  defaultValues: CategoryFormData = initValues
) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const { push } = useRouter();
  const form = useForm({
    defaultValues,
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    const loadImageAsFile = async () => {
      if (defaultValues?.image) {
        try {
          setLoadingImage(true);
          const file = await urlToFile(
            defaultValues?.image as string,
            "category-image.jpg"
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
    mutationFn: async (payload: CategoryFormData) => {
      const formData = await setCategoryFormData(payload);
      const res = payload?.id
        ? await updateCategory(payload?.id, formData)
        : await createCategory(formData);
      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess: () => {
      toast.success(
        `Se ${defaultValues?.id ? "editó" : "creó"} correctamente la categoría`
      );
      push("/dashboard/categories");
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

    loadingImage,
  };
};
