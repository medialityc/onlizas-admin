"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Store } from "@/types/stores";

import StoreTabs from "./components/store-edit-tabs";
import { GeneralStoreSchema } from "./general/general-schema";

interface Props {
  store: Store;
}

export default function StoreEditContainer({ store }: Props) {
  const methods = useForm({
    resolver: zodResolver(GeneralStoreSchema),
    mode: "onBlur",
  });

  return (
    <FormProvider {...methods}>
      <div className="p-6">
        <StoreTabs store={store} />
        <div className="mt-6"></div>
      </div>
    </FormProvider>
  );
}
