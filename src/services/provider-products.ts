"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { ApiResponse } from "@/types/fetch/api";
import { Product } from "@/types/products";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import { fetchUserMe } from "./users";

export async function createProductAsProvider(
  data: FormData
): Promise<ApiResponse<Product>> {
  // Get current user to automatically assign as supplier
  const userRes = await fetchUserMe();
  const currentUser = userRes?.data;
  
  if (!currentUser?.id) {
    return {
      error: true,
      status: 400,
      message: "No se pudo obtener la información del usuario actual",
    };
  }

  // Add current user as supplier
  data.append("supplierUserIds", JSON.stringify([currentUser.id]));

  const res = await nextAuthFetch({
    url: backendRoutes.products.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("products");

  return buildApiResponseAsync<Product>(res);
}

export async function updateProductAsProvider(
  id: number,
  data: FormData
): Promise<ApiResponse<Product>> {
  // Get current user to automatically assign as supplier
  const userRes = await fetchUserMe();
  const currentUser = userRes?.data;
  
  if (!currentUser?.id) {
    return {
      error: true,
      status: 400,
      message: "No se pudo obtener la información del usuario actual",
    };
  }

  // Add current user as supplier
  data.append("supplierUserIds", JSON.stringify([currentUser.id]));

  const res = await nextAuthFetch({
    url: backendRoutes.products.update(id),
    method: "PUT",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag("products");
  return buildApiResponseAsync<Product>(res);
}
