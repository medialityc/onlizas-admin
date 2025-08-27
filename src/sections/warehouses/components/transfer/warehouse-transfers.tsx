"use client";

import { Warehouse } from "@/types/warehouses";
import { Button } from "@/components/button/button";
import { useEffect, useMemo, useState } from "react";
import { mockTransferData } from "@/services/warehouses-mock";
// icons now used inside components
import { useQuery } from "@tanstack/react-query";
import { getAllWarehouses } from "@/services/warehouses-mock";
import { useForm } from "react-hook-form";
import DestinationSelect from "./components/DestinationSelect";
import TransferItemCard from "./components/TransferItemCard";
import InventorySearch from "./components/InventorySearch";

interface WarehouseTransfersProps {
  warehouse: Warehouse;
}

export function WarehouseTransfers({ warehouse }: WarehouseTransfersProps) {
  const [selectedQuantities, setSelectedQuantities] = useState<
    Record<number, number>
  >({});
  // Carrito de transferencia: key = productId
  const [cart, setCart] = useState<
    Record<
      number,
      {
        item: any;
        quantities: Record<number, number>; // variantId -> qty
      }
    >
  >({});

  // Form para el selector de almacén
  const methods = useForm({
    defaultValues: {
      destinationWarehouseId: "",
    },
  });

  const { watch } = methods;
  const watchedDestinationId = watch("destinationWarehouseId");

  // Obtener lista de almacenes disponibles
  const { data: warehousesResponse } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getAllWarehouses({}),
  });

  // Filtrar almacenes disponibles (excluir el actual) y crear opciones para el select
  const availableWarehouses =
    warehousesResponse?.data?.data?.filter((w) => w.id !== warehouse.id) || [];
  const warehouseOptions = availableWarehouses.map((w) => ({
    value: w.id.toString(),
    label: `${w.name} - ${w.type === "physical" ? "Físico" : "Virtual"}`,
  }));

  const handleQuantityChange = (variantId: number, delta: number) => {
    setSelectedQuantities((prev) => {
      const current = prev[variantId] || 0;
      const newValue = Math.max(0, current + delta);
      return { ...prev, [variantId]: newValue };
    });
  };
  const leftSelectionTotal = useMemo(
    () => Object.values(selectedQuantities).reduce((sum, qty) => sum + qty, 0),
    [selectedQuantities]
  );
  const cartTotalItems = useMemo(() => {
    return Object.values(cart).reduce((sum, entry) => {
      return (
        sum + Object.values(entry.quantities).reduce((s, q) => s + (q || 0), 0)
      );
    }, 0);
  }, [cart]);

  const [query, setQuery] = useState("");
  const filteredTransfers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockTransferData;
    return mockTransferData.filter(
      (item) =>
        item.productName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.supplier.toLowerCase().includes(q) ||
        item.variants.some(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            (v.storage?.toLowerCase() || "").includes(q) ||
            (v.color?.toLowerCase() || "").includes(q)
        )
    );
  }, [query]);

  // Estado para autocomplete múltiple (seleccionados bajo el buscador)
  const [selectedSearchItems, setSelectedSearchItems] = useState<
    Record<number, any>
  >({});
  const suggestions = useMemo(() => {
    const selectedIds = new Set(Object.keys(selectedSearchItems).map(Number));
    // Siempre ofrecer sugerencias basadas en filteredTransfers (si query vacío, trae la lista por defecto)
    return filteredTransfers
      .filter((it) => !selectedIds.has(it.id))
      .slice(0, 20)
      .map((it) => ({
        id: it.id,
        label: it.productName,
        subtitle: `${it.category} · ${it.supplier}`,
      }));
  }, [filteredTransfers, selectedSearchItems]);

  const selectedChips = useMemo(
    () =>
      Object.values(selectedSearchItems).map((it: any) => ({
        id: it.id,
        label: it.productName,
        subtitle: `${it.category} · ${it.supplier}`,
      })),
    [selectedSearchItems]
  );

  const handleSelectSuggestion = (id: number) => {
    const item = mockTransferData.find((i) => i.id === id);
    if (!item) return;
    setSelectedSearchItems((prev) => ({ ...prev, [id]: item }));
  };
  const handleRemoveSelected = (id: number) => {
    setSelectedSearchItems((prev) => {
      const next = { ...prev } as Record<number, any>;
      delete next[id];
      return next;
    });
  };

  const handleTransfer = () => {
    if (!watchedDestinationId) {
      alert("Por favor selecciona un almacén destino");
      return;
    }
    if (cartTotalItems === 0) {
      alert("Por favor selecciona al menos un producto para transferir");
      return;
    }
    // Aquí se implementaría la lógica de transferencia usando el carrito
    const payload = Object.values(cart).map((c) => ({
      productId: c.item.id,
      variants: Object.entries(c.quantities).map(([variantId, qty]) => ({
        variantId: Number(variantId),
        quantity: qty,
      })),
    }));
    console.log("Transferir:", payload, "a almacén:", watchedDestinationId);
  };

  const handleAddToCart = (productId: number) => {
    // Buscar item en la lista filtrada
    const item = filteredTransfers.find((i) => i.id === productId);
    if (!item) return;
    // Tomar cantidades seleccionadas actuales para sus variantes
    const quantities: Record<number, number> = {};
    for (const v of item.variants) {
      const qty = selectedQuantities[v.id] || 0;
      if (qty > 0) quantities[v.id] = qty;
    }
    if (Object.keys(quantities).length === 0) return; // nada seleccionado
    setCart((prev) => ({
      ...prev,
      [item.id]: { item, quantities },
    }));
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => {
      const next = { ...prev } as Record<
        number,
        { item: any; quantities: Record<number, number> }
      >;
      delete next[productId];
      return next;
    });
  };

  // Mantener sincronizado el carrito con las cantidades seleccionadas a la izquierda
  useEffect(() => {
    if (Object.keys(cart).length === 0) return;
    setCart((prev) => {
      const next: typeof prev = {} as any;
      for (const [pid, entry] of Object.entries(prev)) {
        const item = (entry as any).item as any;
        const quantities: Record<number, number> = {};
        for (const v of item.variants) {
          const qty = selectedQuantities[v.id] || 0;
          if (qty > 0) quantities[v.id] = qty;
        }
        if (Object.keys(quantities).length > 0) {
          next[Number(pid)] = { item, quantities } as any;
        }
      }
      // shallow compare keys and quantities
      const prevKeys = Object.keys(prev).sort();
      const nextKeys = Object.keys(next).sort();
      if (prevKeys.length !== nextKeys.length) return next;
      for (let i = 0; i < prevKeys.length; i++) {
        if (prevKeys[i] !== nextKeys[i]) return next;
        const pk = Number(prevKeys[i]);
        const pq = (prev as any)[pk].quantities as Record<number, number>;
        const nq = (next as any)[pk].quantities as Record<number, number>;
        const pqKeys = Object.keys(pq).sort();
        const nqKeys = Object.keys(nq).sort();
        if (pqKeys.length !== nqKeys.length) return next;
        for (let j = 0; j < pqKeys.length; j++) {
          if (pqKeys[j] !== nqKeys[j]) return next;
          const k = Number(pqKeys[j]);
          if ((pq as any)[k] !== (nq as any)[k]) return next;
        }
      }
      return prev; // no changes
    });
  }, [selectedQuantities, cart]);

  // const onSubmit = handleSubmit((data) => {
  //   handleTransfer();
  // });
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Transferencias de Inventario
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda: Inventario del almacén actual */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Inventario del almacén actual
            </h3>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Selección actual: {leftSelectionTotal}
            </div>
          </div>
          <div className="mb-4">
            <InventorySearch
              query={query}
              onQueryChange={setQuery}
              suggestions={suggestions}
              onSelect={handleSelectSuggestion}
              selected={selectedChips}
              onRemove={handleRemoveSelected}
            />
          </div>
          <div className="space-y-6">
            {Object.keys(selectedSearchItems).length > 0 ? (
              Object.values(selectedSearchItems).map((item: any) => (
                <TransferItemCard
                  key={item.id}
                  item={item as any}
                  selectedQuantities={selectedQuantities}
                  onChange={handleQuantityChange}
                  onAdd={handleAddToCart}
                  isAdded={Boolean(cart[item.id])}
                />
              ))
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Toca el buscador para ver el listado y selecciona productos para
                empezar.
              </p>
            )}
          </div>
        </div>

        {/* Columna derecha: Selector de destino + carrito */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Seleccionar almacén destino
            </h3>
            <DestinationSelect methods={methods} options={warehouseOptions} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Inventario seleccionado
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total: {cartTotalItems} unidades
              </span>
            </div>
            {Object.keys(cart).length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aún no has agregado productos a la transferencia.
              </p>
            ) : (
              <div className="space-y-4">
                {Object.values(cart).map((entry) => (
                  <div
                    key={entry.item.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-md p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {entry.item.productName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {entry.item.category} - {entry.item.supplier}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromCart(entry.item.id)}
                        className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                        title="Quitar del carrito"
                      >
                        Quitar
                      </button>
                    </div>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {entry.item.variants
                        .filter((v: any) => entry.quantities[v.id] > 0)
                        .map((v: any) => (
                          <li key={v.id} className="flex justify-between">
                            <span>
                              {v.name}
                              {v.storage ? ` · ${v.storage}` : ""}
                              {v.color ? ` · ${v.color}` : ""}
                            </span>
                            <span className="font-medium">
                              x{entry.quantities[v.id]}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Button
                variant="primary"
                onClick={handleTransfer}
                disabled={!watchedDestinationId || cartTotalItems === 0}
              >
                Confirmar transferencia
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
