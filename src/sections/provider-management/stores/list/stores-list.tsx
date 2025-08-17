"use client";

import { useMemo, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Store } from "@/types/stores";
import { GetAllStores } from "@/types/stores";
import { SearchParams } from "@/types/fetch/request";
import { useModalState } from "@/hooks/use-modal-state";
import { deleteStore } from "@/services/stores";
import showToast from "@/config/toast/toastConfig";

import { Button } from "@/components/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import Badge from "@/components/badge/badge"; // Asumiendo que tienes un componente Badge
//import { IconStore, IconChartBar, IconTrendingUp } from "@tabler/icons-react"; // O cualquier set de íconos
import {
  ArrowTrendingUpIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  EyeIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/24/outline";
import {
  Cog6ToothIcon,
  GlobeAltIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import IconGlobe from "@/components/icon/icon-globe";
import IconSettings from "@/components/icon/icon-settings";
import { useState } from "react";

import { getAllStores } from "@/services/stores";
import { IQueryable } from "@/types/fetch/request";
import { DataGridHeader } from "@/components/datagrid";

interface StoresListProps {
  data?: GetAllStores;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
  onCreateStore: () => void;
  onViewStore: (store: Store) => void;
  onConfigureStore: (store: Store) => void;
}

export function StoresList({
  data,
  searchParams,
  onSearchParamsChange,  
  onConfigureStore
}: StoresListProps) {
  const { getModalState, openModal, closeModal } = useModalState();
  const queryClient = useQueryClient();

  const createStoreModal = getModalState("create");
  const editStoreModal = getModalState<number>("edit");
  const viewStoreModal = getModalState<number>("view");

  const selectedStore = useMemo(() => {
    const id = editStoreModal.id || viewStoreModal.id;
    if (!id || !data?.data) return null;
    return data.data.find((store) => store.id == id);
  }, [editStoreModal, viewStoreModal, data?.data]);

  const handleCreateStore = useCallback(() => openModal("create"), [openModal]);
  const handleEditStore = useCallback(
    (store: Store) => openModal<number>("edit", store.id),
    [openModal]
  );
  const handleViewStore = useCallback(
    (store: Store) => openModal<number>("view", store.id),
    [openModal]
  );

  const handleDeleteStore = useCallback(
    async (store: Store) => {
      try {
        const res = await deleteStore(store.id as number);
        if (res?.error && res.message) {
          console.error(res);
          showToast(res.message, "error");
        } else {
          queryClient.invalidateQueries({ queryKey: ["stores"] });
          showToast("Tienda eliminada correctamente", "success");
        }
      } catch (error) {
        console.error(error);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    [queryClient]
  );

  function handleProducts(store: Store): void {
    throw new Error("Function not implemented.");
  }

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

    const [searchValue, setSearchValue] = useState(searchParams.search || "");

  // Cada vez que cambie el input, informamos al padre
  useEffect(() => {
    onSearchParamsChange({
      ...searchParams,
      search: searchValue.trim(),
    });
  }, [searchValue]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <div> */}
      {/*  <h1 className="text-2xl font-bold">TechStore Solutions</h1>
          <p className="text-sm text-gray-500">Gestión de Tiendas</p> */}
      {/* </div>
        <Button onClick={handleCreateStore}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Crear Tienda
        </Button>
      </div> */}


      
      <DataGridHeader /* TEST TEMPORAL*/
        enableSearch
        searchPlaceholder="Buscar tiendas..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        //onCreate={handleCreateStore}
        //createText="Crear tienda"
        // deshabilitamos el toggle de columnas y demás si no lo usas
        rightActions={[
        <Button
          key="create"
          onClick={handleCreateStore}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded"
        >
          <PlusIcon className="w-4 h-4 mr-2 text-white" />
          Crear tienda
        </Button>,
      ]}
        enableColumnToggle={false}
        customActions={null}
        columns={[]}
        hiddenColumns={[]}
        onToggleColumn={function (columnAccessor: string): void {
          throw new Error("Function not implemented.");
        }}
        showColumnSelector={false}
        onToggleColumnSelector={function (): void {
          throw new Error("Function not implemented.");
        }}
      />

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* <MetricCard
          icon={<BuildingStorefrontIcon className="h-6 w-6 text-primary" />}
          label="Tiendas Activas"
          value={activeStores}
        /> */}
        <MetricCard
          icon={<BuildingStorefrontIcon className="h-6 w-6 text-primary" />}
          label="Total Tiendas"
          value={totalStores}
        />
        <MetricCard
          icon={<EyeIcon className="w-4 h-4 text-primary" />}
          label="Visitas Mensuales"
          value={totalVisits?.toLocaleString() || 0}
        />
        {/*   <MetricCard
          icon={<ArrowTrendingUpIcon className="h-6 w-6 text-primary" />}
          label="Conversión Promedio"
          value={`${avgConversion}%`}
        /> */}
        <MetricCard
          icon={<ChartBarIcon className="h-6 w-6 text-primary" />}
          label="Total de Ventas"
          value="8000" /* {totalStores} */
        />
        <MetricCard
          icon={<ArrowTrendingUpIcon className="h-6 w-6 text-primary" />}
          label="Total Ingresos"
          value="$ 20,000" /* {totalStores} */
        />
      </div>

      {/* Tarjetas de tiendas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data.map((store) => (
          <Card
            key={store.id}
            className="h-full min-h-[350px] flex flex-col justify-between p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="pb-0 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {store.logo && (
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border-2 border-gray-300">
                      <img 
                        src={store.logo} 
                        alt={`${store.name} logo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  {!store.logo && (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center border-2 border-gray-400">
                      <BuildingStorefrontIcon className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {store.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={store.isActive ? "primary" : "outline-primary"}>
                  {store.isActive ? "Activa" : "Inactiva"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-1 flex-grow flex flex-col justify-between">
              <div className="flex items-center text-base text-muted-foreground">
                <IconGlobe className="w-4 h-4 mr-2 " />
                <span className="text-pretty font-semibold ">/{store.url}</span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 mt-3">
                <p className="">
                  <span className="font-medium">Productos:</span>{" "}
                  {store.metrics?.totalProducts}
                </p>
                <p className="">
                  <span className="font-medium">Categorías:</span>{" "}
                  {store.metrics?.totalCategories}
                </p>
                <p className="">
                  <span className="font-medium">Visitas/mes:</span>{" "}
                  {store.metrics?.monthlyVisits}
                </p>
                <p className="">
                  <span className="font-medium">Conversión:</span>{" "}
                  {store.metrics?.conversionRate}%
                </p>
                <p className="">
                  <span className="font-medium">Ventas del mes:</span>{" "}
                  {store.ventasDelMes}
                </p>
                <p className="  overflow-hidden">
                  <span className="font-medium">Ingresos del mes:</span> $
                  {store.ingresosDelMes.toLocaleString()}
                </p>
                <p className="">
                  <span className="font-medium">Total ventas:</span>{" "}
                  {store.totalVentas}
                </p>
                <p className="">
                  <span className="font-medium">Total ingresos:</span> $
                  {store.totalIngresos.toLocaleString()}
                </p>
              </div>

              <div className="flex justify-between mt-auto pt-4">
                <Button onClick={() => handleViewStore(store)}>
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button onClick={() => handleProducts(store)}>
                  <Cog6ToothIcon className="w-4 h-4 mr-1" />
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center gap-4">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-dark">{value}</p>
      </div>
    </div>
  );
}
