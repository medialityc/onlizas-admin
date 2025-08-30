"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Store } from "@/types/stores";
import type { StoreCategory } from "./mock";

import DeleteDialog from "@/components/modal/delete-modal";
import CategoriesMetrics from "./components/categories-metrics";
import CategoryList from "./components/category-list";
import CategoriesToolbar from "./components/categories-toolbar";
import { getStoreCategories, toggleStoreCategoryStatus, updateStoreCategoriesOrder } from "@/services/stores";
import { toast } from "react-toastify";

interface Props { store: Store }

function CategoriesContent({ store }: Props) {
  const [items, setItems] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const totals = useMemo(() => {
    const total = items.length;
    const active = items.filter((c) => c.isActive).length;
    const products = items.reduce((acc, c) => acc + (c.productCount ?? 0), 0);
    return { total, active, products };
  }, [items]);

  // Refrescar solo la lista (con opción de skeleton)
  const refreshList = useCallback(async (showSkeleton: boolean = true) => {
    let mounted = true;
    if (showSkeleton) setLoading(true);
    try {
      const res = await getStoreCategories(store.id);
      // backend puede responder como array directo o como { data: [] }
      const raw: any[] = Array.isArray(res?.data)
        ? (res.data as any[])
        : Array.isArray((res?.data as any)?.data)
          ? ((res?.data as any).data as any[])
          : [];

      if (mounted && res && !res.error && Array.isArray(raw)) {
        const adapted: StoreCategory[] = raw
          .map((c: any, idx: number) => ({
            id: Number(c.categoryId ?? idx + 1),
            name: c.categoryName ?? `Cat ${idx + 1}`,
            productCount: Number(c.productCount ?? 0),
            views: Number(c.views ?? 0),
            isActive: Boolean(c.isActive ?? true),
            order: Number(c.order ?? idx + 1),
          }))
          // visualiza según order ascendente
          .sort((a, b) => a.order - b.order);
        setItems(adapted);
      } else if (res?.error) {
        toast.error(res?.message || "Error al cargar categorías");
        setItems([]);
      }
    } finally {
      if (showSkeleton) setLoading(false);
    }
    return () => { mounted = false; };
  }, [store.id]);

  // Carga inicial
  useEffect(() => {
    void refreshList(true);
  }, [refreshList]);

  // Guardar orden actual (PUT JSON)
  const handleSaveOrder = useCallback(async () => {
    try {
      setSaving(true);
      const orders = items.map((c, idx) => ({ categoryId: Number(c.id), order: idx + 1 })); // base 1
      const res = await updateStoreCategoriesOrder(store.id, orders);
      console.log(orders)
      if (res?.error) {
        toast.error(res?.message || "No se pudo organizar sus categorías");
        return res;
      }
      toast.success("Orden guardado correctamente");
    // Refrescar solo la lista (con skeleton)
    await refreshList(true);
      return res;
    } catch (e) {
      toast.error("Ocurrió un error al guardar el orden");
    } finally {
      setSaving(false);
    }
  }, [items, store.id, refreshList]);

  // Toggle activo/inactivo
  const handleToggle = useCallback(async (id: number, checked: boolean) => {
    // Optimista
    setItems(prev => prev.map(x => x.id === id ? { ...x, isActive: checked } : x));
    const res = await toggleStoreCategoryStatus(id);
    console.log(res,"toggle")
    if (res?.error) {
      setItems(prev => prev.map(x => x.id === id ? { ...x, isActive: !checked } : x));
      toast.error(res?.message || "No se pudo actualizar el estado");
    } else {
      toast.success(checked ? "Categoría activada" : "Categoría desactivada");
    // Refrescar en segundo plano (sin skeleton) para traer el order real
    void refreshList(false);
    }
  }, [refreshList]);

  return (
    <div className="p-6 text-lg">
      {/* Metrics header */}
      <CategoriesMetrics total={totals.total} active={totals.active} products={totals.products} />

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
        <CategoriesToolbar />
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-md bg-primary text-white disabled:opacity-50"
            disabled={loading || saving || items.length === 0}
            onClick={() => { void handleSaveOrder(); }}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {/* List */}
      <CategoryList
        items={items}
        onItemsChange={setItems}
        onToggle={handleToggle}
        onEdit={() => { /* TODO */ }}
        onDelete={(id) => {return}}
        loading={loading}
      />


      {/*  <DeleteDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          setItems((prev) => prev.filter((x) => x.id !== deleteId));
          setDeleteId(null);
        }}
        title="Eliminar categoría"
        description="Esta acción eliminará la categoría seleccionada."
      /> */}
    </div>
  );
}

// Componente principal que provee el FormProvider
export default function CategoriesContainer({ store }: Props) {
  return <CategoriesContent store={store} />;
}
