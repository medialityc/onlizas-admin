import { SearchParams, IQueryable } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import { getModulePermissions } from "@/components/permission/server-permission-wrapper";
import {
  getAllInventoryProvider,
  getAllMyInventoryProvider,
} from "@/services/inventory-providers";
import InventoryCardListContainer from "./inventory-card-list-container";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { getServerSession } from "zas-sso-client";
import { getSupplierItemsCount } from "@/services/dashboard";
import { InventoryProvider } from "@/types/inventory";
import { getReviewsByInventoryId } from "@/services/reviews";
import { InventoryReviewsSummaryMap } from "@/types/reviews";
import { buildInventoryReviewSummary } from "@/utils/reviews";

/**
 * Server-side wrapper para la lista de inventarios.
 *
 * Este componente:
 * 1. Obtiene los permisos del usuario en el servidor
 * 2. Determina si es admin o supplier
 * 3. Pre-fetchea los datos correspondientes
 * 4. Renderiza el componente apropiado con los datos ya cargados
 *
 * Ventajas sobre el wrapper cliente (inventory-permission-wrapper.tsx):
 * - No hay delay de hidratación ni loading de permisos
 * - Los datos llegan pre-fetcheados desde el servidor
 * - Mejor experiencia de usuario (sin skeleton de permisos)
 */
interface Props {
  query: SearchParams;
  afterCreateRedirectTo?: string;
}

const buildReviewsSummaryMap = async (
  inventories: InventoryProvider[] = []
): Promise<InventoryReviewsSummaryMap> => {
  const reviewEntries = await Promise.all(
    inventories.map(async (inventory) => {
      const response = await getReviewsByInventoryId(inventory.id, {
        page: 1,
        pageSize: 10,
      });

      return [
        String(inventory.id),
        buildInventoryReviewSummary(response.data?.data ?? []),
      ] as const;
    })
  );

  return Object.fromEntries(reviewEntries);
};

export default async function InventoryServerWrapper({
  query,
  afterCreateRedirectTo,
}: Props) {
  const { isAdmin, isSupplier, permissionCodes } =
    await getModulePermissions("inventory");
  const { user } = await getServerSession();

  const apiQuery: IQueryable = buildQueryParams(
    query as Record<string, unknown>,
  );

  const canCreate = permissionCodes.some(
    (code) =>
      code === PERMISSION_ENUM.CREATE ||
      code === PERMISSION_ENUM.SUPPLIER_CREATE,
  );

  if (isAdmin) {
    const inventoriesResponse = await getAllInventoryProvider(apiQuery);
    const reviewsSummaryByInventoryId = await buildReviewsSummaryMap(
      inventoriesResponse.data?.data ?? []
    );

    return (
      <InventoryCardListContainer
        inventories={inventoriesResponse}
        query={query}
        hideCreate={!canCreate}
        reviewsSummaryByInventoryId={reviewsSummaryByInventoryId}
      />
    );
  }

  if (isSupplier) {
    const [inventoriesResponse, counters] = await Promise.all([
      getAllMyInventoryProvider(apiQuery),
      getSupplierItemsCount(),
    ]);
    const reviewsSummaryByInventoryId = await buildReviewsSummaryMap(
      inventoriesResponse.data?.data ?? []
    );

    return (
      <InventoryCardListContainer
        providerId={String(user?.id)}
        inventories={inventoriesResponse}
        query={query}
        hideCreate={!canCreate}
        counters={counters.data}
        forProvider={true}
        afterCreateRedirectTo={afterCreateRedirectTo}
        reviewsSummaryByInventoryId={reviewsSummaryByInventoryId}
      />
    );
  }

  return (
    <div className="panel p-6">
      <h2 className="text-lg font-semibold mb-2">Gestión de Inventario</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No tiene permisos para visualizar inventarios.
      </p>
    </div>
  );
}
