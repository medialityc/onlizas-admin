"use server";
import {
  CreateDepartment,
  Department,
  GetAllDepartments,
} from "./../types/departments";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";

import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";

export async function createDepartment(
  data: CreateDepartment
): Promise<ApiResponse<Department>> {
  const res = await nextAuthFetch({
    url: backendRoutes.departments.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("categories");

  return buildApiResponseAsync<Department>(res);
}

export async function deleteDepartment(
  id: string | number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.departments.delete(id),
    method: "DELETE",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("categories");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function getAllDepartments(
  params: IQueryable
): Promise<ApiResponse<GetAllDepartments>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.departments.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["departments"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllDepartments>(res);
}

export async function updateDepartment(
  id: string | number,
  data: CreateDepartment
): Promise<ApiResponse<Department>> {
  const res = await nextAuthFetch({
    url: backendRoutes.departments.update(id),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("categories");

  return buildApiResponseAsync<Department>(res);
}
