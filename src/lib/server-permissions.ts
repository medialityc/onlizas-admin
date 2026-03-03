import { fetchMyPermissions, getServerSession } from "zas-sso-client";
import type { Permission as SSOPermission } from "zas-sso-client/dist/permissions-control/server";
import {
  getPermissionCodes,
  determineUserRole,
  type UserRole,
} from "./permission-utils";

export type { UserRole, ModuleName } from "./permission-utils";

export interface Permission extends SSOPermission {
  subsystemId?: string;
  subsystem?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface ServerPermissionsData {
  permissions: Permission[];
  permissionCodes: string[];
  role: UserRole;
  isAdmin: boolean;
  isSupplier: boolean;
  userId?: string;
  userName?: string;
}

function extractPermissionsFromResponse(response: unknown): Permission[] {
  const payload = response as
    | { data?: unknown; permissions?: unknown }
    | undefined;

  if (Array.isArray(payload?.data)) {
    return payload.data as Permission[];
  }

  if (
    payload?.data &&
    typeof payload.data === "object" &&
    Array.isArray((payload.data as { data?: unknown }).data)
  ) {
    return (payload.data as { data: Permission[] }).data;
  }

  if (
    payload?.data &&
    typeof payload.data === "object" &&
    Array.isArray((payload.data as { permissions?: unknown }).permissions)
  ) {
    return (payload.data as { permissions: Permission[] }).permissions;
  }

  if (Array.isArray(payload?.permissions)) {
    return payload.permissions as Permission[];
  }

  if (Array.isArray(response)) {
    return response as Permission[];
  }

  return [];
}

export async function getServerPermissions(): Promise<Permission[]> {
  try {
    const session = await getServerSession();

    if (!session?.tokens?.accessToken) {
      return [];
    }

    const permissions = await fetchMyPermissions();

    const resolvedPermissions = extractPermissionsFromResponse(permissions);

    if (!Array.isArray(resolvedPermissions) || resolvedPermissions.length === 0) {
      return [];
    }

    return resolvedPermissions;
  } catch (error) {
    console.error("[ServerPermissions] Error obteniendo permisos:", error);
    return [];
  }
}

export async function getServerPermissionsData(
  modulePermissions?: readonly string[],
): Promise<ServerPermissionsData> {
  const permissions = await getServerPermissions();
  const permissionCodes = getPermissionCodes(permissions);
  const role = determineUserRole(permissionCodes, modulePermissions);

  let userId: string | undefined;
  let userName: string | undefined;

  try {
    const session = await getServerSession();
    userId = session?.user?.id?.toString();
    userName = session?.user?.name;
  } catch {}

  return {
    permissions,
    permissionCodes,
    role,
    isAdmin: role === "admin",
    isSupplier: role === "supplier",
    userId,
    userName,
  };
}
