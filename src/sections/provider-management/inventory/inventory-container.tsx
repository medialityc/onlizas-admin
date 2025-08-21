"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { DataGrid } from "@/components/datagrid/datagrid";
import type { DataTableColumn } from "mantine-datatable";
import { cn } from "@/lib/utils";
import { Select } from "@/components/select/select";
import type { SearchParams } from "@/types/fetch/request";
import { toast } from "react-toastify";
import ActionsMenu from "@/components/menu/actions-menu";
import InventoryDetailsModal from "./modals/inventory-details-modal";
import {
  InventoryFilter,
  InventoryItem,
  InventorySummary,
} from "@/types/inventory";
import {
  CubeIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  BuildingStorefrontIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return String(amount);
  }
}

export default function InventoryContainer() {
  const [loading, setLoading] = useState<boolean>(true);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filters, setFilters] = useState<InventoryFilter>({
    search: "",
    warehouse: "all",
    store: "all",
    status: "all",
  });
  const [searchParams, setSearchParams] = useState<SearchParams>({
    search: "",
    page: 1,
    pageSize: 10,
  });
  const [warehouseQuery, setWarehouseQuery] = useState("");
  const [storeQuery, setStoreQuery] = useState("");
  const [statusQuery, setStatusQuery] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selected, setSelected] = useState<InventoryItem | null>(null);

  const handleCreateInventory = () => {
    toast.info("Crear inventario - próximamente");
  };

  const openDetails = useCallback((item: InventoryItem) => {
    setSelected(item);
    setDetailsOpen(true);
  }, []);

  const handleEdit = useCallback((item: InventoryItem) => {
    toast.info(`Editar inventario de ${item.productName} — próximamente`);
  }, []);

  const handleDelete = useCallback((item: InventoryItem) => {
    toast.warn(`Eliminar inventario de ${item.productName} — próximamente`);
  }, []);

  const summary: InventorySummary = {
    totalItems: 173,
    totalValue: 73698.27,
    lowStockItems: 1,
    warehousesCount: 3,
  };

  // Mock warehouses
  const warehouses = [
    { id: 1, name: "Almacén Central" },
    { id: 2, name: "Almacén Norte" },
    { id: 3, name: "Almacén Sur" },
  ];

  // Mock stores
  const stores = [
    { id: 1, name: "TechStore Principal" },
    { id: 2, name: "TechStore Sucursal" },
  ];

  const statusOptions = [
    { id: "En Stock", name: "En Stock" },
    { id: "Stock Bajo", name: "Stock Bajo" },
    { id: "Sin Stock", name: "Sin Stock" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // TODO: Conectar con API real (no se puede usar directamente el servicio en cliente)
        // Por ahora usamos datos mockeados
        const mockInventoryItems: InventoryItem[] = [
          {
            id: 1,
            productId: 1,
            productName: "Laptop Gaming Pro X1",
            productCategory: "Electrónicos",
            productImage: "/assets/images/NEWZAS.svg",
            storeId: 1,
            storeName: "TechStore Principal",
            warehouseId: 1,
            warehouseName: "Almacén Central",
            variants: [
              { name: "RAM", value: "16GB", units: 25 },
              { name: "SSD", value: "512GB", units: 25 },
              { name: "RAM", value: "32GB", units: 20 },
              { name: "SSD", value: "1TB", units: 20 },
            ],
            quantity: 45,
            totalValue: 64499.55,
            status: "En Stock",
          },
          {
            id: 2,
            productId: 2,
            productName: "Mouse Inalámbrico RGB",
            productCategory: "Accesorios",
            productImage: "/assets/images/NEWZAS.svg",
            storeId: 1,
            storeName: "TechStore Principal",
            warehouseId: 2,
            warehouseName: "Almacén Norte",
            variants: [
              { name: "Color", value: "Negro", units: 60 },
              { name: "Color", value: "Blanco", units: 60 },
            ],
            quantity: 120,
            totalValue: 5998.8,
            status: "En Stock",
          },
          {
            id: 3,
            productId: 3,
            productName: "Monitor 4K 27 pulgadas",
            productCategory: "Monitores",
            productImage: "/assets/images/NEWZAS.svg",
            storeId: 2,
            storeName: "TechStore Sucursal",
            warehouseId: 3,
            warehouseName: "Almacén Sur",
            variants: [{ name: "Modelo", value: "Estándar", units: 8 }],
            quantity: 8,
            totalValue: 3199.92,
            status: "Stock Bajo",
          },
        ];
        setInventoryItems(mockInventoryItems);
      } catch (error) {
        console.error("Error fetching products:", error);
        setInventoryItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchSearch =
        !filters.search ||
        item.productName.toLowerCase().includes(filters.search.toLowerCase());

      const matchWarehouse =
        filters.warehouse === "all" || item.warehouseId === filters.warehouse;

      const matchStore =
        filters.store === "all" || item.storeId === filters.store;

      const matchStatus =
        filters.status === "all" || item.status === filters.status;

      return matchSearch && matchWarehouse && matchStore && matchStatus;
    });
  }, [inventoryItems, filters]);

  const columns = useMemo<DataTableColumn<InventoryItem>[]>(
    () => [
      {
        accessor: "productName",
        title: "Producto",
        width: 320,
        sortable: true,
        render: (item) => (
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-black-dark-light rounded-md" />
            <div className="ml-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-white/80-dark">
                {item.productName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {item.productCategory}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessor: "storeName",
        title: "Tienda",
        width: 220,
        sortable: true,
        render: (item) => (
          <div className="flex items-center">
            <BuildingStorefrontIcon className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-sm text-gray-900 dark:text-white/80-dark">
              {item.storeName}
            </span>
          </div>
        ),
      },
      {
        accessor: "warehouseName",
        title: "Almacén",
        width: 220,
        sortable: true,
        render: (item) => (
          <div className="flex items-center">
            <ArchiveBoxIcon className="h-4 w-4 text-purple-500 mr-1" />
            <span className="text-sm text-gray-900 dark:text-white/80-dark">
              {item.warehouseName}
            </span>
          </div>
        ),
      },
      {
        accessor: "variants",
        title: "Variantes",
        render: (item) => (
          <div className="text-sm text-gray-900 dark:text-white/80-dark">
            {item.variants.map((v, idx) => (
              <div key={idx}>
                {v.name}: {v.value}: {v.units} unidades
              </div>
            ))}
          </div>
        ),
      },
      {
        accessor: "quantity",
        title: "Stock",
        width: 100,
        sortable: true,
        render: (item) => (
          <span
            className={cn(
              item.quantity < 10
                ? "text-red-600 font-semibold"
                : "text-gray-900 dark:text-white/80-dark"
            )}
          >
            {item.quantity}
          </span>
        ),
      },
      {
        accessor: "totalValue",
        title: "Valor Total",
        width: 140,
        sortable: true,
        render: (item) => `$${formatCurrency(item.totalValue)}`,
      },
      {
        accessor: "status",
        title: "Estado",
        width: 140,
        sortable: true,
        render: (item) => (
          <span
            className={cn(
              "badge",
              item.status === "En Stock"
                ? "badge-outline-success"
                : item.status === "Stock Bajo"
                  ? "badge-outline-warning"
                  : "badge-outline-danger"
            )}
          >
            {item.status}
          </span>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        width: 70,
        render: (item) => (
          <ActionsMenu
            onViewDetails={() => openDetails(item)}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
          />
        ),
      },
    ],
    [openDetails, handleEdit, handleDelete]
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mi Inventario</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-4 min-h-[92px] dark:bg-gray-900 dark:border-gray-800">
          <div className="p-2 rounded-full bg-sky-50 dark:bg-sky-900/10">
            <CubeIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Total Items</div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white/80">
              {summary.totalItems}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-4 min-h-[92px] dark:bg-gray-900 dark:border-gray-800">
          <div className="p-2 rounded-full bg-green-50 dark:bg-green-900/10">
            <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Valor Total</div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white/80">
              ${formatCurrency(summary.totalValue)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-4 min-h-[92px] dark:bg-gray-900 dark:border-gray-800">
          <div className="p-2 rounded-full bg-green-50 dark:bg-red-900/10">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Stock Bajo</div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white/80">
              ${summary.lowStockItems}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-4 min-h-[92px] dark:bg-gray-900 dark:border-gray-800">
          <div className="rounded-full bg-purple-50 dark:bg-purple-900/10 p-2 mr-4">
            <BuildingStorefrontIcon className="h-8 w-8 text-purple-500 " />
          </div>
          <div>
            <div className="text-sm text-gray-500">Almacenes</div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white/80">
              ${summary.warehousesCount}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Almacén"
          placeholder="Todos los almacenes"
          options={warehouses}
          objectValueKey="id"
          objectKeyLabel="name"
          value={
            filters.warehouse === "all"
              ? undefined
              : (filters.warehouse as number)
          }
          onChange={(val) =>
            setFilters({ ...filters, warehouse: (val as number) ?? "all" })
          }
          query={warehouseQuery}
          setQuery={setWarehouseQuery}
        />
        <Select
          label="Tienda"
          placeholder="Todas las tiendas"
          options={stores}
          objectValueKey="id"
          objectKeyLabel="name"
          value={
            filters.store === "all" ? undefined : (filters.store as number)
          }
          onChange={(val) =>
            setFilters({ ...filters, store: (val as number) ?? "all" })
          }
          query={storeQuery}
          setQuery={setStoreQuery}
        />
        <Select
          label="Estado"
          placeholder="Todos los estados"
          options={statusOptions}
          objectValueKey="id"
          objectKeyLabel="name"
          value={filters.status === "all" ? undefined : (filters.status as any)}
          onChange={(val) =>
            setFilters({ ...filters, status: (val as any) ?? "all" })
          }
          query={statusQuery}
          setQuery={setStatusQuery}
        />
      </div>

      <div className=" border border-gray-100 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Inventario por Producto ({filteredItems.length} items)
          </h2>
        </div>

        <div className="p-4">
          <DataGrid<InventoryItem>
            simpleData={filteredItems}
            columns={columns}
            searchParams={searchParams}
            onSearchParamsChange={(params) => {
              setSearchParams(params);
              setFilters((f) => ({ ...f, search: params.search || "" }));
            }}
            searchPlaceholder="Buscar productos..."
            emptyText="No se encontraron productos"
            className="mt-0"
            onCreate={handleCreateInventory}
            createText="Crear Inventario"
          />
        </div>
      </div>

      {/* Modal de Detalles */}
      <InventoryDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        item={selected}
      />
    </div>
  );
}
