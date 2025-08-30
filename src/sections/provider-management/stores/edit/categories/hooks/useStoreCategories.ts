"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { StoreCategory } from "../mock";
import { getStoreCategories, toggleStoreCategoryStatus, updateStoreCategoriesOrder } from "@/services/stores";
import { adaptStoreCategories } from "../utils/adapter";
import { toast } from "react-toastify";

export function useStoreCategories(storeId: number, initialItems?: StoreCategory[]) {
	const [items, setItems] = useState<StoreCategory[]>(initialItems ?? []);
	const [loading, setLoading] = useState(!initialItems);
	const [saving, setSaving] = useState(false);

	const totals = useMemo(() => {
		const total = items.length;
		const active = items.filter((c) => c.isActive).length;
		const products = items.reduce((acc, c) => acc + (c.productCount ?? 0), 0);
		return { total, active, products };
	}, [items]);

	// Carga inicial simple (si no vienen initialItems desde el server)
	useEffect(() => {
		if (initialItems && initialItems.length) return; // ya tenemos datos iniciales
		let mounted = true;
		setLoading(true);
		(async () => {
			try {
				const res = await getStoreCategories(storeId);
				const raw: any[] = Array.isArray(res?.data)
					? (res.data as any[])
					: Array.isArray((res?.data as any)?.data)
						? ((res?.data as any).data as any[])
						: [];
				if (mounted && res && !res.error) {
					setItems(adaptStoreCategories(raw));
				} else if (res?.error) {
					toast.error(res?.message || "Error al cargar categorías");
					setItems([]);
				}
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, [storeId, initialItems]);

	// Si el server nos manda nuevos initialItems tras un router.refresh, sincronizar el estado local
	useEffect(() => {
		if (initialItems) {
			setItems(initialItems);
			setLoading(false);
		}
	}, [initialItems]);

	// Guardar orden actual (PUT JSON)
	const handleSaveOrder = useCallback(async () => {
		try {
			setSaving(true);
			const orders = items.map((c, idx) => ({ categoryId: Number(c.id), order: idx + 1 })); // base 1
			const res = await updateStoreCategoriesOrder(storeId, orders);
			if (res?.error) {
				toast.error(res?.message || "No se pudo organizar sus categorías");
				return res;
			}
			toast.success("Orden guardado correctamente");
			// Mantener el estado local como fuente de verdad; actualizar campo order por consistencia
			setItems(prev => prev.map((c, idx) => ({ ...c, order: idx + 1 })));
			return res;
		} catch {
			toast.error("Ocurrió un error al guardar el orden");
		} finally {
			setSaving(false);
		}
	}, [items, storeId]);

	// Toggle activo/inactivo
	const handleToggle = useCallback(async (id: number, checked: boolean) => {
		// Optimista
		setItems(prev => prev.map(x => x.id === id ? { ...x, isActive: checked } : x));
		const res = await toggleStoreCategoryStatus(id);
		if (res?.error) {
			setItems(prev => prev.map(x => x.id === id ? { ...x, isActive: !checked } : x));
			toast.error(res?.message || "No se pudo actualizar el estado");
		} else {
			toast.success(checked ? "Categoría activada" : "Categoría desactivada");
		}
	}, []);

	return { items, setItems, loading, saving, totals, handleSaveOrder, handleToggle } as const;
}

