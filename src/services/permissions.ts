"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { ApiResponse } from "@/types/fetch/api";
import {
  CreatePermissionResponse,
  DeletePermissionResponse,
  GetAllPermissionsResponse,
  PermissionUpdateData,
} from "@/types/permissions";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { CreatePermissionSchema } from "@/sections/permissions/create/permissions-schemas";
import { IQueryable } from "@/types/fetch/request";
import { QueryParamsURLFactory } from "@/lib/request";
import { revalidateTag } from "next/cache";

export async function getAllPermissions(
  params: IQueryable
): Promise<ApiResponse<GetAllPermissionsResponse>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.permissions.getAll
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["permissions"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllPermissionsResponse>(res);
}

export async function createPermission(
  data: CreatePermissionSchema
): Promise<ApiResponse<CreatePermissionResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.permissions.create,
    method: "POST",
    data,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("permissions");
  return buildApiResponseAsync<CreatePermissionResponse>(res);
}

export async function updatePermission(
  id: number,
  data: PermissionUpdateData
): Promise<ApiResponse<CreatePermissionResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.permissions.update(id),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("permissions");
  return buildApiResponseAsync<CreatePermissionResponse>(res);
}

export async function deletePermission(
  id: number
): Promise<ApiResponse<DeletePermissionResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.permissions.delete(id),
    method: "DELETE",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("permissions");
  return buildApiResponseAsync<DeletePermissionResponse>(res);
}
