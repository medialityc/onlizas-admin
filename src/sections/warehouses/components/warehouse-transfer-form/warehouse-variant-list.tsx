import { InventoryProductItem } from "@/services/inventory-providers";
import ProductTransferVariantCard from "./warehouse-transfer-varaint-item";
import { useCallback, useMemo, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

type SelectedProductItem = {
  id: string;
  productVariantId: number;
  quantityRequested: number;
  unit: string;
};

// Componente principal del selector de productos
type Props = {
  products: InventoryProductItem[];
};

const WarehouseVariantList = ({ products }: Props) => {
  const { control } = useFormContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<string>("");

  const { append, remove, fields } = useFieldArray({ control, name: "items" });

  const selectedProducts: SelectedProductItem[] = fields as any;

  // Obtener lista única de tiendas
  const stores = useMemo(() => {
    const uniqueStores = Array.from(
      new Set(products.map((p) => p.storeName).filter(Boolean))
    );
    return uniqueStores.sort();
  }, [products]);

  // Filtrar productos basado en búsqueda y tienda seleccionada
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchTerm ||
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStore =
        !selectedStore || product.storeName === selectedStore;

      return matchesSearch && matchesStore;
    });
  }, [products, searchTerm, selectedStore]);

  // Manejar toggle de selección de producto
  const handleToggleProduct = useCallback(
    (variant: InventoryProductItem) => {
      const variantId = variant.id;
      const variantIndex = selectedProducts?.findIndex(
        (item) => item.productVariantId === variantId
      );

      if (variantIndex) {
        remove(variantIndex);
      } else {
        append({
          productVariantId: variantId,
          quantityRequested: 1,
          unit: "U",
        });
      }
    },
    [selectedProducts, append, remove]
  );

  return (
    <div className="w-full space-y-4">
      {/* Controles de filtro */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Buscador por nombre */}
        <div className="flex-1">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Buscar por nombre
          </label>
          <input
            id="search"
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Selector de tienda */}
        <div className="sm:w-64">
          <label
            htmlFor="store"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Filtrar por tienda
          </label>
          <select
            id="store"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Todas las tiendas</option>
            {stores.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de productos */}
      <div className=" max-h-[60vh] overflow-y-auto">
        <div className="pr-2 space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No se encontraron productos con los filtros aplicados
            </div>
          ) : (
            filteredProducts.map((variant: InventoryProductItem) => {
              return (
                <ProductTransferVariantCard
                  key={variant.id}
                  variant={variant}
                  isSelected={
                    !!selectedProducts?.find(
                      (item) => item?.productVariantId === variant.id
                    )
                  }
                  onToggleSelect={handleToggleProduct}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default WarehouseVariantList;
