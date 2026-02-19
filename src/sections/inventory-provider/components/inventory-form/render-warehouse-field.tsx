"use client";

import {
  getAllWarehousesBySupplier,
  getAllWarehousesByType,
  getAllMeWarehouses,
} from "@/services/warehouses";
import { useEffect, useMemo } from "react";
import { WAREHOUSE_TYPE_ENUM } from "@/sections/warehouses/constants/warehouse-type";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { IQueryable } from "@/types/fetch/request";
import { WarehouseFilter } from "@/types/warehouses";

interface RenderWarehouseFieldProps {
  meWarehouse?: boolean;
  isPaqueteria?: boolean;
  supplierId?: string;
  forProvider?: boolean;
}

interface WarehouseFieldConfig {
  name: string;
  label: string;
  placeholder: string;
  onFetch: (params: IQueryable & WarehouseFilter) => Promise<any>;
  queryKey: string;
  disabled: boolean;
}

export const RenderWarehouseField = ({
  meWarehouse,
  isPaqueteria,
  supplierId,
  forProvider,
}: RenderWarehouseFieldProps) => {
  type ConfigKey = "meWarehouse" | "isPaqueteria" | "default";

  const configs: Record<ConfigKey, WarehouseFieldConfig> = {
    meWarehouse: {
      name: "virtualWarehouseId",
      label: "Almacenes del proveedor",
      placeholder: "Seleccionar almacenes del proveedor",
      // Admin (con supplierId explícito) usa getAllWarehousesBySupplier.
      // Vista proveedor (sin supplierId) usa getAllMeWarehouses.
      onFetch: (params) =>
        !forProvider
          ? getAllWarehousesBySupplier(supplierId!, params)
          : getAllMeWarehouses(params),
      queryKey: `warehouses-virtual-${supplierId}`,
      disabled: false,
    },
    isPaqueteria: {
      name: "virtualWarehouseId",
      label: "Almacenes internacionales",
      placeholder: "Seleccionar almacenes internacionales",
      onFetch: (params) =>
        getAllWarehousesByType(params, WAREHOUSE_TYPE_ENUM.virtualwarehouse),
      queryKey: `warehouses-virtual-${supplierId}`,
      disabled: !supplierId,
    },

    default: {
      name: "physicalWarehouseId",
      label: "Almacenes físicos",
      placeholder: "Seleccionar almacenes físicos",
      onFetch: (params) =>
        getAllWarehousesByType(params, WAREHOUSE_TYPE_ENUM.warehouse),
      queryKey: `warehouses-physical-${supplierId}`,
      disabled: !supplierId,
    },
  };

  const selectedConfig: WarehouseFieldConfig =
    (meWarehouse && configs.meWarehouse) ||
    (isPaqueteria && configs.isPaqueteria) ||
    configs.default;

  // Construimos un sufijo único que dependa de los flags para forzar refetch cuando cambian.
  const scenarioKey = [
    supplierId || "no-supplier",
    meWarehouse ? "me" : "no-me",
    isPaqueteria ? "paq" : "no-paq",
    selectedConfig.name, // incluye el nombre del field para diferenciar virtual/físico
  ].join(":");

  // Memoize a wrapped fetcher to add logging without recreating excessively
  const loggedConfig = useMemo<WarehouseFieldConfig>(() => {
    // Ajustamos el queryKey para incluir scenarioKey y forzar nueva query cuando cambian flags
    const effectiveQueryKey = `${selectedConfig.queryKey}-${scenarioKey}`;
    return {
      ...selectedConfig,
      queryKey: effectiveQueryKey,
      onFetch: async (params) => {
        console.log("[RenderWarehouseField] onFetch:start", {
          meWarehouse,
          isPaqueteria,
          supplierId,
          scenarioKey,
          baseQueryKey: selectedConfig.queryKey,
          effectiveQueryKey,
          params,
        });
        try {
          const result = await selectedConfig.onFetch(params);
          console.log("[RenderWarehouseField] onFetch:success", {
            count: Array.isArray(result?.data?.data)
              ? result.data.data.length
              : undefined,
            scenarioKey,
          });
          return result;
        } catch (err) {
          console.error("[RenderWarehouseField] onFetch:error", {
            err,
            scenarioKey,
          });
          throw err;
        }
      },
    };
  }, [selectedConfig, meWarehouse, isPaqueteria, supplierId, scenarioKey]);

  // Log when controlling flags change
  useEffect(() => {
    console.log("[RenderWarehouseField] flags changed", {
      meWarehouse,
      isPaqueteria,
      supplierId,
      chosen: selectedConfig.label,
      fieldName: selectedConfig.name,
      baseQueryKey: selectedConfig.queryKey,
      scenarioKey,
    });
  }, [meWarehouse, isPaqueteria, supplierId, selectedConfig, scenarioKey]);

  return (
    <RHFAutocompleteFetcherInfinity
      {...loggedConfig}
      objectValueKey="id"
      objectKeyLabel="name"
      required
      // habilitado sólo si hay supplierId cuando se necesita
      enabled={!!supplierId || loggedConfig.name === "physicalWarehouseId"}
    />
  );
};
