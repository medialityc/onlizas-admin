"use client";

import {
  getAllWarehousesBySupplier,
  getAllWarehousesByType,
} from "@/services/warehouses";
import { WAREHOUSE_TYPE_ENUM } from "@/sections/warehouses/constants/warehouse-type";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { IQueryable } from "@/types/fetch/request";
import { WarehouseFilter } from "@/types/warehouses";

interface RenderWarehouseFieldProps {
  meWarehouse?: boolean;
  isPaqueteria?: boolean;
  supplierId?: string;
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
}: RenderWarehouseFieldProps) => {
  type ConfigKey = "meWarehouse" | "isPaqueteria" | "default";

  const configs: Record<ConfigKey, WarehouseFieldConfig> = {
    meWarehouse: {
      name: "virtualWarehouseId",
      label: "Almacenes del proveedor",
      placeholder: "Seleccionar almacenes del proveedor",
      onFetch: (params) => getAllWarehousesBySupplier(supplierId!, params),
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

  return (
    <RHFAutocompleteFetcherInfinity
      {...selectedConfig}
      objectValueKey="id"
      objectKeyLabel="name"
      required
    />
  );
};
