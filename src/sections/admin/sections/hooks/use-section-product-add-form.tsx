"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  SectionProductItemFormData,
  sectionProductSchema,
} from "../schema/section-schema";

export const sectionProductInitValues: SectionProductItemFormData = {
  productGlobalId: "",
  displayOrder: 0,
  isFeatured: true,
  customLabel: "",
  customBackgroundColor: "",
  products: [],
  categoriesIds: [],
  supplierId: ''
};

export const useSectionProductItemAddForm = (
  onAdd: (item: SectionProductItemFormData) => void,
  defaultValues: SectionProductItemFormData = sectionProductInitValues
) => {
  const form = useForm({
    defaultValues,
    resolver: zodResolver(sectionProductSchema),
  });

  console.log("Form errors:", form.formState.errors);

  return {
    form: form,
    onSubmit: form.handleSubmit((values) => {
      console.log("Adding product to section:", values);
      onAdd(values);
      form.reset();
    }),
  };
};
