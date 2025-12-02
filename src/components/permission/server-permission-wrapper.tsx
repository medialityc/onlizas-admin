import { ReactNode } from "react";
import {
  getServerPermissionsData,
  type UserRole,
  type ServerPermissionsData,
} from "@/lib/server-permissions";
import { MODULE_PERMISSIONS, type ModuleName } from "@/lib/permission-utils";

/**
 * Props para el ServerPermissionWrapper
 */
interface ServerPermissionWrapperProps {
  /**
   * Nombre del módulo para determinar permisos de supplier
   */
  module: ModuleName;

  /**
   * Componente a renderizar cuando el usuario es admin
   */
  adminComponent: ReactNode;

  /**
   * Componente a renderizar cuando el usuario es supplier
   */
  supplierComponent: ReactNode;

  /**
   * Componente a renderizar cuando el usuario no tiene permisos (opcional)
   * Por defecto muestra un mensaje genérico
   */
  noPermissionComponent?: ReactNode;

  /**
   * Props adicionales que se pasarán a los componentes hijos
   * Útil para pasar query params, datos pre-fetched, etc.
   */
  sharedProps?: Record<string, unknown>;
}

/**
 * Props que se inyectan a los componentes hijos
 */
export interface InjectedPermissionProps {
  permissionsData: ServerPermissionsData;
  userRole: UserRole;
  isAdmin: boolean;
  isSupplier: boolean;
  userId?: string;
  userName?: string;
}

/**
 * Componente por defecto cuando no hay permisos
 */
function DefaultNoPermission({ module }: { module: string }) {
  const moduleNames: Record<string, string> = {
    products: "Productos",
    inventory: "Inventario",
    stores: "Tiendas",
    warehouses: "Almacenes",
    orders: "Órdenes",
    transfers: "Transferencias",
  };

  return (
    <div className="panel p-6">
      <h2 className="text-lg font-semibold mb-2">
        Gestión de {moduleNames[module] || module}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No tiene permisos para visualizar este módulo.
      </p>
    </div>
  );
}

/**
 * ServerPermissionWrapper - Wrapper genérico server-side para manejo de permisos.
 *
 * Este componente determina el rol del usuario (admin/supplier/none) en el servidor
 * y renderiza el componente apropiado sin necesidad de hidratación del cliente.
 *
 * Ventajas:
 * - Los permisos se verifican en el servidor, no hay delay de carga
 * - El componente correcto se renderiza desde el primer momento
 * - Mejor SEO y performance (no hay skeleton mientras cargan permisos)
 * - Los datos pueden pre-fetchearse en el servidor
 *
 * @example
 * ```tsx
 * // En una page.tsx (Server Component)
 * export default async function ProductsPage({ searchParams }) {
 *   const params = await searchParams;
 *   const apiQuery = buildQueryParams(params);
 *
 *   return (
 *     <ServerPermissionWrapper
 *       module="products"
 *       adminComponent={<AdminProductsList query={apiQuery} />}
 *       supplierComponent={<SupplierProductsList query={apiQuery} />}
 *     />
 *   );
 * }
 * ```
 */
export async function ServerPermissionWrapper({
  module,
  adminComponent,
  supplierComponent,
  noPermissionComponent,
}: ServerPermissionWrapperProps) {
  // Obtener permisos del módulo
  const modulePermissions = MODULE_PERMISSIONS[module];

  // Obtener datos de permisos del servidor
  const permissionsData = await getServerPermissionsData(modulePermissions);

  const { role, isAdmin, isSupplier } = permissionsData;

  // Renderizar según el rol
  if (isAdmin) {
    return <>{adminComponent}</>;
  }

  if (isSupplier) {
    return <>{supplierComponent}</>;
  }

  // Sin permisos
  return (
    <>{noPermissionComponent || <DefaultNoPermission module={module} />}</>
  );
}

/**
 * HOC para crear wrappers específicos de módulo con configuración predefinida.
 *
 * @example
 * ```tsx
 * const ProductsWrapper = createModuleWrapper("products");
 *
 * // Uso:
 * <ProductsWrapper
 *   adminComponent={<AdminView />}
 *   supplierComponent={<SupplierView />}
 * />
 * ```
 */
export function createModuleWrapper(module: ModuleName) {
  return async function ModuleWrapper(
    props: Omit<ServerPermissionWrapperProps, "module">
  ) {
    return <ServerPermissionWrapper module={module} {...props} />;
  };
}

/**
 * Función helper para obtener los permisos y datos del usuario.
 * Útil cuando necesitas los datos de permisos fuera del wrapper.
 *
 * @example
 * ```tsx
 * export default async function Page() {
 *   const { role, isAdmin, userId } = await getModulePermissions("products");
 *
 *   // Pre-fetch data basado en el rol
 *   const data = isAdmin
 *     ? await getAllProducts()
 *     : await getMyProducts();
 *
 *   return <ProductsList data={data} isAdmin={isAdmin} />;
 * }
 * ```
 */
export async function getModulePermissions(module: ModuleName) {
  const modulePermissions = MODULE_PERMISSIONS[module];
  return getServerPermissionsData(modulePermissions);
}

export default ServerPermissionWrapper;
