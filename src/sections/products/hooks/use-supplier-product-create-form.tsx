"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  createSupplierProduct,
  createSupplierProductLink,
  updateSupplierProduct,
} from "@/services/products";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  SupplierProductFormData,
  supplierProductSchema,
} from "../schema/supplier-product-schema";
import { setSupplierProductFormData } from "../constants/supplier-product-data";
import { focusFirstError } from "@/utils/focust";
import { useIsSupplierApproved } from "@/hooks/use-is-supplier-approved";

const getInitValues = (isApproved: boolean): SupplierProductFormData => ({
  isDraft: false,
  name: "",
  description: "",

  //dimensions
  length: 0,
  width: 0,
  height: 0,
  weight: 0,

  active: isApproved,
  categoryIds: [],
  aboutThis: [],
  tutorials: [],
  image: null,
  brandId: "",
  aduanaCategoryGuid: "",
});

type UseSupplierProductCreateFormOptions = {
  afterCreateRedirectTo?: string;
};

export const useSupplierProductCreateForm = (
  defaultValues: SupplierProductFormData | undefined,
  isEdit: boolean = false,
  options?: UseSupplierProductCreateFormOptions,
) => {
  const { push } = useRouter();
  const isApproved = useIsSupplierApproved();
  const initValues = getInitValues(isApproved);

  const form = useForm({
    defaultValues: defaultValues ?? initValues,
    resolver: zodResolver(supplierProductSchema),
  });

  const isDraft = form.watch("isDraft");

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      payload: SupplierProductFormData & { isLink?: boolean },
    ) => {
      const enforcedPayload = {
        ...payload,
        active: isApproved ? payload.active : false,
      };
      const fromData = await setSupplierProductFormData(enforcedPayload);

      let res = undefined;
      if (!payload?.isDraft) {
        res = await createSupplierProductLink(payload?.id as string);
      } else {
        res = isEdit
          ? await updateSupplierProduct(payload?.id as string, fromData)
          : await createSupplierProduct(fromData);
      }

      if (res.error) {
        throw res;
      }

      return;
    },
    onSuccess() {
      toast.success(
        `Se ${defaultValues?.id ? "editó" : "creó"} correctamente el producto`,
      );
      const isEditMode = !!defaultValues?.id;
      const redirectTo = !isEditMode
        ? (options?.afterCreateRedirectTo ?? "/dashboard/products")
        : "/dashboard/products";

      push(redirectTo);
    },
    onError: async (error: any) => {
      toast.error(error?.message);
    },
  });

  return {
    form: form,
    isPending,
    isDraft,

    onSubmit: form.handleSubmit(
      (values) => {
        mutate(values);
      },
      (errors) => {
        focusFirstError(errors, form.setFocus);
      },
    ),

    onSubmitLink: form.handleSubmit((values) => {
      mutate({ ...values, isLink: true });
    }),
  };
};
