"use client";
import { ReactNode } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { InventoryListSkeleton } from "./skeleton/inventory-list-skeleton";

interface InventoryPermissionGateProps {
  children: ReactNode;
  requireAdmin?: boolean; // si true, sólo muestra children si tiene RETRIEVE
  fallback?: ReactNode; // skeleton personalizado
  keepSkeletonForNonAdmin?: boolean; // si true y no es admin muestra skeleton en vez de children
}

/**
 * Componente reutilizable para ocultar navegación / layout hasta resolver permisos.
 * - Muestra skeleton mientras permisos cargan.
 * - Si requireAdmin y no tiene permiso RETRIEVE -> fallback.
 * - Si keepSkeletonForNonAdmin y no es admin -> fallback.
 */
export function InventoryPermissionGate({
  children,
  requireAdmin = false,
  fallback,
  keepSkeletonForNonAdmin = false,
}: InventoryPermissionGateProps) {
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const isAdmin = hasPermission([PERMISSION_ENUM.RETRIEVE]);

  const skeleton = fallback || <InventoryListSkeleton />;

  if (permissionsLoading) return skeleton;
  if (requireAdmin && !isAdmin) return skeleton;
  if (keepSkeletonForNonAdmin && !isAdmin) return skeleton;

  return <>{children}</>;
}
