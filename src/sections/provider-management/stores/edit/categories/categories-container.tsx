"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Store } from "@/types/stores";
import CategoriesToolbar from "./categories-toolbar";
import { mockCategories, type StoreCategory } from "./mock";
import { EyeIcon, ChartBarIcon } from "@heroicons/react/24/outline";
// import CategoryModal from "./category-modal"; // NOTE: Crear categoría deshabilitado por ahora
import DeleteDialog from "@/components/modal/delete-modal";
import { MetricCard } from "./components";
import CategoryList from "./components/category-list";

interface Props {
  store: Store;
}

export default function CategoriesContainer({ store }: Props) {
  const [items, setItems] = useState<StoreCategory[]>(mockCategories);
  const { register, setValue } = useFormContext();
  // const [openNew, setOpenNew] = useState(false); // NOTE: Crear categoría deshabilitado por ahora
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const totals = useMemo(() => {
    const total = items.length;
    const active = items.filter((c) => c.isActive).length;
    const products = items.reduce((acc, c) => acc + c.productCount, 0);
    return { total, active, products };
  }, [items]);

  // Register a virtual field to carry categories data in the global submit
  useEffect(() => {
    register("categoriesPayload");
  }, [register]);

  // Keep the RHF value in sync whenever items change
  useEffect(() => {
    const payload = items.map((c, i) => ({ id: c.id, isActive: c.isActive, order: i + 1 }));
    setValue("categoriesPayload", payload, { shouldDirty: true, shouldTouch: false });
  }, [items, setValue]);

  return (
    <div className="p-6 text-lg">
      {/* Metrics header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <MetricCard
          label="Total Categorías"
          value={totals.total}
          icon={<ChartBarIcon className="w-6 h-6 text-indigo-500" />}
        />
        <MetricCard
          label="Categorías Activas"
          value={totals.active}
          icon={<EyeIcon className="w-6 h-6 text-emerald-600" />}
        />
        <MetricCard
          label="Total Productos"
          value={totals.products}
          icon={<ChartBarIcon className="w-6 h-6 text-violet-600" />}
        />
      </div>

      {/* Toolbar */}
      <CategoriesToolbar />

      {/* List */}
      <CategoryList
        items={items}
        onItemsChange={setItems}
        onEdit={() => { /* TODO */ }}
        onDelete={(id) => setDeleteId(id)}
      />

      {/* Modals */}
      {/**
       * Crear categoría deshabilitado por ahora
       *
       * <CategoryModal
       *   open={openNew}
       *   onClose={() => setOpenNew(false)}
       *   onSubmit={(data) =>
       *     setItems((prev) => [
       *       {
       *         id: Math.max(0, ...prev.map((x) => x.id)) + 1,
       *         productCount: 0,
       *         views: 0,
       *         ...data,
       *       },
       *       ...prev,
       *     ])
       *   }
       * />
       */}

      <DeleteDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          setItems((prev) => prev.filter((x) => x.id !== deleteId));
          setDeleteId(null);
        }}
        title="Eliminar categoría"
        description="Esta acción eliminará la categoría seleccionada."
      />
    </div>
  );
}
