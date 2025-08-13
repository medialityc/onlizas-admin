"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { QueryParamsURLFactory } from "@/lib/request";
import { backendRoutes } from "@/lib/endpoint";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { CreateProduct, GetAllProducts, Product, ProductFilter, UpdateProduct } from '@/types/products';
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";

export async function getAllProducts (
  params: IQueryable & ProductFilter
): Promise<ApiResponse<GetAllProducts>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.products.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["products"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllProducts>(res);
}

export async function getProductById (
  id: number
): Promise<ApiResponse<Product>> {
  const res = await nextAuthFetch({
    url: `${backendRoutes.products.list}/${id}`,
    method: "GET",
    useAuth: true,
    next: { tags: ["products"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<Product>(res);
}

export async function createProduct (
  data: CreateProduct
): Promise<ApiResponse<Product>> {
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

export async function updateProduct (
  id: number,
  data: UpdateProduct
): Promise<ApiResponse<Product>> {
  const res = await nextAuthFetch({
    url: backendRoutes.products.update(id),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("products");

  return buildApiResponseAsync<Product>(res);
}

export async function deleteProduct (
  id: number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.products.delete(id),
    method: "DELETE",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("products");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function assignSupplierToProduct (
  productId: number,
  supplierId: number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: `${backendRoutes.products.list}/${productId}/suppliers/${supplierId}`,
    method: "POST",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("products");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function unassignSupplierFromProduct (
  productId: number,
  supplierId: number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: `${backendRoutes.products.list}/${productId}/suppliers/${supplierId}`,
    method: "DELETE",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("products");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function uploadProductImage (
  productId: number,
  file: File
): Promise<ApiResponse<ApiStatusResponse>> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await nextAuthFetch({
    url: `${backendRoutes.products.list}/${productId}/images`,
    method: "POST",
    data: formData,
    useAuth: true,
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("products");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}