"use client";

import { useMemo, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { GetStoreMetrics, Store, StoreMetric } from "@/types/stores";
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
import { DataCard } from "../modals/components/info-card";
import { MetricCard } from "../modals/components/metric-card";
import StoresModalContainer from "../modals/store-create-container";

interface StoresListProps {
  data?: GetStoreMetrics;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
  //onCreateStore: () => void;
  // onViewStore: (store: Store) => void;
  //onConfigureStore: (store: Store) => void;
}

export function StoresList({
  data,
  searchParams,
  onSearchParamsChange,
}: StoresListProps) {
  const { getModalState, openModal, closeModal } = useModalState();
  const queryClient = useQueryClient();

  const createStoreModal = getModalState("create");
  const editStoreModal = getModalState<number>("edit");
  const viewStoreModal = getModalState<number>("view");

  const handleCreateStore = useCallback(() => openModal("create"), [openModal]);
  const handleEditStore = useCallback(
    (store: Store) => openModal<number>("edit", store.id),
    [openModal]
  );
  const handleViewStore = useCallback(
    (store: Store) => openModal<number>("view", store.id),
    [openModal]
  );

  const response = data;

  const items: StoreMetric[] = Array.isArray(response)
    ? response.storeMetrics
    : [];

  // Métricas agregadas — preferir valores que vienen del backend, si no, calcular
  const totalStores =
    typeof response?.totalStores === "number"
      ? response.totalStores
      : items.length;
  const activeStores =
    typeof response?.activeStores === "number"
      ? response.activeStores
      : items.filter((s) => s.isActive).length;
  const totalVisits =
    typeof response?.totalVisits === "number"
      ? response.totalVisits
      : items.reduce((acc, s) => acc + (s.visitCount ?? 0), 0);
  const avgConversion =
    typeof response?.averageConversionRate === "number"
      ? response.averageConversionRate.toFixed(1)
      : items.length
        ? (
            items.reduce((acc, s) => acc + (s.conversionRate ?? 0), 0) /
            items.length
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
      <div
        className="grid 
        gap-4 
        grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
      >
        {data?.storeMetrics.map((store) => (
          <DataCard
            key={store.id}
            // storeData={storeData}
            store={store}
            handleViewStore={handleViewStore}
            handleEdit={handleEditStore}
          />
        ))}
      </div>

      {/* Modal de creación de tienda */}
      <StoresModalContainer
        open={createStoreModal.open}
        onClose={() => closeModal("create")}
      />
    </div>
  );
}
