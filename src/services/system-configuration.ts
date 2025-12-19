"use server";

import { IQueryable } from "@/types/fetch/request";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { backendRoutes } from "@/lib/endpoint";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { updateTag } from "next/cache";
import { PaginatedResponse } from "@/types/common";

import {
  CreateSystemConfigurationDto,
  SystemConfiguration,
  UpdateSystemConfiguration,
} from "@/types/system-configuration";
import { QueryParamsURLFactory } from "@/lib/request";

export async function getSystemConfigurations(
  params: IQueryable
): Promise<ApiResponse<PaginatedResponse<SystemConfiguration>>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.systemConfigurations.list
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["system-configurations"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<PaginatedResponse<SystemConfiguration>>(res);
}

export async function updateSystemConfiguration(
  id: number | string,
  data: UpdateSystemConfiguration
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemConfigurations.update(id),
    method: "PUT",
    data: JSON.stringify(data),
    contentType: "application/json",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  updateTag("system-configurations");
  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function createSystemConfiguration(
  data: CreateSystemConfigurationDto
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemConfigurations.create,
    method: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  updateTag("system-configurations");
  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function setSystemConfigurationAsDefault(
  id: number | string
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemConfigurations.setCurrent(id),
    method: "POST",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  updateTag("system-configurations");
  return buildApiResponseAsync<ApiStatusResponse>(res);
}
