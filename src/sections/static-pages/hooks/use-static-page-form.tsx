"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  StaticPageFormData,
  staticPageSchema,
} from "../schemas/static-page-schema";
import { createStaticPage, updateStaticPage } from "@/services/static-pages";
import { useRouter } from "next/navigation";
import { revalidateTagFn } from "@/services/revalidate";

const initValues: StaticPageFormData = {
  title: "",
  slug: "",
  content: "",
  section: 0,
  metaDescription: "",
  metaKeywords: "",
};

export const useStaticPageForm = (
  defaultValues: StaticPageFormData = initValues
) => {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<StaticPageFormData>({
    defaultValues,
    resolver: zodResolver(staticPageSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: StaticPageFormData) => {
      const res = payload?.id
        ? await updateStaticPage(payload.id, {
            title: payload.title,
            content: payload.content,
            section: payload.section,
            metaDescription: payload.metaDescription,
            metaKeywords: payload.metaKeywords,
          })
        : await createStaticPage({
            title: payload.title,
            content: payload.content,
            slug: payload.slug,
            section: payload.section,
            metaDescription: payload.metaDescription,
            metaKeywords: payload.metaKeywords,
          });
      if (res.error) {
        throw res;
      }
      return;
    },
    onSuccess: async () => {
      // Invalidate edit/detail cache so reopening pulls fresh data
      if (defaultValues?.slug) {
        await queryClient.invalidateQueries({
          queryKey: ["static-page-admin", defaultValues.slug],
        });
      }
      // Invalidate any static pages collections
      await queryClient.invalidateQueries({ queryKey: ["static-pages"] });
      toast.success(
        `Se ${defaultValues?.slug ? "editó" : "creó"} correctamente la página`
      );
      push("/dashboard/content/static-pages");
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
