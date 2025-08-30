import React from "react";
import { getStoreCategories } from "@/services/stores";
import CategoriesContainer from "./categories-container";
import { Store } from "@/types/stores";
import { adaptStoreCategories } from "./utils/adapter";

type Props = { store: Store };

export default async function CategoriesPanel({ store }: Props) {
  const res = await getStoreCategories(store.id);
  const raw: any[] = Array.isArray(res?.data)
    ? (res.data as any[])
    : Array.isArray((res?.data as any)?.data)
      ? ((res?.data as any).data as any[])
      : [];
  const initialItems = adaptStoreCategories(raw);

  return <CategoriesContainer store={store} initialItems={initialItems} />;
}
