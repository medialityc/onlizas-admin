"use client";
import { ReactNode } from "react";
import { usePermissions } from "@/hooks/use-permissions";

interface PermissionGateProps {
  children: ReactNode;
  required?: string[]; // debe tener todos
  anyOf?: string[]; // debe tener alguno
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  keepFallbackIfMissing?: boolean; // si true y no cumple muestra fallback en vez de children
}

/**
 * Gate genérico de permisos.
 * - Muestra loadingFallback mientras permisos cargan.
 * - Evalúa required (AND) y anyOf (OR).
 * - Si no cumple y keepFallbackIfMissing -> fallback.
 * - Si no cumple y no keepFallbackIfMissing -> null.
 */
export function PermissionGate({
  children,
  required,
  anyOf,
  fallback = null,
  loadingFallback = null,
  keepFallbackIfMissing = true,
}: PermissionGateProps) {
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();

  if (permissionsLoading) return loadingFallback || fallback;

  const passesRequired = required ? hasPermission(required) : true;
  const passesAny = anyOf ? hasPermission(anyOf) : true;
  const allowed = passesRequired && passesAny;

  if (!allowed) return keepFallbackIfMissing ? fallback : null;
  return <>{children}</>;
}
