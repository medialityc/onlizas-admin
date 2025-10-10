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
  UpdatePromotionRequest
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
    next: { tags: ["store-promotions", `store-promotions-${storeId}`] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetStorePromotions>(res);
}
export async function getStorePromotionById(
  promotionId: number,
  
): Promise<ApiResponse<Promotion>> {
  const res = await nextAuthFetch({
    url:backendRoutes.storePromotions.getPromotionById(promotionId),
    method: "GET",
    useAuth: true,
    next: { tags: ["store-promotions-byid"]},
  });

  if (!res.ok) return handleApiServerError(res);

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

  revalidateTag(`store-promotions-buyX-${formData}`);

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

  revalidateTag(`store-promotions-code-${formData}`);

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

  revalidateTag(`store-promotions-fixed-${formData}`);

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

  revalidateTag(`store-promotions-free-${formData}`);

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

  revalidateTag(`store-promotions-overvalue-${formData}`);

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

  revalidateTag(`store-promotions-package-${formData}`);

  return buildApiResponseAsync<Promotion>(res);
}

export async function updatePromotionGetY(
  promotionId: number,
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


  revalidateTag(`store-promotions-update-gety-${data}`);

  return buildApiResponseAsync<Promotion>(res);
}
export async function updatePromotionCode(
  promotionId: number,
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

  revalidateTag(`store-promotions-update-code-${data}`);

  return buildApiResponseAsync<Promotion>(res);
}
export async function updatePromotionAutomatic(
  promotionId: number,
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


  revalidateTag(`store-promotions-update-fixed-${data}`);

  return buildApiResponseAsync<Promotion>(res);
}
export async function updatePromotionFree(
  promotionId: number,
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


  revalidateTag(`store-promotions-update-free-${data}`);

  return buildApiResponseAsync<Promotion>(res);
}
export async function updatePromotionOvervalue(
  promotionId: number,
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


  revalidateTag(`store-promotions-update-overvalue-${data}`);

  return buildApiResponseAsync<Promotion>(res);
}
export async function updatePromotionPackage(
  promotionId: number,
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


  revalidateTag(`store-promotions-update-package-${data}`);

  return buildApiResponseAsync<Promotion>(res);
}


export async function deletePromotion(
  promotionId: number
): Promise<ApiResponse<ApiStatusResponse>> {
  console.log(promotionId, "promocion delete")
  const res = await nextAuthFetch({
    url: backendRoutes.storePromotions.delete(promotionId),
    method: "DELETE",
    data: JSON.stringify({ promotionId }),
    contentType: "application/json",
    useAuth: true,
  });

  console.log('API delete response:', res);
  if (!res.ok)
    // Leer cuerpo del error para mensaje
    return handleApiServerError(res);

  revalidateTag("store-promotions");


  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function togglePromotionStatus(

  promotionId: number
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

  console.log(res)
  if (!res.ok) return handleApiServerError(res);

  revalidateTag("store-promotions-code");
  return buildApiResponseAsync<string>(res);
}
