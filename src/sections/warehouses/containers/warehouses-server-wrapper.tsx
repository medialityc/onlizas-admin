import { SearchParams, IQueryable } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import { getModulePermissions } from "@/components/permission/server-permission-wrapper";
import { getAllWarehouses, getAllMeWarehouses } from "@/services/warehouses";
import WarehouseListContainer from "./warehouse-list-container";
import MeWarehouseListContainer from "./me-warehouse-list-container";
import { getServerSession } from "zas-sso-client";

interface Props {
  query: SearchParams;
}

/**
 * Server-side wrapper para la lista de almacenes.
 *
 * Este componente:
 * 1. Obtiene los permisos del usuario en el servidor
 * 2. Determina si es admin o supplier
 * 3. Pre-fetchea los datos correspondientes
 * 4. Renderiza el componente apropiado con los datos ya cargados
 *
 * Ventajas sobre el wrapper cliente (warehouse-permission-wrapper.tsx):
 * - No hay delay de hidratación ni loading de permisos
 * - Los datos llegan pre-fetcheados desde el servidor
 * - Mejor experiencia de usuario (sin skeleton de permisos)
 */
export default async function WarehousesServerWrapper({ query }: Props) {
  const { isAdmin, isSupplier } = await getModulePermissions("warehouses");

  const apiQuery: IQueryable = buildQueryParams(
    query as Record<string, unknown>,
  );
  if (isAdmin) {
    const warehousesResponse = await getAllWarehouses(apiQuery);

    return (
      <WarehouseListContainer
        warehousesPromise={warehousesResponse}
        query={query}
      />
    );
  }

  if (isSupplier) {
    const warehousesResponse = await getAllMeWarehouses(apiQuery);
    console.log(warehousesResponse.data?.data[0]);

    const { user } = await getServerSession();
    return (
      <MeWarehouseListContainer
        warehousesPromise={warehousesResponse}
        query={query}
        supplierId={String(user?.id)}
      />
    );
  }

  return (
    <div className="panel p-6">
      <h2 className="text-lg font-semibold mb-2">Gestión de Almacenes</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No tiene permisos para visualizar almacenes.
      </p>
    </div>
  );
}
