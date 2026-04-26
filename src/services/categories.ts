"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";

import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { updateTag } from "next/cache";
import {
  AduanaCategory,
  Category,
  GetAllAduanaCategories,
  GetAllCategories,
} from "@/types/categories";

export async function createCategory(
  data: FormData
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.categories.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  updateTag("categories");
  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function updateCategory(
  id: string | number,
  data: FormData
): Promise<ApiResponse<Category>> {
  const res = await nextAuthFetch({
    url: backendRoutes.categories.update(id),
    method: "PUT",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  updateTag("categories");

  return buildApiResponseAsync<Category>(res);
}

export async function toggleStatusCategory(
  id: string | number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.categories.toggleStatus(id),
    method: "PUT",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  updateTag("categories");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function getAllCategories(
  params: IQueryable
): Promise<ApiResponse<GetAllCategories>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.categories.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["categories"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllCategories>(res);
}

export async function getCategoryById(
  id: string | number
): Promise<ApiResponse<Category>> {
  const res = await nextAuthFetch({
    url: backendRoutes.categories.detail(id),
    method: "GET",
    useAuth: true,
    next: { tags: ["categories"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Category>(res);
}
export async function getAduanaCategories(
  params?: IQueryable
): Promise<ApiResponse<GetAllAduanaCategories>> {
  // Usa el endpoint backend optimizado: GET /aduana-categories/scroll (keyset pagination).
  // Ventajas vs /aduana-categories (offset):
  //   - Sin COUNT(*) por petición.
  //   - O(log n) por página: no se degrada al avanzar.
  //
  // El componente cliente (useInfiniteAutocomplete) usa páginas numéricas (1, 2, 3...).
  // El backend usa cursor opaco. Adaptamos aquí: cacheamos por "firma de query"
  // (search + pageSize) qué cursor devolvió cada página, para poder traducir
  // page=N a "el cursor que recibimos al pedir page=N-1".
  //
  // useInfiniteQuery siempre pide páginas en orden secuencial, así que el cache
  // tiene siempre el cursor anterior cuando se necesita.
  const page = Number(params?.page ?? 1);
  const pageSize = Number(
    params?.pagination?.pageSize ?? params?.pageSize ?? 35
  );
  const search = (params?.search as string | undefined) ?? "";
  const active = params?.active as boolean | undefined;

  const sig = JSON.stringify({ search, pageSize, active: active ?? null });
  const cursorMap = getCursorMap(sig);

  // Page 1 → sin cursor. Page > 1 → cursor que devolvió la página anterior.
  let cursor: string | null = null;
  if (page > 1) {
    cursor = cursorMap.get(page - 1) ?? null;
    if (!cursor) {
      // Si no tenemos el cursor previo (no se pidió la página anterior), devolvemos
      // página vacía cerrando el infinite scroll de forma segura.
      return {
        data: {
          data: [],
          page,
          pageSize,
          totalCount: 0,
          hasNext: false,
          hasPrevious: page > 1,
        },
        error: false,
        status: 200,
      };
    }
  } else {
    // Nuevo arranque para esta firma → limpia cursores antiguos del mismo sig.
    cursorMap.clear();
  }

  const qs = new URLSearchParams();
  qs.set("limit", String(pageSize));
  if (cursor) qs.set("cursor", cursor);
  if (search) qs.set("search", search);
  if (active !== undefined) qs.set("active", String(active));

  const url = `${backendRoutes.categories.aduanaCategoriesScroll}?${qs.toString()}`;

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["aduana-categories"] },
  });
  if (!res.ok) return handleApiServerError(res);

  type ScrollResponse = {
    data: AduanaCategory[];
    limit: number;
    nextCursor: string | null;
    hasNext: boolean;
  };

  const apiRes = await buildApiResponseAsync<ScrollResponse>(res);
  if (apiRes.error || !apiRes.data) {
    return apiRes as unknown as ApiResponse<GetAllAduanaCategories>;
  }

  // Guarda el nextCursor que se necesitará para pedir la siguiente página.
  if (apiRes.data.nextCursor) {
    cursorMap.set(page, apiRes.data.nextCursor);
  }

  // Adapta el shape al PaginatedResponse<T> que espera el hook.
  // totalCount = 0 (keyset no calcula total: el hook no lo necesita, sólo usa hasNext).
  const adapted: GetAllAduanaCategories = {
    data: apiRes.data.data,
    page,
    pageSize: apiRes.data.limit,
    totalCount: 0,
    hasNext: apiRes.data.hasNext,
    hasPrevious: page > 1,
  };

  return { ...apiRes, data: adapted };
}

// Cache de cursores por firma de query. Vive en módulo (server runtime).
// Los cursores son content-addressed, así que compartirlos entre requests es seguro.
const _cursorCacheByQuery = new Map<string, Map<number, string>>();
function getCursorMap(sig: string): Map<number, string> {
  let m = _cursorCacheByQuery.get(sig);
  if (!m) {
    m = new Map();
    _cursorCacheByQuery.set(sig, m);
  }
  return m;
}
// Para autocomplete infinito en promociones
export async function getCategoriesForPromotion(
  params: IQueryable
): Promise<ApiResponse<GetAllCategories>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.categories.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["categories-promotion"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllCategories>(res);
}

// Me supplier

export async function getAllMeApprovedCategories(
  params: IQueryable
): Promise<ApiResponse<GetAllCategories>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.categories.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["supplier-approved-categories"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllCategories>(res);
}

// Get categories by importer (filtered by importer's nomenclators)
export async function getCategoriesByImporter(
  importerId: string | number,
  params: IQueryable = {}
): Promise<ApiResponse<GetAllCategories>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.importers.categories(importerId)
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["importer-categories"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllCategories>(res);
}
