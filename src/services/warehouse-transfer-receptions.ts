"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import {
  GetAllTransferReceptions,
  TransferReception,
  TransferReceptionFilter,
  CreateReceptionData,
  ReportDiscrepancyData,
  ResolveDiscrepancyData,
  GetReceptionLogs,
  ReceptionComment,
  NewInventoryFromReception
} from "@/types/warehouse-transfer-receptions";

const TRANSFER_RECEPTION_TAG = "transfer-receptions";

// Obtener todas las recepciones de transferencias
export async function getAllTransferReceptions(
  params: IQueryable & TransferReceptionFilter
): Promise<ApiResponse<GetAllTransferReceptions>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.transferReceptions.list
  ).build();
  
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [TRANSFER_RECEPTION_TAG] },
  });
  
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllTransferReceptions>(res);
}

// Obtener recepción por ID
export async function getTransferReceptionById(
  id: number
): Promise<ApiResponse<TransferReception>> {
  const res = await nextAuthFetch({
    url: backendRoutes.transferReceptions.getById(id),
    method: "GET",
    useAuth: true,
    next: { tags: [TRANSFER_RECEPTION_TAG, String(id)] },
  });
  
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<TransferReception>(res);
}

// Recibir transferencia en almacén destino
export async function receiveTransfer(
  data: CreateReceptionData
): Promise<ApiResponse<TransferReception>> {
  const res = await nextAuthFetch({
    url: backendRoutes.transferReceptions.receive,
    method: "POST",
    data,
    useAuth: true,
  });
  
  if (!res.ok) return handleApiServerError(res);
  revalidateTag(TRANSFER_RECEPTION_TAG);
  return buildApiResponseAsync<TransferReception>(res);
}

// Reportar discrepancia
export async function reportDiscrepancy(
  data: ReportDiscrepancyData
): Promise<ApiResponse<{ success: boolean; discrepancyId: number }>> {
  const formData = new FormData();
  formData.append("receptionId", String(data.receptionId));
  formData.append("itemId", String(data.itemId));
  formData.append("type", data.type);
  formData.append("description", data.description);
  
  if (data.quantity) {
    formData.append("quantity", String(data.quantity));
  }
  
  if (data.evidence) {
    data.evidence.forEach((file, index) => {
      formData.append(`evidence_${index}`, file);
    });
  }
  
  const res = await nextAuthFetch({
    url: backendRoutes.transferReceptions.reportDiscrepancy(data.receptionId),
    method: "POST",
    data: formData,
    useAuth: true,
  });
  
  if (!res.ok) return handleApiServerError(res);
  revalidateTag(TRANSFER_RECEPTION_TAG);
  return buildApiResponseAsync<{ success: boolean; discrepancyId: number }>(res);
}

// Resolver discrepancia
export async function resolveDiscrepancy(
  data: ResolveDiscrepancyData
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await nextAuthFetch({
    url: backendRoutes.transferReceptions.resolveDiscrepancy(data.discrepancyId),
    method: "POST",
    data,
    useAuth: true,
  });
  
  if (!res.ok) return handleApiServerError(res);
  revalidateTag(TRANSFER_RECEPTION_TAG);
  return buildApiResponseAsync<{ success: boolean }>(res);
}

// Agregar comentario a recepción
export async function addReceptionComment(
  receptionId: number,
  message: string,
  attachments?: File[]
): Promise<ApiResponse<ReceptionComment>> {
  const formData = new FormData();
  formData.append("message", message);
  
  if (attachments) {
    attachments.forEach((file, index) => {
      formData.append(`attachment_${index}`, file);
    });
  }
  
  const res = await nextAuthFetch({
    url: backendRoutes.transferReceptions.addComment(receptionId),
    method: "POST",
    data: formData,
    useAuth: true,
  });
  
  if (!res.ok) return handleApiServerError(res);
  revalidateTag(TRANSFER_RECEPTION_TAG);
  return buildApiResponseAsync<ReceptionComment>(res);
}

// Obtener logs de recepción
export async function getReceptionLogs(
  params: IQueryable
): Promise<ApiResponse<GetReceptionLogs>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.transferReceptions.logs
  ).build();
  
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [`${TRANSFER_RECEPTION_TAG}-logs`] },
  });
  
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetReceptionLogs>(res);
}

// Crear inventario nuevo desde productos no esperados
export async function createNewInventoryFromReception(
  receptionId: number,
  inventoryData: {
    productVariantId: number;
    quantity: number;
    batchNumber?: string;
    expirationDate?: string;
    notes?: string;
  }
): Promise<ApiResponse<NewInventoryFromReception>> {
  const res = await nextAuthFetch({
    url: backendRoutes.transferReceptions.createInventory(receptionId),
    method: "POST",
    data: inventoryData,
    useAuth: true,
  });
  
  if (!res.ok) return handleApiServerError(res);
  revalidateTag(TRANSFER_RECEPTION_TAG);
  return buildApiResponseAsync<NewInventoryFromReception>(res);
}