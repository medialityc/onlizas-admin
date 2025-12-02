import { SearchParams, IQueryable } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import { getModulePermissions } from "@/components/permission/server-permission-wrapper";
import { getAllStores, getProviderStores } from "@/services/stores";
import StoresListContainer from "./stores-list-container";

interface Props {
  query: SearchParams;
}

/**
 * Server-side wrapper para la lista de tiendas.
 *
 * Este componente:
 * 1. Obtiene los permisos del usuario en el servidor
 * 2. Determina si es admin o supplier
 * 3. Pre-fetchea los datos correspondientes
 * 4. Renderiza el componente apropiado con los datos ya cargados
 *
 * Ventajas sobre el wrapper cliente (stores-permission-wrapper.tsx):
 * - No hay delay de hidratación ni loading de permisos
 * - Los datos llegan pre-fetcheados desde el servidor
 * - Mejor experiencia de usuario (sin skeleton de permisos)
 */
export default async function StoresServerWrapper({ query }: Props) {
  const { isAdmin, isSupplier } = await getModulePermissions("stores");

  const apiQuery: IQueryable = buildQueryParams(
    query as Record<string, unknown>
  );

  if (isAdmin) {
    const storesResponse = await getAllStores(apiQuery);

    return (
      <StoresListContainer storesPromise={storesResponse} query={query} />
    );
  }

  if (isSupplier) {
    const storesResponse = await getProviderStores(apiQuery);

    return (
      <StoresListContainer storesPromise={storesResponse} query={query} />
    );
  }
  return (
    <div className="panel p-6">
      <h2 className="text-lg font-semibold mb-2">Gestión de Tiendas</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No tiene permisos para visualizar tiendas.
      </p>
    </div>
  );
}
