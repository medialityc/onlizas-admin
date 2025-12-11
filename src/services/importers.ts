"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { ApiResponse } from "@/types/fetch/api";
import {
  GetImporters,
  Importer,
  CreateImporterPayload,
  UpdateImporterPayload,
  GetImporterNomenclators,
  GetImporterContractRequests,
  GetSupplierContracts,
} from "@/types/importers";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import { IQueryable } from "@/types/fetch/request";
import { QueryParamsURLFactory } from "@/lib/request";

const IMPORTERS_TAG = "importers";

export async function getImporters(params: IQueryable = {}): Promise<ApiResponse<GetImporters>> {
  const url = new QueryParamsURLFactory(params, backendRoutes.importers.list).build();
  
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [IMPORTERS_TAG] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetImporters>(res);
}

export async function getImporterById(id: string): Promise<ApiResponse<Importer>> {
  const res = await nextAuthFetch({
    url: backendRoutes.importers.getById(id),
    method: "GET",
    useAuth: true,
    next: { tags: [IMPORTERS_TAG] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Importer>(res);
}

export async function createImporter(data: CreateImporterPayload): Promise<ApiResponse<Importer>> {
  const res = await nextAuthFetch({
    url: backendRoutes.importers.create,
    method: "POST",
    useAuth: true,
    data: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return handleApiServerError(res);
  
  revalidateTag(IMPORTERS_TAG);
  return buildApiResponseAsync<Importer>(res);
}

export async function updateImporter(
  id: string,
  data: UpdateImporterPayload
): Promise<ApiResponse<Importer>> {
  const res = await nextAuthFetch({
    url: backendRoutes.importers.update(id),
    method: "PUT",
    useAuth: true,
    data: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return handleApiServerError(res);
  
  revalidateTag(IMPORTERS_TAG);
  return buildApiResponseAsync<Importer>(res);
}

export async function toggleImporterStatus(id: string): Promise<ApiResponse<void>> {
  const res = await nextAuthFetch({
    url: backendRoutes.importers.toggleStatus(id),
    method: "PATCH",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  
  revalidateTag(IMPORTERS_TAG);
  return buildApiResponseAsync<void>(res);
}

export async function getImporterNomenclators(
  importerId: string,
  params: IQueryable = {}
): Promise<ApiResponse<GetImporterNomenclators>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.importers.nomenclators(importerId)
  ).build();
  
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [IMPORTERS_TAG] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetImporterNomenclators>(res);
}

export async function getPendingContractRequests(
  importerId: string,
  params: IQueryable = {}
): Promise<ApiResponse<GetImporterContractRequests>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.importers.pendingContracts(importerId)
  ).build();
  
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [IMPORTERS_TAG] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetImporterContractRequests>(res);
}

export async function getSupplierContracts(
  supplierId: string,
  params: IQueryable = {}
): Promise<ApiResponse<GetSupplierContracts>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.importers.supplierContracts(supplierId)
  ).build();
  
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [IMPORTERS_TAG] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetSupplierContracts>(res);
}
