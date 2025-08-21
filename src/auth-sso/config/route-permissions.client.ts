// Configuración de permisos en cliente.
// ACTIVE_PERMISSIONS: si es false, no se hace ningún chequeo.
// Cada entrada: { pattern, perms } donde pattern es un prefijo de pathname.
// Estrategia: se elige la coincidencia más específica (prefijo más largo) y se valida que el usuario tenga TODOS los permisos listados.

export const ACTIVE_PERMISSIONS = true; // cambiar a false para desactivar globalmente

export interface ClientRoutePermission {
  pattern: string; // ej: '/dashboard/users'
  perms: string[]; // permisos requeridos (ALL)
}

export const CLIENT_ROUTE_PERMISSIONS: ClientRoutePermission[] = [
  { pattern: "/dashboard", perms: ["dashboard:view"] },
  { pattern: "/dashboard/users", perms: ["users:view"] },
  { pattern: "/dashboard/users/create", perms: ["users:create"] },
  { pattern: "/dashboard/roles", perms: ["roles:view"] },
];

export function resolveRoutePermissions(pathname: string): string[] {
  let match: ClientRoutePermission | null = null;
  for (const cfg of CLIENT_ROUTE_PERMISSIONS) {
    if (pathname === cfg.pattern || pathname.startsWith(cfg.pattern + "/")) {
      if (!match || cfg.pattern.length > match.pattern.length) match = cfg;
    }
  }
  console.log("[PERM] resolve", pathname, match?.perms);
  return match?.perms || [];
}
