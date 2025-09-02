"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { QueryParamsURLFactory } from "@/lib/request";
import { backendRoutes } from "@/lib/endpoint";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";

import {
  GetAllProducts,
  Product,
  SimpleCategoriesResponse,
  SimpleSuppliersResponse,
  CategoryFeaturesResponse,
  AssignSuppliersRequest,
  CanDeleteResponse,
} from "@/types/products";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import { IQueryable } from "@/types/fetch/request";
import { PaginatedResponse } from "@/types/common";
import { ProductFormData } from "@/sections/products/schema/product-schema";

export async function getAllProducts(
  params: IQueryable
): Promise<ApiResponse<PaginatedResponse<ProductFormData>>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.products.list
  ).build();

  const res = await nextAuthFetch({
    url,
    useAuth: true,
    next: { tags: ["products"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<PaginatedResponse<ProductFormData>>(res);
}

export async function getAllProductsBySupplier(
  supplierId: number,
  params: IQueryable
): Promise<ApiResponse<GetAllProducts>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.products.listBySupplier(supplierId)
  ).build();

  const res = await nextAuthFetch({
    url,
    useAuth: true,
    next: { tags: ["products-supplier"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllProducts>(res);
}

export async function getProductById(
  id: number
): Promise<ApiResponse<Product>> {
  const res = await nextAuthFetch({
    url: backendRoutes.products.byId(id),
    method: "GET",
    useAuth: true,
    next: { tags: ["products"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<Product>(res);
}

export async function createProduct(
  data: FormData
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

export async function updateProduct(
  id: number,
  data: FormData
): Promise<ApiResponse<Product>> {
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

export async function deleteProduct(
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

export async function deactivateProduct(
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

export async function canDeleteProduct(
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

export async function assignSuppliersToProduct(
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

export async function unassignSuppliersFromProduct(
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
export async function getSimpleCategories(): Promise<
  ApiResponse<SimpleCategoriesResponse>
> {
  const res = await nextAuthFetch({
    url: backendRoutes.products.simpleCategories,
    method: "GET",
    useAuth: true,
    next: { tags: ["categories"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<SimpleCategoriesResponse>(res);
}

export async function getSimpleSuppliers(): Promise<
  ApiResponse<SimpleSuppliersResponse>
> {
  const res = await nextAuthFetch({
    url: backendRoutes.products.simpleSuppliers,
    method: "GET",
    useAuth: true,
    next: { tags: ["suppliers"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<SimpleSuppliersResponse>(res);
}

export async function getCategoryFeatures(
  categoryIds: number[]
): Promise<ApiResponse<CategoryFeaturesResponse>> {
  const url = new QueryParamsURLFactory(
    { categoryIds: categoryIds.join(",") },
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

/* MY PRODUCTS */

export async function getAllMyProducts(
  params: IQueryable
): Promise<ApiResponse<GetAllProducts>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.products.listMyProducts()
  ).build();

  const res = await nextAuthFetch({
    url,
    useAuth: true,
    next: { tags: ["my-products-supplier"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllProducts>(res);
}

export async function createSupplierProductLink(
  productId: number | string
): Promise<ApiResponse<Product>> {
  const res = await nextAuthFetch({
    url: backendRoutes.products.createSupplierProductByLink(1), //todo
    method: "POST",
    data: {
      productId,
    },
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("products-supplier");

  return buildApiResponseAsync<Product>(res);
}

export async function createSupplierProduct(
  data: FormData
): Promise<ApiResponse<Product>> {
  const res = await nextAuthFetch({
    url: backendRoutes.products.createSupplierProduct(1), // todo
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("products-supplier");

  return buildApiResponseAsync<Product>(res);
}

export async function updateSupplierProduct(
  productId: number,
  data: FormData
): Promise<ApiResponse<Product>> {
  const res = await nextAuthFetch({
    url: backendRoutes.products.updateSupplierProduct(1, productId), //todo
    method: "PUT",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  revalidateTag("products-supplier");
  return buildApiResponseAsync<Product>(res);
}
