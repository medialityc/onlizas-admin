"use server"
import { IQueryable } from "@/types/fetch/request";

import { Store, CreateStore, UpdateStore, GetAllStores } from "../types/stores";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { delay } from "lodash";
import { QueryParamsURLFactory } from "@/lib/request";
import { backendRoutes } from "@/lib/endpoint";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { mockStores } from "@/data/stores";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { revalidateTag } from "next/cache";




export async function getAllStores(
  params: IQueryable
): Promise<ApiResponse<GetAllStores>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.store.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["stores"] },
  });
  return mockStores

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllStores>(res);
}

export async function deleteStore(
  id: string | number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.store.delete(id),
    method: "DELETE",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("stores");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}
/* export async function getStoreById(id: number): Promise<ApiResponse<Store | undefined>> {
  if (useMock) {
    await wait(400);
    const store = stores.find((s) => s.id === id);
    return {
      status: store ? 200 : 404,
      data: store,
    };
  }

  const url = `${backendRoutes.stores.detail}/${id}`;
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Store>(res);
}

export async function createStore(data: CreateStore): Promise<ApiResponse<Store>> {
  if (useMock) {
    await wait(500);
    const newStore: Store = {
      ...data,
      id: stores.length ? Math.max(...stores.map((s) => s.id)) + 1 : 1,
      ownerId: "user-mock",
      banners: [],
      promotions: [],
      categories: [],
      metrics: {
        totalProducts: 0,
        views: 0,
        sales: 0,
        income: 0,
        monthlyVisits: 0,
        conversionRate: 0,
        totalCategories: 0,
      },
    };
    stores.push(newStore);
    return {
      status: 201,
      data: newStore,
    };
  }

  const res = await nextAuthFetch({
    url: backendRoutes.store.create,
    method: "POST",
    useAuth: true,
    data,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Store>(res);
}

export async function updateStore(id: number, data: UpdateStore): Promise<ApiResponse<Store | undefined>> {
  if (useMock) {
    await wait(400);
    const idx = stores.findIndex((s) => s.id === id);
    if (idx === -1) {
      return {
        status: 404,
        data: undefined,
      };
    }
    stores[idx] = { ...stores[idx], ...data };
    return {
      status: 200,
      data: stores[idx],
    };
  }

  const url = backendRoutes.store.update(id);
  const res = await nextAuthFetch({
    url,
    method: "PUT",
    useAuth: true,
    body: data,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Store>(res);
}

export async function deleteStore(id: number): Promise<ApiResponse<boolean>> {
  if (useMock) {
    await wait(300);
    const prevLen = stores.length;
    const updated = stores.filter((s) => s.id !== id);
    const deleted = updated.length < prevLen;
    if (deleted) stores.splice(0, stores.length, ...updated);
    return {
      status: deleted ? 200 : 404,
      data: deleted,
    };
  }

  const url = `${backendRoutes.stores.delete}/${id}`;
  const res = await nextAuthFetch({
    url,
    method: "DELETE",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<boolean>(res);
}
 */
/*  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return await getStoreById(storeId, session.user.id); */