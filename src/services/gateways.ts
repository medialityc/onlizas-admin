"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { backendRoutes } from "@/lib/endpoint";
import { IQueryable } from "@/types/fetch/request";
import { ApiResponse } from "zas-sso-client/dist/lib/api";
import { QueryParamsURLFactory } from "@/lib/request";
import { Gateway, GetAllGateways } from "@/types";

// Obtener todas las pasarelas
export async function getAllGateways(
  params: IQueryable = {}
): Promise<ApiResponse<Gateway[]>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.regions.payments.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["get-all-gateways"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<Gateway[]>(res);
}

// Obtener una pasarela específica
export async function getGatewayById(
  id: string
): Promise<ApiResponse<Gateway>> {
  const url = backendRoutes.regions.payments.update(id);

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["get-by-id-gateway", `gateway-${id}`] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<Gateway>(res);
}

// Crear una nueva pasarela
export async function createGateway(
  data: Omit<Gateway, "id">
): Promise<ApiResponse<Gateway>> {
  const url = backendRoutes.regions.payments.list;
  const res = await nextAuthFetch({
    url,
    method: "POST",
    data,
    useAuth: true,
    next: { tags: ["create-gateways"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<Gateway>(res);
}

// Actualizar una pasarela
export async function updateGateway(
  id: string,
  data: Gateway
): Promise<ApiResponse<Gateway>> {
  const url = backendRoutes.regions.payments.update(id);

  const res = await nextAuthFetch({
    url,
    method: "PUT",
    data,
    useAuth: true,
    next: { tags: ["update-gateways", `gateway-${id}`] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<Gateway>(res);
}

export async function deleteGateway(id: string): Promise<ApiResponse<void>> {
  const url = backendRoutes.regions.payments.update(id);

  const res = await nextAuthFetch({
    url,
    method: "DELETE",
    useAuth: true,
    next: { tags: ["delete-gateways", `gateway-${id}`] },
  });

  if (!res.ok) return handleApiServerError(res);

  // DELETE puede devolver 200/204 sin cuerpo, manejamos eso correctamente
  return {
    data: undefined as unknown as void,
    error: false,
    status: res.status,
  };
}

// Establecer una pasarela como predeterminada
export async function setGatewayAsDefault(
  id: string
): Promise<ApiResponse<void>> {
  const url = backendRoutes.regions.payments.setDefault(id);

  const res = await nextAuthFetch({
    url,
    method: "PUT",
    useAuth: true,
    next: { tags: ["setDefault-gateways", `gateway-${id}`] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<void>(res);
}
