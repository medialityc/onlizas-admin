import React from "react";
import { getStoreCategories } from "@/services/store-categories";
import CategoriesContainer from "./categories-container";
import { Store } from "@/types/stores";
import { adaptStoreCategories } from "./utils/adapter";

type Props = { storeId: number };

export default async function CategoriesPanel({ storeId }: Props) {
  const res = await getStoreCategories(storeId);
  const raw: any[] = Array.isArray(res?.data)
    ? (res.data as any[])
    : Array.isArray((res?.data as any)?.data)
      ? ((res?.data as any).data as any[])
      : [];
  const initialItems = adaptStoreCategories(raw);
  console.log(initialItems)

  return <CategoriesContainer storeId={storeId} initialItems={initialItems} />;
}
