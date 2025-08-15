"use server";

import { buildApiResponseAsync, handleApiServerError } from '@/lib/api';
import { backendRoutes } from '@/lib/endpoint';
import { QueryParamsURLFactory } from '@/lib/request';
import { ApiResponse } from '@/types/fetch/api';
import { IQueryable } from '@/types/fetch/request';
import { CreateWarehouse, GetAllWarehouses, UpdateWarehouse, Warehouse, WarehouseFilter } from '@/types/warehouses';
import { nextAuthFetch } from './utils/next-auth-fetch';
import { revalidateTag } from 'next/cache';

export async function getAllWarehouses (params: IQueryable & WarehouseFilter): Promise<ApiResponse<GetAllWarehouses>> {
  const url = new QueryParamsURLFactory({ ...params }, backendRoutes.warehouses.list).build();
  const res = await nextAuthFetch({ url, method: 'GET', useAuth: true, next: { tags: ['warehouses'] } });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllWarehouses>(res);
}

export async function getWarehouseById (id: number): Promise<ApiResponse<Warehouse>> {
  const res = await nextAuthFetch({ url: `${backendRoutes.warehouses.list}/${id}`, method: 'GET', useAuth: true, next: { tags: ['warehouses'] } });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Warehouse>(res);
}

export async function createWarehouse (data: CreateWarehouse): Promise<ApiResponse<Warehouse>> {
  const res = await nextAuthFetch({ url: backendRoutes.warehouses.create, method: 'POST', data, useAuth: true });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag('warehouses');
  return buildApiResponseAsync<Warehouse>(res);
}

export async function updateWarehouse (id: number, data: UpdateWarehouse): Promise<ApiResponse<Warehouse>> {
  const res = await nextAuthFetch({ url: backendRoutes.warehouses.update(id), method: 'PUT', data, useAuth: true });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag('warehouses');
  return buildApiResponseAsync<Warehouse>(res);
}

export async function deleteWarehouse (id: number): Promise<ApiResponse<{ success: boolean }>> {
  const res = await nextAuthFetch({ url: backendRoutes.warehouses.delete(id), method: 'DELETE', useAuth: true });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag('warehouses');
  return buildApiResponseAsync<{ success: boolean }>(res);
}
