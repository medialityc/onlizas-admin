import { usePermissions as useSSO } from "zas-sso-client";
import { PERMISSION_ADMIN } from "@/lib/permissions";
import {
  hasAnyPermission as hasAnyPermissionMatcher,
  hasAllPermissions as hasAllPermissionsMatcher,
} from "@/lib/permission-utils";

// Tipo Permission de zas-sso-client
interface Permission {
  id: string;
  name: string;
  code: string;
  subsystemId: string;
  description: string;
  subsystem: any;
}

export const usePermissions = () => {
  const {
    data: permissions,
    isLoading,
    error,
    isError,
  } = useSSO() as {
    data: { data: Permission[] } | undefined;
    isLoading: boolean;
    error: any;
    isError: boolean;
  };

  const normalize = (value?: string) =>
    (value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const extractPermissions = (): Permission[] => {
    if (Array.isArray(permissions as unknown)) {
      return permissions as unknown as Permission[];
    }

    const payload = permissions as any;

    if (Array.isArray(payload?.data)) {
      return payload.data as Permission[];
    }

    if (Array.isArray(payload?.data?.data)) {
      return payload.data.data as Permission[];
    }

    if (Array.isArray(payload?.permissions)) {
      return payload.permissions as Permission[];
    }

    if (Array.isArray(payload?.data?.permissions)) {
      return payload.data.permissions as Permission[];
    }

    return [];
  };

  const rawPermissions = extractPermissions();

  const onlizasPermissions = rawPermissions.filter((permission) => {
    const subsystemCode = normalize(permission?.subsystem?.code);
    if (!subsystemCode) return true;
    return subsystemCode === normalize("Onlizas") || subsystemCode === normalize("OnliZas");
  });

  // Si el filtro por subsistema no encuentra nada, usar los permisos crudos
  // para evitar ocultar toda la navegación por una diferencia de casing/shape.
  const sourcePermissions =
    onlizasPermissions.length > 0 ? onlizasPermissions : rawPermissions;

  const safePermissionCodes = sourcePermissions
    .map((permission) => permission?.code)
    .filter(Boolean) as string[];

  /**
   * Verifica si el usuario tiene los permisos requeridos
   * @param requiredPermissions - Array de códigos de permisos requeridos
   * @returns true si tiene todos los permisos, false si no
   */
  const hasPermission = (requiredPermissions?: string[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (!Array.isArray(safePermissionCodes) || safePermissionCodes.length === 0)
      return false;

    return hasAnyPermissionMatcher(safePermissionCodes, requiredPermissions);
  };

  /**
   * Verifica si el usuario tiene al menos uno de los permisos especificados
   * @param requiredPermissions - Array de códigos de permisos
   * @returns true si tiene al menos un permiso, false si no tiene ninguno
   */
  const hasAnyPermission = (requiredPermissions?: string[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (!Array.isArray(safePermissionCodes) || safePermissionCodes.length === 0)
      return false;

    return hasAnyPermissionMatcher(safePermissionCodes, requiredPermissions);
  };

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param permission - Código del permiso a verificar
   * @returns true si tiene el permiso, false si no
   */
  const hasSpecificPermission = (permission: string): boolean => {
    if (!Array.isArray(safePermissionCodes) || safePermissionCodes.length === 0)
      return false;
    return hasAllPermissionsMatcher(safePermissionCodes, [permission]);
  };

  /**
   * Obtiene todos los códigos de permisos del usuario
   * @returns Array de códigos de permisos
   */
  const getPermissionCodes = (): string[] => {
    return safePermissionCodes;
  };

  /**
   * Verifica si el usuario es administrador (tiene permisos CRUD básicos)
   * @param adminPermissions - Array de permisos que definen un admin
   * @returns true si es admin, false si no
   */
  const isAdmin = (adminPermissions: string[] = PERMISSION_ADMIN): boolean => {
    if (!adminPermissions || adminPermissions.length === 0) return false;
    return hasPermission(adminPermissions);
  };

  /**
   * Filtra una lista de items basándose en permisos
   * @param items - Array de items con propiedad permissions
   * @param permissionKey - Nombre de la propiedad que contiene los permisos (default: 'permissions')
   * @returns Array filtrado de items que el usuario puede ver
   */
  const filterByPermissions = <T extends Record<string, any>>(
    items: T[],
    permissionKey: string = "permissions",
  ): T[] => {
    return items.filter((item) => hasPermission(item[permissionKey]));
  };

  return {
    // Datos de permisos
    permissions: safePermissionCodes,
    allPermissions: permissions,

    // Estados de React Query
    isLoading,
    error,
    isError,

    // Métodos de verificación de permisos
    hasPermission,
    hasAnyPermission,
    hasSpecificPermission,
    getPermissionCodes,
    isAdmin,
    filterByPermissions,
  };
};
