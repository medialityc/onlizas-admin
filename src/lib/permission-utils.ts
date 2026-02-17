import { PERMISSION_ENUM } from "./permissions";

export type UserRole = "admin" | "supplier" | "none";

type PermissionAliasGroup = readonly string[];

const PERMISSION_ALIAS_GROUPS: PermissionAliasGroup[] = [
  [PERMISSION_ENUM.RETRIEVE_DASHBOARD, "RetrieveDashboard"],
  [PERMISSION_ENUM.RETRIEVE_CLOSURES, "RetrieveClosures"],
  [PERMISSION_ENUM.RETRIEVE_SUMMARY, "RetrieveSummaries"],
];

function normalizePermissionCode(code: string): string {
  return (code || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

const permissionAliasIndex: Map<string, Set<string>> = (() => {
  const index = new Map<string, Set<string>>();

  PERMISSION_ALIAS_GROUPS.forEach((group) => {
    const normalizedGroup = group
      .map((permission) => normalizePermissionCode(permission))
      .filter(Boolean);

    const variants = new Set(normalizedGroup);
    normalizedGroup.forEach((permission) => {
      index.set(permission, variants);
    });
  });

  return index;
})();

function getPermissionVariants(permission: string): Set<string> {
  const normalized = normalizePermissionCode(permission);
  return permissionAliasIndex.get(normalized) ?? new Set([normalized]);
}

function createNormalizedPermissionSet(permissionCodes: string[]): Set<string> {
  return new Set(permissionCodes.map((permission) => normalizePermissionCode(permission)).filter(Boolean));
}

export const MODULE_PERMISSIONS = {
  products: [
    PERMISSION_ENUM.SUPPLIER_CREATE,
    PERMISSION_ENUM.SUPPLIER_RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_UPDATE,
    PERMISSION_ENUM.SUPPLIER_DELETE,
  ],
  dashboard: [
    PERMISSION_ENUM.RETRIEVE_DASHBOARD,
    PERMISSION_ENUM.SUPPLIER_RETRIEVE,
  ],
  finance: [
    PERMISSION_ENUM.RETRIEVE_CLOSURES,
    PERMISSION_ENUM.RETRIEVE_SUMMARY,
    PERMISSION_ENUM.SUPPLIER_RETRIEVE,
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

  const normalizedCodes = createNormalizedPermissionSet(permissionCodes);
  return requiredPermissions.every((requiredPermission) => {
    const variants = getPermissionVariants(requiredPermission);
    for (const variant of variants) {
      if (normalizedCodes.has(variant)) return true;
    }
    return false;
  });
}

export function hasAnyPermission(
  permissionCodes: string[],
  requiredPermissions: string[]
): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  if (!permissionCodes || permissionCodes.length === 0) return false;

  const normalizedCodes = createNormalizedPermissionSet(permissionCodes);
  return requiredPermissions.some((requiredPermission) => {
    const variants = getPermissionVariants(requiredPermission);
    for (const variant of variants) {
      if (normalizedCodes.has(variant)) return true;
    }
    return false;
  });
}

export function determineUserRole(
  permissionCodes: string[],
  modulePermissions?: readonly string[]
): UserRole {
  if (!permissionCodes || permissionCodes.length === 0) {
    return "none";
  }

  if (hasAnyPermission(permissionCodes, [PERMISSION_ENUM.RETRIEVE])) {
    return "admin";
  }

  if (modulePermissions && modulePermissions.length > 0) {
    const hasModulePermission = hasAnyPermission(permissionCodes, [...modulePermissions]);
    if (hasModulePermission) {
      return "supplier";
    }
  }

  return "none";
}
