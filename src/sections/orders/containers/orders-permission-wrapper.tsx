import { buildQueryParams } from "@/lib/request";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { getAllOrders } from "@/services/order";
import AdminOrdersPage from "./order-list-container";
import SupplierStoresView from "./supplier-stores-view";
import { getModulePermissions } from "@/components/permission/server-permission-wrapper";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllOrders } from "@/types/order";

type Props = {
  query: SearchParams;
};

export default async function OrdersPermissionWrapper({ query }: Props) {
  const { isAdmin, isSupplier, userName } =
    await getModulePermissions("orders");

  if (!isAdmin && !isSupplier) {
    return (
      <div className="panel p-6">
        <h2 className="text-lg font-semibold mb-2">Gestión de Órdenes</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No tiene permisos para visualizar órdenes.
        </p>
      </div>
    );
  }

  if (isAdmin) {
    const apiQuery: IQueryable = buildQueryParams(query as any);
    const ordersResponse: ApiResponse<GetAllOrders> = await getAllOrders(
      apiQuery as any,
    );

    if (ordersResponse.error) {
      return (
        <div className="panel p-6">
          <p className="text-red-500">
            Error al cargar órdenes: {ordersResponse.message || "Desconocido"}
          </p>
        </div>
      );
    }

    return <AdminOrdersPage data={ordersResponse as any} query={query} />;
  }

  // Supplier
  return (
    <SupplierStoresView query={query} supplierName={userName || "Proveedor"} />
  );
}
