"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserPermissions, isAdmin } from "./index";

export function useUserPermissions() {
  return useQuery({
    queryKey: ["userPermissions"],
    queryFn: async () => {
      const response = await fetch('/api/permissions');
      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }
      const data = await response.json();
      return data.permissions || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useIsAdmin() {
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const response = await fetch('/api/permissions');
      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }
      const data = await response.json();
      return data.isAdmin || false;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useHasPermissions(requiredPermissions: string[] | undefined) {
  const { data: permissions = [], isLoading } = useUserPermissions();
  if (isLoading) return true; // Permitir mientras se cargan los permisos
  if (!requiredPermissions || requiredPermissions.length === 0) return false;
  return requiredPermissions.every(perm => permissions.includes(perm));
}