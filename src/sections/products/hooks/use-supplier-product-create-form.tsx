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

const initValues: SupplierProductFormData = {
  isDraft: false,
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
  image: "",
};

export const useSupplierProductCreateForm = (
  defaultValues: SupplierProductFormData = initValues
) => {
  const { push } = useRouter();
  const form = useForm({
    defaultValues,
    resolver: zodResolver(supplierProductSchema),
  });

  const isDraft = form.watch("isDraft");

  console.log(form.formState.errors)

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      payload: SupplierProductFormData & { isLink?: boolean }
    ) => {
      const fromData = await setSupplierProductFormData(payload);

      let res = undefined;
      if (payload?.isLink) {
        res = createSupplierProductLink(
          payload?.supplierId as number,
          payload?.id as number
        );
      }
      res = payload?.id
        ? await updateSupplierProduct(
            payload?.supplierId as number,
            payload?.id,
            fromData
          )
        : await createSupplierProduct(payload?.supplierId as number, fromData);

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
    isDraft,
    onSubmit: form.handleSubmit((values) => {
      mutate(values);
    }),

    onSubmitLink: form.handleSubmit((values) => {
      mutate({ ...values, isLink: true });
    }),
  };
};
