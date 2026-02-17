"use client";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { useQuery } from "@tanstack/react-query";
import { buildQueryParams } from "@/lib/request";
import {
  getAllInventoryProvider,
  getAllMyInventoryProvider,
} from "@/services/inventory-providers";
import { useAuth } from "zas-sso-client";
import InventoryCardListContainer from "./inventory-card-list-container";
import { SearchParams, IQueryable } from "@/types/fetch/request";
import { InventoryListSkeleton } from "../components/skeleton/inventory-list-skeleton";
import { useMemo, useEffect, useState } from "react";

interface Props {
  query?: SearchParams;
  apiQuery?: IQueryable; // permitir pasar ya construido desde la page si se desea
}

export default function InventoryPermissionWrapper({
  query,
  apiQuery: externalApiQuery,
}: Props) {
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const hasAdminRetrieve = hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const hasSupplierCreate =
    !hasAdminRetrieve && hasPermission([PERMISSION_ENUM.SUPPLIER_CREATE]);
  const hasSupplierRetrieveOnly =
    !hasAdminRetrieve && hasPermission([PERMISSION_ENUM.SUPPLIER_RETRIEVE]);
  const { user } = useAuth() as any;
  const supplierId = user?.id ? String(user.id) : undefined;
  // Memo de parámetros para evitar trigger por identidad de objeto
  const apiQuery: IQueryable = useMemo(
    () =>
      externalApiQuery
        ? externalApiQuery
        : buildQueryParams((query || {}) as any),
    [externalApiQuery, query]
  );
  const serializedParams = useMemo(() => JSON.stringify(apiQuery), [apiQuery]);

  // Cache local de última data válida para evitar parpadeos
  const [stableData, setStableData] = useState<any | undefined>(undefined);

  const {
    data: inventoriesResponse,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: [
      "inventory-list",
      hasAdminRetrieve ? "admin" : "supplier",
      serializedParams,
    ],
    queryFn: async () => {
      return hasAdminRetrieve
        ? await getAllInventoryProvider(apiQuery)
        : await getAllMyInventoryProvider(apiQuery);
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    retry: 1,
  });

  useEffect(() => {
    if (inventoriesResponse) setStableData(inventoriesResponse);
  }, [inventoriesResponse]);

  // Caso 1: Permisos aún cargando -> mostrar siempre skeleton (oculta tabs externas si wrapper se usa en lugar del contenido)
  if (permissionsLoading && !stableData) {
    return <InventoryListSkeleton />;
  }
  // Caso 2: Data inicial cargando sin data previa
  if (!permissionsLoading && isLoading && !inventoriesResponse && !stableData) {
    return <InventoryListSkeleton />;
  }
  if (isError)
    return (
      <div className="panel p-6">
        <p className="text-red-500">
          Error al cargar inventario: {(error as any)?.message || "Desconocido"}
        </p>
      </div>
    );
  const effectiveData = inventoriesResponse || stableData;
  if (!effectiveData) {
    // Si no hay datos todavía pero ya hay permisos, mantener skeleton estable
    return <InventoryListSkeleton />;
  }

  // Hide create button if only supplier retrieve permission (no CREATE nor CREATE_INVENTORY)
  const canCreate = hasPermission([
    PERMISSION_ENUM.CREATE,
    PERMISSION_ENUM.SUPPLIER_CREATE,
  ]);

  return (
    <div className="relative">
      <InventoryCardListContainer
        inventories={effectiveData as any}
        query={(query || {}) as SearchParams}
        hideCreate={!canCreate}
        providerId={hasSupplierCreate ? supplierId : undefined}
      />
      {isFetching && effectiveData && (
        <div className="absolute top-2 right-2 text-xs px-2 py-1 bg-gray-800 text-white rounded shadow animate-pulse">
          Actualizando...
        </div>
      )}
    </div>
  );
}
