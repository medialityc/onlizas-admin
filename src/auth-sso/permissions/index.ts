"use server";

import { getSession } from "../services/server-actions";
import { ENDPOINTS } from "../lib/config";

/**
 * Obtiene los permisos del usuario desde la API
 */
export async function getUserPermissions(): Promise<string[]> {
  try {
    const session = await getSession();
    
    if (!session.tokens?.accessToken) {
      return [];
    }

    const response = await fetch(ENDPOINTS.me, {
      headers: { 
        Authorization: `Bearer ${session.tokens.accessToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error("❌ Error fetching user:", response.status);
      return [];
    }

    const userData = await response.json();
    
    if (!userData.roles || !Array.isArray(userData.roles)) {
      return [];
    }

    // Extraer todos los permisos
    const permissions: string[] = [];
    userData.roles.forEach((role: any) => {
      if (role.permissions && Array.isArray(role.permissions)) {
        role.permissions.forEach((permission: any) => {
          if (permission.code && !permissions.includes(permission.code)) {
            permissions.push(permission.code);
          }
        });
      }
    });

    console.log("✅ User permissions:", {
      CREATE_ALL: permissions.includes("CREATE_ALL"),
      READ_ALL: permissions.includes("READ_ALL"),
      UPDATE_ALL: permissions.includes("UPDATE_ALL"),
      DELETE_ALL: permissions.includes("DELETE_ALL"),
      DOCUMENT_VALIDATE: permissions.includes("DOCUMENT_VALIDATE"),
      CURRENCY_SET_DEFAULT: permissions.includes("CURRENCY_SET_DEFAULT"),
      BUSINESS_DEACTIVATE: permissions.includes("BUSINESS_DEACTIVATE"),
      APPROVALPROCESS_APPROVE_REJECT: permissions.includes("APPROVALPROCESS_APPROVE_REJECT"),
      APPROVAL_EXTEND_REQUEST: permissions.includes("APPROVAL_EXTEND_REQUEST"),
      CREATE_PERMISSION: permissions.includes("CREATE_PERMISSION"),
      READ_PERMISSIONS: permissions.includes("READ_PERMISSIONS"),
      UPDATE_PERMISSION: permissions.includes("UPDATE_PERMISSION"),
      CREATE_ROLES: permissions.includes("CREATE_ROLES"),
      READ_ROLES: permissions.includes("READ_ROLES"),
      UPDATE_ROLES: permissions.includes("UPDATE_ROLES")
    });
    return permissions;
  } catch (error) {
    console.error("❌ Error getting permissions:", error);
    return [];
  }
}

/**
 * Verifica si es admin (tiene los 4 permisos ALL principales)
 */
export async function isAdmin(): Promise<boolean> {
  const permissions = await getUserPermissions();
  
  // Para ser admin debe tener estos 4 permisos específicos
  const requiredAdminPermissions = [
    "CREATE_ALL",
    "READ_ALL", 
    "UPDATE_ALL",
    "DELETE_ALL"
  ];
  
  const hasAllAdminPermissions = requiredAdminPermissions.every(perm => 
    permissions.includes(perm)
  );
  
  return hasAllAdminPermissions;
}