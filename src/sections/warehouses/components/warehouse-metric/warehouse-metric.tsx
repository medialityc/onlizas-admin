"use clients";
import {
  ArchiveBoxIcon,
  ArrowTrendingUpIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { useWarehouseMetric } from "../../hooks/use-warehouse-metric";

const ValueBySkeleton = ({
  value,
  isLoading,
}: {
  value?: number;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="h-4 mt-2 w-10 rounded-xl bg-gray-200 dark:bg-gray-400" />
    );
  }

  return <>{value || 0}</>;
};

const WarehouseMetric = () => {
  const { data, isLoading } = useWarehouseMetric();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* error */}
      {/*  <AlertBox message={error?.message} title="Error" variant="danger" /> */}

      {/* metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <BuildingStorefrontIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Almacenes Físicos
            </p>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              <ValueBySkeleton
                isLoading={isLoading}
                value={data?.data?.totalPhysicalWarehouses}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BuildingOfficeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Almacenes Virtuales
            </p>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              <ValueBySkeleton
                isLoading={isLoading}
                value={data?.data?.totalVirtualWarehouses}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <ArchiveBoxIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Capacidad Total
            </p>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              <ValueBySkeleton
                isLoading={isLoading}
                value={data?.data?.totalStockValue}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <ArrowTrendingUpIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stock Actual
            </p>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              <ValueBySkeleton
                isLoading={isLoading}
                value={data?.data?.totalCurrentStock}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseMetric;
