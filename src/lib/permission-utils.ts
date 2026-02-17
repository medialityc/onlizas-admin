import { PERMISSION_ENUM } from "./permissions";

export type UserRole = "admin" | "supplier" | "none";

export const MODULE_PERMISSIONS = {
  products: [
    PERMISSION_ENUM.SUPPLIER_CREATE,
    PERMISSION_ENUM.SUPPLIER_RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_UPDATE,
    PERMISSION_ENUM.SUPPLIER_DELETE,
  ],
  dashboard: [PERMISSION_ENUM.RETRIEVE_DASHBOARD],
  finance: [
    PERMISSION_ENUM.RETRIEVE_CLOSURES,
    PERMISSION_ENUM.RETRIEVE_SUMMARY,
  ],
  inventory: [
    PERMISSION_ENUM.SUPPLIER_CREATE,
    PERMISSION_ENUM.SUPPLIER_RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_UPDATE,
    PERMISSION_ENUM.SUPPLIER_DELETE,
  ],
  stores: [
    PERMISSION_ENUM.SUPPLIER_CREATE,
    PERMISSION_ENUM.SUPPLIER_RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_UPDATE,
    PERMISSION_ENUM.SUPPLIER_DELETE,
  ],
  warehouses: [
    PERMISSION_ENUM.SUPPLIER_CREATE,
    PERMISSION_ENUM.SUPPLIER_RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_UPDATE,
    PERMISSION_ENUM.SUPPLIER_DELETE,
  ],
  orders: [PERMISSION_ENUM.SUPPLIER_RETRIEVE, PERMISSION_ENUM.SUPPLIER_UPDATE],
  transfers: [
    PERMISSION_ENUM.SUPPLIER_CREATE,
    PERMISSION_ENUM.SUPPLIER_RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_UPDATE,
    PERMISSION_ENUM.SUPPLIER_DELETE,
  ],
} as const;

export type ModuleName = keyof typeof MODULE_PERMISSIONS;

export function getPermissionCodes(
  permissions: Array<{ code: string }>
): string[] {
  return permissions.map((p) => p.code).filter(Boolean);
}

export function hasAllPermissions(
  permissionCodes: string[],
  requiredPermissions: string[]
): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  if (!permissionCodes || permissionCodes.length === 0) return false;

  return requiredPermissions.every((perm) => permissionCodes.includes(perm));
}

export function hasAnyPermission(
  permissionCodes: string[],
  requiredPermissions: string[]
): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  if (!permissionCodes || permissionCodes.length === 0) return false;

  return requiredPermissions.some((perm) => permissionCodes.includes(perm));
}

export function determineUserRole(
  permissionCodes: string[],
  modulePermissions?: readonly string[]
): UserRole {
  if (!permissionCodes || permissionCodes.length === 0) {
    return "none";
  }

  if (permissionCodes.includes(PERMISSION_ENUM.RETRIEVE)) {
    return "admin";
  }

  if (modulePermissions && modulePermissions.length > 0) {
    const hasModulePermission = modulePermissions.some((perm) =>
      permissionCodes.includes(perm)
    );
    if (hasModulePermission) {
      return "supplier";
    }
  }

  return "none";
}
