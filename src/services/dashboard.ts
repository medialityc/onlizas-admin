"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { ApiResponse } from "@/types/fetch/api";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { AdminDashboard, SupplierDashboard } from "@/types/dashboard";

export async function getAdminDashboard(): Promise<
  ApiResponse<AdminDashboard>
> {
  const res = await nextAuthFetch({
    url: backendRoutes.dashboard.admin,
    method: "GET",
    useAuth: true,
    next: { tags: ["dashboard", "admin"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<AdminDashboard>(res);
}

export async function getSupplierDashboard(): Promise<
  ApiResponse<SupplierDashboard>
> {
  const res = await nextAuthFetch({
    url: backendRoutes.dashboard.supplier,
    method: "GET",
    useAuth: true,
    next: { tags: ["dashboard", "supplier"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<SupplierDashboard>(res);
}
