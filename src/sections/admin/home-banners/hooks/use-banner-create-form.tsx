"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { HomeBannerFormData, homeBannerSchema } from "../schema/banner-schema";
import { setHomeBannerFormData } from "../constants/banner-data";
import { createHomeBanner, updateHomeBanner } from "@/services/homebanner";

const initValues: HomeBannerFormData = {
  link: "/products",
  imageMobileUrl: "",
  imageDesktopUrl: "",
  isActive: true,
  regionId: 1,
};

export const useHomeBannerCreateForm = (
  defaultValues: HomeBannerFormData = initValues
) => {
  const { push } = useRouter();
  const form = useForm({
    defaultValues,
    resolver: zodResolver(homeBannerSchema),
  });

  console.log(form.formState.errors);

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: HomeBannerFormData) => {
      const formData = await setHomeBannerFormData(payload);
      const res = payload?.id
        ? await updateHomeBanner(payload?.id, formData)
        : await createHomeBanner(formData);
      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess: () => {
      toast.success(
        `Se ${defaultValues?.id ? "editó" : "creó"} correctamente el banner`
      );
      push("/dashboard/content/home-banners");
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
