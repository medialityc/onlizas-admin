"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { ApiResponse } from "@/types/fetch/api";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import type { ImporterNomenclator } from "@/types/importers";

const NOMENCLATORS_TAG = "nomenclators";

export type CreateNomenclatorPayload = {
  name: string;
  importerId: string;
  categoryIds: string[];
};

export type UpdateNomenclatorPayload = {
  name: string;
  categoryIds: string[];
};

export type NomenclatorCategory = {
  id: string;
  name: string;
  active?: boolean;
  departmentId?: string;
  departmentName?: string;
  description?: string;
  image?: string;
};

export type NomenclatorDetails = {
  id: string;
  name: string;
  isActive: boolean;
  importerId: string;
  importerName: string;
  createdAt: string;
  updatedAt: string;
  categories: NomenclatorCategory[];
};

export async function getNomenclatorById(
  id: string
): Promise<ApiResponse<NomenclatorDetails>> {
  const res = await nextAuthFetch({
    url: backendRoutes.nomenclators.getById(id),
    method: "GET",
    useAuth: true,
    next: { tags: [NOMENCLATORS_TAG] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<NomenclatorDetails>(res);
}

export async function createNomenclator(
  data: CreateNomenclatorPayload
): Promise<ApiResponse<ImporterNomenclator>> {
  const res = await nextAuthFetch({
    url: backendRoutes.nomenclators.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag(NOMENCLATORS_TAG, "max");
  revalidateTag("importers", "max");
  return buildApiResponseAsync<ImporterNomenclator>(res);
}

export async function updateNomenclator(
  id: string,
  data: UpdateNomenclatorPayload
): Promise<ApiResponse<ImporterNomenclator>> {
  const res = await nextAuthFetch({
    url: backendRoutes.nomenclators.update(id),
    method: "PUT",
    data,
    useAuth: true,
  });

  if (!res.ok) {
    const fallback = await nextAuthFetch({
      url: backendRoutes.nomenclators.updateBase,
      method: "PUT",
      data,
      useAuth: true,
    });

    if (!fallback.ok) return handleApiServerError(fallback);

    revalidateTag(NOMENCLATORS_TAG, "max");
    revalidateTag("importers", "max");
    return buildApiResponseAsync<ImporterNomenclator>(fallback);
  }

  revalidateTag(NOMENCLATORS_TAG, "max");
  revalidateTag("importers", "max");
  return buildApiResponseAsync<ImporterNomenclator>(res);
}

export async function toggleNomenclatorStatus(
  id: string
): Promise<ApiResponse<void>> {
  const res = await nextAuthFetch({
    url: backendRoutes.nomenclators.toggleStatus(id),
    method: "PATCH",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag(NOMENCLATORS_TAG, "max");
  revalidateTag("importers", "max");
  return buildApiResponseAsync<void>(res);
}
