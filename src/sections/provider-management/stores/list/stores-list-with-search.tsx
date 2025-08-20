"use client";

import { useCallback, useState, useEffect } from "react";

import { Store } from "@/types/stores";
import { GetAllStores } from "@/types/stores";
import { SearchParams } from "@/types/fetch/request";
import { useModalState } from "@/hooks/use-modal-state";
import { Button } from "@/components/button/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import Badge from "@/components/badge/badge";
import {
  ArrowTrendingUpIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import IconGlobe from "@/components/icon/icon-globe";
import IconSettings from "@/components/icon/icon-settings";
import { getAllStores } from "@/services/stores";
import { IQueryable } from "@/types/fetch/request";

interface StoresListProps {
  data?: GetAllStores;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function StoresList({ data }: StoresListProps) {
  const { openModal } = useModalState();

  const handleCreateStore = useCallback(() => openModal("create"), [openModal]);

  const handleViewStore = useCallback(
    (store: Store) => openModal<number>("view", store.id),
    [openModal]
  );

  function handleProducts(store: Store): void {
    throw new Error("Function not implemented.");
  }

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Store[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce manual para la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const params: IQueryable = {
        search: term,
        pageSize: 10,
        page: 1,
      };

      const response = await getAllStores(params);
      if (response.data) {
        setSearchResults(response.data.data || []);
      }
    } catch (error) {
      console.error("Error searching stores:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Métricas agregadas
  const totalStores = data?.data.length ?? 0;
  const activeStores = data?.data.filter((s) => s.isActive).length ?? 0;
  const totalVisits = data?.data.reduce(
    (acc, s) => acc + (s.metrics?.monthlyVisits ?? 0),
    0
  );
  const avgConversion = data?.data.length
    ? (
        data.data.reduce(
          (acc, s) => acc + (s.metrics?.conversionRate ?? 0),
          0
        ) / data.data.length
      ).toFixed(1)
    : "0";

  // Datos a mostrar (búsqueda o todos)
  const displayData =
    searchResults.length > 0 && searchTerm ? searchResults : data?.data || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {/*  <h1 className="text-2xl font-bold">TechStore Solutions</h1>
          <p className="text-sm text-gray-500">Gestión de Tiendas</p> */}
        </div>
        <div className="flex items-center gap-4">
          {/* Componente de búsqueda */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar tienda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[250px]"
            />
            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                <div className="px-4 py-2 text-sm text-gray-500">
                  Buscando...
                </div>
              </div>
            )}
            {searchResults.length > 0 && searchTerm && !isSearching && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {searchResults.map((store) => (
                  <div
                    key={store.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      handleViewStore(store);
                      setSearchTerm("");
                      setSearchResults([]);
                    }}
                  >
                    <div className="font-medium">{store.name}</div>
                    <div className="text-sm text-gray-500">{store.url}</div>
                  </div>
                ))}
              </div>
            )}
            {searchResults.length === 0 && searchTerm && !isSearching && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="px-4 py-2 text-sm text-gray-500">
                  No se encontraron tiendas
                </div>
              </div>
            )}
          </div>
          <Button onClick={handleCreateStore}>+ Nueva Tienda</Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<BuildingStorefrontIcon className="h-6 w-6 text-primary" />}
          label="Tiendas Activas"
          value={activeStores}
        />
        <MetricCard
          icon={<BuildingStorefrontIcon className="h-6 w-6 text-primary" />}
          label="Total Tiendas"
          value={totalStores}
        />
        <MetricCard
          icon={<ChartBarIcon className="h-6 w-6 text-primary" />}
          label="Visitas Mensuales"
          value={totalVisits?.toLocaleString() || 0}
        />
        <MetricCard
          icon={<ArrowTrendingUpIcon className="h-6 w-6 text-primary" />}
          label="Conversión Promedio"
          value={`${avgConversion}%`}
        />
      </div>

      {/* Tarjetas de tiendas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayData.map((store) => (
          <Card key={store.id} className="p-4 space-y-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{store.name}</CardTitle>
                <Badge variant={store.isActive ? "primary" : "secondary"}>
                  {store.isActive ? "Activa" : "Inactiva"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <IconGlobe className="w-4 h-4 mr-2" />
                {store.url}
              </div>
              <p className="text-sm text-gray-600">{store.description}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700 font-medium mt-3">
                <p className="text-muted-foreground">
                  Productos: {store.metrics?.totalProducts}
                </p>
                <p>Categorías: {store.metrics?.totalCategories}</p>
                <p>Visitas/mes: {store.metrics?.monthlyVisits}</p>
                <p>Conversión: {store.metrics?.conversionRate}%</p>
              </div>
              <div className="flex justify-between mt-4">
                <Button onClick={() => handleViewStore(store)}>
                  {" "}
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button onClick={() => handleProducts(store)}>
                  <IconSettings className="w-4 h-4 mr-1" />
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Componente auxiliar para métricas
function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-4">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-dark">{value}</p>
      </div>
    </div>
  );
}
