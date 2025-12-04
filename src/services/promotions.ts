"use server";

import { IQueryable } from "@/types/fetch/request";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { QueryParamsURLFactory } from "@/lib/request";
import { backendRoutes } from "@/lib/endpoint";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { revalidateTag } from "next/cache";
import {
  Promotion,
  GetStorePromotions,
  UpdatePromotionRequest,
} from "@/types/promotions";

export async function getStorePromotions(
  storeId: string | number,
  params: IQueryable
): Promise<ApiResponse<GetStorePromotions>> {
  const url = new QueryParamsURLFactory(
    { ...params, storeId },
    backendRoutes.storePromotions.list()
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["store-promotions", "store-promotions-by-store"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetStorePromotions>(res);
}
export async function getStorePromotionById(
  promotionId: string
): Promise<ApiResponse<Promotion>> {
  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.getPromotionById(promotionId),
    method: "GET",
    useAuth: true,
    next: { tags: ["store-promotions-byid"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<Promotion>(res);
}

export async function createPromotionInventory(
  formData: FormData
): Promise<ApiResponse<Promotion>> {
  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.createInventory(),
    method: "POST",
    data: formData,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-inventory");

  return buildApiResponseAsync<Promotion>(res);
}

export async function updatePromotionInventory(
  promotionId: string,
  data: FormData
): Promise<ApiResponse<Promotion>> {
  // Agregar el promotionId al FormData
  data.append("promotionId", promotionId.toString());

  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.updateInventory(promotionId),
    method: "PUT",
    data: data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-update-inventory");

  return buildApiResponseAsync<Promotion>(res);
}

export async function createPromotionXGetY(
  formData: FormData
): Promise<ApiResponse<Promotion>> {
  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.createGetY(),
    method: "POST",
    data: formData,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-buyX");

  return buildApiResponseAsync<Promotion>(res);
}
export async function createPromotionCode(
  formData: FormData
): Promise<ApiResponse<Promotion>> {
  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.createCode(),
    method: "POST",
    data: formData,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-code");

  return buildApiResponseAsync<Promotion>(res);
}
export async function createPromotionAutomatic(
  formData: FormData
): Promise<ApiResponse<Promotion>> {
  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.createAutomatic(),
    method: "POST",
    data: formData,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-fixed");

  return buildApiResponseAsync<Promotion>(res);
}
export async function createPromotionFree(
  formData: FormData
): Promise<ApiResponse<Promotion>> {
  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.createFreeDelivery(),
    method: "POST",
    data: formData,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-free");

  return buildApiResponseAsync<Promotion>(res);
}
export async function createPromotionOvervalue(
  formData: FormData
): Promise<ApiResponse<Promotion>> {
  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.createOvervalue(),
    method: "POST",
    data: formData,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-overvalue");

  return buildApiResponseAsync<Promotion>(res);
}
export async function createPromotionPackage(
  formData: FormData
): Promise<ApiResponse<Promotion>> {
  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.createPackage(),
    method: "POST",
    data: formData,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-package");

  return buildApiResponseAsync<Promotion>(res);
}

export async function updatePromotionGetY(
  promotionId: string,
  data: FormData
): Promise<ApiResponse<Promotion>> {
  // Agregar el promotionId al FormData
  data.append("promotionId", promotionId.toString());

  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.updateGetY(promotionId),
    method: "PUT",
    data: data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-update-gety");

  return buildApiResponseAsync<Promotion>(res);
}
export async function updatePromotionCode(
  promotionId: string,
  data: FormData
): Promise<ApiResponse<Promotion>> {
  // Agregar el promotionId al FormData
  data.append("promotionId", promotionId.toString());

  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.updateCode(promotionId),
    method: "PUT",
    data: data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-update-code");

  return buildApiResponseAsync<Promotion>(res);
}
export async function updatePromotionAutomatic(
  promotionId: string,
  data: FormData
): Promise<ApiResponse<Promotion>> {
  // Agregar el promotionId al FormData
  data.append("promotionId", promotionId.toString());

  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.updateAutomatic(promotionId),
    method: "PUT",
    data: data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-update-fixed");

  return buildApiResponseAsync<Promotion>(res);
}
export async function updatePromotionFree(
  promotionId: string,
  data: FormData
): Promise<ApiResponse<Promotion>> {
  // Agregar el promotionId al FormData
  data.append("promotionId", promotionId.toString());

  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.updateFreeDelivery(promotionId),
    method: "PUT",
    data: data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-update-free");

  return buildApiResponseAsync<Promotion>(res);
}
export async function updatePromotionOvervalue(
  promotionId: string,
  data: FormData
): Promise<ApiResponse<Promotion>> {
  // Agregar el promotionId al FormData
  data.append("promotionId", promotionId.toString());

  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.updateOvervalue(promotionId),
    method: "PUT",
    data: data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-update-overvalue");

  return buildApiResponseAsync<Promotion>(res);
}
export async function updatePromotionPackage(
  promotionId: string,
  data: FormData
): Promise<ApiResponse<Promotion>> {
  // Agregar el promotionId al FormData
  data.append("promotionId", promotionId.toString());

  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.updatePackage(promotionId),
    method: "PUT",
    data: data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-update-package");

  return buildApiResponseAsync<Promotion>(res);
}

export async function deletePromotion(
  promotionId: string
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.delete(promotionId),
    method: "DELETE",
    data: JSON.stringify({ promotionId }),
    contentType: "application/json",
    useAuth: true,
  });

  if (!res.ok)
    // Leer cuerpo del error para mensaje
    return handleApiServerError(res);

  revalidateTag("store-promotions");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function togglePromotionStatus(
  promotionId: string
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.toggle(),
    method: "PATCH",
    data: JSON.stringify({ promotionId }),
    contentType: "application/json",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function generatePromotionCode(): Promise<ApiResponse<string>> {
  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.code(),
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-code");
  return buildApiResponseAsync<string>(res);
}
