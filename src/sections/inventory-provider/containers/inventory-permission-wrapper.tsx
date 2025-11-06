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
import Loader from "@/layouts/loading";
import { SearchParams, IQueryable } from "@/types/fetch/request";
import { InventoryListSkeleton } from "../components/skeleton/inventory-list-skeleton";

type Props = {
  query: SearchParams;
};

export default function InventoryPermissionWrapper({ query }: Props) {
  const { hasPermission } = usePermissions();
  const hasAdminRetrieve = hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const hasSupplierCreate =
    !hasAdminRetrieve && hasPermission([PERMISSION_ENUM.CREATE_INVENTORY]);
  const hasSupplierRetrieveOnly =
    !hasAdminRetrieve && hasPermission([PERMISSION_ENUM.RETRIEVE_INVENTORY]);
  const { user } = useAuth() as any;
  const supplierId = user?.id ? String(user.id) : undefined;

  const apiQuery: IQueryable = buildQueryParams(query as any);

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
      apiQuery,
    ],
    queryFn: async () => {
      return hasAdminRetrieve
        ? await getAllInventoryProvider(apiQuery)
        : await getAllMyInventoryProvider(apiQuery);
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  if (isLoading && !inventoriesResponse) {
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
  if (!inventoriesResponse) return null;

  // Hide create button if only supplier retrieve permission (no CREATE nor CREATE_INVENTORY)
  const canSupplierCreate = hasPermission([PERMISSION_ENUM.CREATE_INVENTORY]);
  const canCreate = hasPermission([PERMISSION_ENUM.CREATE]);

  return (
    <InventoryCardListContainer
      inventories={inventoriesResponse as any}
      query={query}
      hideCreate={!canCreate && !canSupplierCreate}
      providerId={hasSupplierCreate ? supplierId : undefined}
    />
  );
}
