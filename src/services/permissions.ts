"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { CreatePermissionSchema } from "@/sections/permissions/create/permissions-schemas";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import {
  CreatePermissionResponse,
  DeletePermissionResponse,
  GetAllPermissionsResponse,
  PermissionUpdateData,
} from "@/types/permissions";
import { updateTag } from "next/cache";
import { nextAuthFetch } from "./utils/next-auth-fetch";

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
    data: { ...data, permissionType: Number(data.permissionType) },
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  updateTag("permissions");
  return buildApiResponseAsync<CreatePermissionResponse>(res);
}

export async function updatePermission(
  id: string,
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
  updateTag("permissions");
  return buildApiResponseAsync<CreatePermissionResponse>(res);
}

export async function deletePermission(
  id: string
): Promise<ApiResponse<DeletePermissionResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.permissions.delete(id),
    method: "DELETE",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  updateTag("permissions");
  return buildApiResponseAsync<DeletePermissionResponse>(res);
}

export async function getAllPermissionsBySubsystemId(
  id: string,
  params: IQueryable
): Promise<ApiResponse<GetAllPermissionsResponse>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.permissions.getBySubsystemId(id)
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
