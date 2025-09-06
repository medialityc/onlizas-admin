"use client";

import React from "react";
import { StoreCategory } from "@/types/store-categories";
import CategoriesMetrics from "./components/categories-metrics";
import CategoryList from "./components/category-list";
import CategoriesToolbar from "./components/categories-toolbar";
import { useStoreCategories } from "./hooks/useStoreCategories";
import { useRouter } from "next/navigation";
import LoaderButton from "@/components/loaders/loader-button";
import { toast } from "react-toastify";

interface Props { storeId: number; initialItems?: StoreCategory[] }

function CategoriesContent({ storeId, initialItems }: Props) {
  const router = useRouter();
  const { items, setItems, loading, saving, totals, handleSaveOrder, handleToggle } = useStoreCategories(storeId, initialItems);

  // Handlers (avoid inline logic in JSX)
  const onSaveClick = async () => {
    try {
      await handleSaveOrder();
      router.refresh();
    } catch (err) {
      toast.error("Ocurrió un error al guardar el orden");
    }
  };

  const onToggleItem = async (id: number, checked: boolean) => {
    try {
      await handleToggle(id, checked);
      router.refresh();
    } catch (err) {
      toast.error("Ocurrió un error al actualizar el estado");
    }
  };

  return (
    <div className="p-6 text-lg bg-white dark:bg-gray-900">
      {/* Metrics header */}
      <CategoriesMetrics total={totals.total} active={totals.active} products={totals.products} />

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
        <CategoriesToolbar />
        <div className="flex items-center gap-2">
          <LoaderButton
            type="button"
            className="px-3 py-1.5 rounded-md bg-primary text-white disabled:opacity-50"
            disabled={loading || saving || items.length === 0}
            onClick={onSaveClick}
            loading={saving}
          >
            Guardar cambios
          </LoaderButton>
        </div>
      </div>

      {/* List */}
      <CategoryList
        items={items}
        onItemsChange={setItems}
        onToggle={onToggleItem}
        onEdit={() => { /* TODO */ }}
        onDelete={(id) => { return }}
        loading={loading}
      />


    </div>
  );
}


export default function CategoriesContainer({ storeId, initialItems }: Props) {
  return <CategoriesContent storeId={storeId} initialItems={initialItems} />;
}
