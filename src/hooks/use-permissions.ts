import { usePermissions as useSSO } from "zas-sso-client";

// Tipo Permission de zas-sso-client
interface Permission {
  id: number;
  name: string;
  code: string;
  description: string;
  entity: string;
  type: number;
  roleId: number;
  roleName: string;
  roleCode: string;
}

export const usePermissions = () => {
  const { data: permissions, isLoading, error, isError } = useSSO();

  // Asegurar que permissions sea siempre un array válido
  const safePermissions = Array.isArray(permissions) ? permissions : [];

  /**
   * Verifica si el usuario tiene los permisos requeridos
   * @param requiredPermissions - Array de códigos de permisos requeridos
   * @returns true si tiene todos los permisos, false si no
   */
  const hasPermission = (requiredPermissions?: string[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (!Array.isArray(safePermissions) || safePermissions.length === 0)
      return false;

    return requiredPermissions.every((perm) =>
      safePermissions.some(
        (p: Permission) => p && typeof p.code === "string" && p.code === perm
      )
    );
  };

  /**
   * Verifica si el usuario tiene al menos uno de los permisos especificados
   * @param requiredPermissions - Array de códigos de permisos
   * @returns true si tiene al menos un permiso, false si no tiene ninguno
   */
  const hasAnyPermission = (requiredPermissions?: string[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (!Array.isArray(safePermissions) || safePermissions.length === 0)
      return false;

    return requiredPermissions.some((perm) =>
      safePermissions.some(
        (p: Permission) => p && typeof p.code === "string" && p.code === perm
      )
    );
  };

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param permission - Código del permiso a verificar
   * @returns true si tiene el permiso, false si no
   */
  const hasSpecificPermission = (permission: string): boolean => {
    if (!Array.isArray(safePermissions) || safePermissions.length === 0)
      return false;
    return safePermissions.some(
      (p: Permission) =>
        p && typeof p.code === "string" && p.code === permission
    );
  };

  /**
   * Obtiene todos los códigos de permisos del usuario
   * @returns Array de códigos de permisos
   */
  const getPermissionCodes = (): string[] => {
    if (!Array.isArray(safePermissions)) return [];
    return safePermissions
      .map((p: Permission) => p?.code)
      .filter((code): code is string => typeof code === "string");
  };

  /**
   * Verifica si el usuario es administrador (tiene permisos CRUD básicos)
   * @param adminPermissions - Array de permisos que definen un admin
   * @returns true si es admin, false si no
   */
  const isAdmin = (adminPermissions: string[] = []): boolean => {
    if (adminPermissions.length === 0) return false;
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
    permissionKey: string = "permissions"
  ): T[] => {
    return items.filter((item) => hasPermission(item[permissionKey]));
  };

  return {
    // Datos de permisos
    permissions: safePermissions,

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
