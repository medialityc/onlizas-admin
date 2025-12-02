import { SearchParams, IQueryable } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import { getModulePermissions } from "@/components/permission/server-permission-wrapper";
import { getAllProducts, getAllMyProducts } from "@/services/products";
import ProductsListContainer from "./products-list-container";
import SupplierProductsListContainer from "./supplier-products-list-container";

interface Props {
  query: SearchParams;
}

/**
 * Server-side wrapper para la lista de productos.
 *
 * Este componente:
 * 1. Obtiene los permisos del usuario en el servidor
 * 2. Determina si es admin o supplier
 * 3. Pre-fetchea los datos correspondientes
 * 4. Renderiza el componente apropiado con los datos ya cargados
 *
 * Ventajas sobre el wrapper cliente:
 * - No hay delay de hidratación ni loading de permisos
 * - Los datos llegan pre-fetcheados desde el servidor
 * - Mejor experiencia de usuario (sin skeleton de permisos)
 */
export default async function ProductsServerWrapper({ query }: Props) {
  // 1. Obtener permisos del servidor
  const { role, isAdmin, isSupplier } = await getModulePermissions("products");

  // 2. Construir query params
  const apiQuery: IQueryable = buildQueryParams(query as Record<string, unknown>);

  // 3. Determinar qué datos obtener y qué componente renderizar
  if (isAdmin) {
    // Admin: obtener todos los productos
    const productsResponse = await getAllProducts(apiQuery);

    return (
      <ProductsListContainer
        productsPromise={productsResponse}
        query={query}
      />
    );
  }

  if (isSupplier) {
    // Supplier: obtener solo sus productos
    const productsResponse = await getAllMyProducts(apiQuery);

    return (
      <SupplierProductsListContainer
        productsPromise={productsResponse}
        query={query}
      />
    );
  }

  // Sin permisos
  return (
    <div className="panel p-6">
      <h2 className="text-lg font-semibold mb-2">Gestión de Productos</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No tiene permisos para visualizar productos.
      </p>
    </div>
  );
}
