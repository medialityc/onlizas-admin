"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { QueryParamsURLFactory } from "@/lib/request";
import { backendRoutes } from "@/lib/endpoint";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import {
  CreateProduct,
  GetAllProducts,
  Product,
  ProductFilter,
  UpdateProduct,
  ProductSearchParams,
  SimpleCategoriesResponse,
  SimpleSuppliersResponse,
  CategoryFeaturesResponse,
  AssignSuppliersRequest,
  CanDeleteResponse
} from '@/types/products';
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";

export async function getAllProducts (
  params: ProductSearchParams & ProductFilter
): Promise<ApiResponse<GetAllProducts>> {
  // Transformar parámetros al formato esperado por la API
  const apiParams = {
    pageNumber: params.pageNumber || 1,
    pageSize: params.pageSize || 10,
    search: params.search,
    categoryId: params.categoryId,
    isActive: params.isActive,
    supplierId: params.supplierId
  };

  const url = new QueryParamsURLFactory(
    apiParams,
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

export async function deactivateProduct (
  id: number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.products.deactivate(id),
    method: "PATCH",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("products");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function canDeleteProduct (
  id: number
): Promise<ApiResponse<CanDeleteResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.products.canDelete(id),
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<CanDeleteResponse>(res);
}

export async function assignSuppliersToProduct (
  productId: number,
  data: AssignSuppliersRequest
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.products.assignSuppliers(productId),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("products");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function unassignSuppliersFromProduct (
  productId: number,
  data: AssignSuppliersRequest
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.products.unassignSuppliers(productId),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("products");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

// Servicios complementarios para formularios
export async function getSimpleCategories (): Promise<ApiResponse<SimpleCategoriesResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.products.simpleCategories,
    method: "GET",
    useAuth: true,
    next: { tags: ["categories"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<SimpleCategoriesResponse>(res);
}

export async function getSimpleSuppliers (): Promise<ApiResponse<SimpleSuppliersResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.products.simpleSuppliers,
    method: "GET",
    useAuth: true,
    next: { tags: ["suppliers"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<SimpleSuppliersResponse>(res);
}

export async function getCategoryFeatures (
  categoryIds: number[]
): Promise<ApiResponse<CategoryFeaturesResponse>> {
  const url = new QueryParamsURLFactory(
    { categoryIds: categoryIds.join(',') },
    backendRoutes.products.categoryFeatures
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["categories"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<CategoryFeaturesResponse>(res);
}