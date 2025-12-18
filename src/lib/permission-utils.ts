import { PERMISSION_ENUM } from "./permissions";

export type UserRole = "admin" | "supplier" | "none";

export const MODULE_PERMISSIONS = {
  products: [
    PERMISSION_ENUM.CREATE_PRODUCT,
    PERMISSION_ENUM.RETRIEVE_PRODUCT,
    PERMISSION_ENUM.UPDATE_PRODUCT,
    PERMISSION_ENUM.DELETE_PRODUCT,
  ],
  finance: [
    PERMISSION_ENUM.RETRIEVE_CLOSURES,
    PERMISSION_ENUM.RETRIEVE_SUMMARY,
  ],
  inventory: [
    PERMISSION_ENUM.CREATE_INVENTORY,
    PERMISSION_ENUM.RETRIEVE_INVENTORY,
    PERMISSION_ENUM.UPDATE_INVENTORY,
    PERMISSION_ENUM.DELETE_INVENTORY,
  ],
  stores: [
    PERMISSION_ENUM.CREATE_STORE,
    PERMISSION_ENUM.RETRIEVE_STORE,
    PERMISSION_ENUM.UPDATE_STORE,
    PERMISSION_ENUM.DELETE_STORE,
  ],
  warehouses: [
    PERMISSION_ENUM.CREATE_WAREHOUSE,
    PERMISSION_ENUM.RETRIEVE_WAREHOUSE,
    PERMISSION_ENUM.UPDATE_WAREHOUSE,
    PERMISSION_ENUM.DELETE_WAREHOUSE,
  ],
  orders: [PERMISSION_ENUM.RETRIEVE_ORDERS, PERMISSION_ENUM.UPDATE_ORDERS],
  transfers: [
    PERMISSION_ENUM.CREATE_TRANSFER,
    PERMISSION_ENUM.RETRIEVE_TRANSFER,
    PERMISSION_ENUM.UPDATE_TRANSFER,
    PERMISSION_ENUM.DELETE_TRANSFER,
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
