"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Store } from "@/types/stores";
import CategoriesToolbar from "./components/categories-toolbar";
import { mockCategories, type StoreCategory } from "./mock";
import { EyeIcon, ChartBarIcon } from "@heroicons/react/24/outline";
// import CategoryModal from "./category-modal"; // NOTE: Crear categoría deshabilitado por ahora
import DeleteDialog from "@/components/modal/delete-modal";
import MetricStatCard from "../components/metric-stat-card";
import CategoryList from "./components/category-list";

interface Props {
  store: Store;
}

export default function CategoriesContainer({ store }: Props) {
  const { register, setValue, getValues } = useFormContext();
  const initial = (getValues("categoriesPayload") as any[])?.length
    ? (getValues("categoriesPayload") as any[]).map((c: any, idx) => ({
        id: c.id ?? idx + 1,
        name: c.name ?? `Cat ${idx + 1}`,
        productCount: c.productCount ?? 0,
        views: c.views ?? 0,
        active: Boolean(c.active ?? true),
        order: c.order ?? idx + 1,
      }))
    : mockCategories;
  const [items, setItems] = useState<StoreCategory[]>(initial);
  const [source] = useState<string>((getValues("categoriesPayload") as any[])?.length ? "form" : "mock");
  // const [openNew, setOpenNew] = useState(false); // NOTE: Crear categoría deshabilitado por ahora
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const totals = useMemo(() => {
    const total = items.length;
    const active = items.filter((c) => c.active).length;
    const products = items.reduce((acc, c) => acc + c.productCount, 0);
    return { total, active, products };
  }, [items]);

  // Register a virtual field to carry categories data in the global submit
  useEffect(() => {
    register("categoriesPayload");
  }, [register]);

  // Keep the RHF value in sync whenever items change
  useEffect(() => {
    const payload = items.map((c, i) => ({ id: c.id, active: c.active, order: i + 1 }));
    setValue("categoriesPayload", payload, { shouldDirty: true, shouldTouch: false });
  }, [items, setValue]);

  return (
    <div className="p-6 text-lg">
  <div className="text-xs text-gray-500 mb-2">Fuente: {source === "form" ? "Formulario" : "Mock"}</div>
      {/* Metrics header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <MetricStatCard
          label="Total Categorías"
          value={totals.total}
          icon={<ChartBarIcon className="w-6 h-6 text-indigo-500" />}
        />
        <MetricStatCard
          label="Categorías Activas"
          value={totals.active}
          icon={<EyeIcon className="w-6 h-6 text-emerald-600" />}
        />
        <MetricStatCard
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
