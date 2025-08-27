"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Store } from "@/types/stores";
import CategoriesToolbar from "./categories-toolbar";
import { mockCategories, type StoreCategory } from "./mock";

import DeleteDialog from "@/components/modal/delete-modal";
import CategoriesMetrics from "./components/categories-metrics";
import CategoryList from "./components/category-list";

interface Props {
  store: Store;
}

// Componente interno que usa el FormContext
function CategoriesContent({ store }: Props) {
  const methods = useForm<any>({
    defaultValues: {
      categoriesPayload: [],
      categoriesViewState: mockCategories
    }
  });

  const { register, setValue, getValues } = methods;
  // Rehidratar primero desde un estado "rico" guardado en RHF (no el payload plano)
  const viewState = getValues("categoriesViewState") as StoreCategory[] | undefined;
  const initial = viewState?.length
    ? viewState
    : ((getValues("categoriesPayload") as any[])?.length
      ? (getValues("categoriesPayload") as any[]).map((c: any, idx) => ({
          id: c.id ?? idx + 1,
          name: c.name ?? `Cat ${idx + 1}`,
          productCount: c.productCount ?? 0,
          views: c.views ?? 0,
          isActive: Boolean(c.isActive ?? true),
          order: c.order ?? idx + 1,
        }))
      : mockCategories);
  const [items, setItems] = useState<StoreCategory[]>(initial);
  const [source] = useState<string>(viewState?.length ? "form-view" : (getValues("categoriesPayload") as any[])?.length ? "form" : "mock");
  // const [openNew, setOpenNew] = useState(false); // NOTE: Crear categoría deshabilitado por ahora
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const totals = useMemo(() => {
    const total = items.length;
    const active = items.filter((c) => c.isActive).length;
    const products = items.reduce((acc, c) => acc + c.productCount, 0);
    return { total, active, products };
  }, [items]);

  // Register virtual fields: payload (plano para el back) y viewState (rico para rehidratación UI)
  useEffect(() => {
    register("categoriesPayload");
    register("categoriesViewState");
  }, [register]);

  // Sincronizar ambos: payload minimal para el envío y viewState rico para restaurar al volver al tab
  useEffect(() => {
    const payload = items.map((c, i) => ({ id: c.id, isActive: c.isActive, order: i + 1 }));
    setValue("categoriesPayload", payload, { shouldDirty: true, shouldTouch: false, shouldValidate: false });
    setValue("categoriesViewState", items, { shouldDirty: false, shouldTouch: false, shouldValidate: false });
  }, [items, setValue]);

  return (
    <div className="p-6 text-lg">
      <div className="text-xs text-gray-500 mb-2">Fuente: {source === "form" ? "Formulario" : "Mock"}</div>
      {/* Metrics header */}
      <CategoriesMetrics total={totals.total} active={totals.active} products={totals.products} />

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

// Componente principal que provee el FormProvider
export default function CategoriesContainer({ store }: Props) {
  const methods = useForm<any>({
    defaultValues: {
      categoriesPayload: [],
      categoriesViewState: mockCategories
    }
  });

  return (
    <FormProvider {...methods}>
      <CategoriesContent store={store} />
    </FormProvider>
  );
}
