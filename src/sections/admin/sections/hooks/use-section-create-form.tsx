"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { addDays } from "date-fns";
import { SectionFormData, sectionSchema } from "../schema/section-schema";
import { setSectionFormData } from "../constants/section-data";
import { createSection, updateSection } from "@/services/section";

const initValues: SectionFormData = {
  name: "",
  description: "",
  viewMoreUrl: "",
  isActive: true,
  isPersonalized: true,
  displayOrder: 0,
  createdAt: "",
  templateType: "",
  defaultItemCount: 0,
  backgroundColor: "",
  textColor: "",
  targetUserSegment: "",
  targetDeviceType: "",
  startDate: new Date(),
  endDate: addDays(new Date(), 7),
  products: [],
};

export const useSectionCreateForm = (
  defaultValues: SectionFormData = initValues
) => {
  const { push } = useRouter();
  const form = useForm({
    defaultValues,
    resolver: zodResolver(sectionSchema),
  });

  const startDate = form.watch("startDate");

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: SectionFormData) => {
      const formData = await setSectionFormData(payload);

      const res = payload?.id
        ? await updateSection(payload?.id, formData)
        : await createSection(formData);
      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess: () => {
      toast.success(
        `Se ${defaultValues?.id ? "editó" : "creó"} correctamente la sección`
      );
      // push("/dashboard/content/sections");
    },
    onError: async (error: any) => {
      toast.error(error?.message);
    },
  });

  return {
    form: form,
    isPending,
    startDate,
    onSubmit: form.handleSubmit((values) => {
      mutate(values);
    }),
  };
};
