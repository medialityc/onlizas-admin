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
      console.log("❌ No access token");
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
      console.log("❌ No roles in user");
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

    console.log("✅ User permissions:", permissions);
    console.log("🔍 ALL permissions found:", permissions.filter(p => p.includes("_ALL")));
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
  
  console.log("🔐 Admin check:", {
    permissions: permissions.filter(p => p.includes("_ALL")),
    requiredAdminPermissions,
    hasAllAdminPermissions
  });
  
  return hasAllAdminPermissions;
}