import React from "react";
import { getStoreCategories } from "@/services/stores";
import CategoriesContainer from "./categories-container";
import { Store } from "@/types/stores";

type Props = { store: Store };

export default async function CategoriesPanel({ store }: Props) {
  const res = await getStoreCategories(store.id);
  const initialItems = Array.isArray(res?.data)
    ? res.data.map((c: any, idx: number) => ({
        id: Number(c.categoryId ?? idx + 1),
        name: c.categoryName ?? `Cat ${idx + 1}`,
        productCount: Number(c.productCount ?? 0),
        views: Number(c.views ?? 0),
        isActive: Boolean(c.isActive ?? true),
        order: Number(c.order ?? idx + 1),
      }))
    : [];

  return <CategoriesContainer store={store}  />;
}
