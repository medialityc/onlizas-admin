"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserPermissions, isAdmin } from "./index";

export function useUserPermissions() {
  return useQuery({
    queryKey: ["userPermissions"],
    queryFn: getUserPermissions,
    staleTime: 5 * 60 * 1000,
  });
}

export function useIsAdmin() {
  console.log("🎣 useIsAdmin hook called");
  const result = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      console.log("🔄 useIsAdmin queryFn executing...");
      const adminResult = await isAdmin();
      console.log("🎭 useIsAdmin result:", adminResult);
      return adminResult;
    },
    staleTime: 5 * 60 * 1000,
  });
  
  console.log("🎣 useIsAdmin hook returning:", { data: result.data, isLoading: result.isLoading });
  return result;
}