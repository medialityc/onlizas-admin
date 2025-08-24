"use client";

import { SearchInput } from "@/components/search/search-input";
import { useMemo, useState } from "react";
import { mockInventoryData } from "@/services/warehouses-mock";
import InventoryCard from "./components/InventoryCard";

// Props removed; data is mocked for now.

export function WarehouseInventory() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrar inventarios por búsqueda (memoizado)
  const filteredInventory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return mockInventoryData;
    return mockInventoryData.filter(
      (item) =>
        item.productName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.supplier.toLowerCase().includes(q) ||
        item.variants.some((v) => {
          const name = v.name.toLowerCase().includes(q);
          const storage = (v.storage?.toLowerCase() || "").includes(q);
          const color =
            "color" in v ? (v.color?.toLowerCase() || "").includes(q) : false;
          const processor =
            "processor" in v
              ? (v.processor?.toLowerCase() || "").includes(q)
              : false;
          return name || storage || color || processor;
        })
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Inventarios del Almacén
        </h2>
        <div className="flex items-center gap-2">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar por nombre, categoría, proveedor o variante..."
            className="w-full md:w-96"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>Resultados: {filteredInventory.length}</span>
      </div>

      <div className="space-y-4">
        {filteredInventory.map((item) => (
          <InventoryCard key={item.id} item={item as any} query={searchQuery} />
        ))}

        {filteredInventory.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              {searchQuery
                ? "No se encontraron inventarios que coincidan con tu búsqueda"
                : "No hay inventarios en este almacén"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
