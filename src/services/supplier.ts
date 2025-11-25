"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";

import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import {
  AnswerApprovalProcess,
  ApprovalProcess,
  GetAllPendingSuppliers,
  GetAllSuppliers,
  GetAllValidSuppliers,
  GetSupplierEvaluations,
  Supplier,
  SupplierApprovalProcess,
  SupplierDetails,
} from "@/types/suppliers";
import { WithLoginForm } from "@/sections/suppliers/edit/login-user/whitloginSchema";

export async function createSupplier(
  data: FormData
): Promise<ApiResponse<Supplier>> {
  const res = await nextAuthFetch({
    url: backendRoutes.suppliers.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("suppliers");

  return buildApiResponseAsync<Supplier>(res);
}

export async function deleteSuppliers(
  id: string | number
): Promise<ApiResponse<Supplier>> {
  const res = await nextAuthFetch({
    url: backendRoutes.suppliers.delete(id),
    method: "DELETE",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("suppliers");

  return buildApiResponseAsync(res);
}

export async function getAllSuppliers(
  params: IQueryable
): Promise<ApiResponse<GetAllSuppliers>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.suppliers.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["suppliers"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllSuppliers>(res);
}

export async function updateSupplierData(
  id: string | number,
  data: FormData
): Promise<ApiResponse<Supplier>> {
  const res = await nextAuthFetch({
    url: backendRoutes.suppliers.update(id),
    method: "PUT",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("supplier");
  revalidateTag("suppliers");

  return buildApiResponseAsync<Supplier>(res);
}

export async function getPendingSuppliers(
  params: IQueryable
): Promise<ApiResponse<GetAllPendingSuppliers>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.suppliers.pending
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync(res);
}

export async function getValidSuppliers(
  params: IQueryable
): Promise<ApiResponse<GetAllValidSuppliers>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.suppliers.valid
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync(res);
}

export async function getSupplierDetails(
  id: string
): Promise<ApiResponse<SupplierDetails>> {
  const res = await nextAuthFetch({
    url: `${process.env.NEXT_PUBLIC_API_URL}admin/approval-process?approvalProcessId=${id}`,
    method: "GET",
    cache: "no-store",
    next: { tags: ["supplier"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync(res);
}

export async function getSupplierEvaluations(
  id: string,
  params: IQueryable
): Promise<ApiResponse<GetSupplierEvaluations>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.suppliers.evaluations(id)
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync(res);
}

export async function getApprovalProcess(
  id: string
): Promise<ApiResponse<ApprovalProcess>> {
  const res = await nextAuthFetch({
    url: `${process.env.NEXT_PUBLIC_API_URL}admin/supplier/${id}/approval-process`,
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync(res);
}

// Variante que retorna el proceso de aprobación completo (incluye sellerType)
export async function getSupplierApprovalProcessById(
  id: string | number
): Promise<ApiResponse<SupplierApprovalProcess>> {
  const res = await nextAuthFetch({
    url: `${process.env.NEXT_PUBLIC_API_URL}suppliers/${id}/approval-process`,
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<SupplierApprovalProcess>(res);
}

export async function getSupplierApprovalProcess(): Promise<
  ApiResponse<SupplierApprovalProcess>
> {
  const res = await nextAuthFetch({
    url: backendRoutes.approvalProcesses.list,
    method: "GET",
    cache: "no-store",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<SupplierApprovalProcess>(res);
}

export async function countSuppliers(): Promise<
  ApiResponse<{
    pending: 1;
    approved: 0;
    total: 1;
  }>
> {
  const res = await nextAuthFetch({
    url: `${process.env.NEXT_PUBLIC_API_URL}admin/approval-processes/counts`,
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync(res);
}

export async function answerApprovalProcess(
  data: AnswerApprovalProcess
): Promise<ApiResponse<AnswerApprovalProcess>> {
  const res = await nextAuthFetch({
    url: `${process.env.NEXT_PUBLIC_API_URL}approval-processes/approve`,
    method: "PUT",
    contentType: "application/json",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("supplier");
  return buildApiResponseAsync(res);
}

export async function createUserSupplier(
  id: string,
  data: WithLoginForm
): Promise<ApiResponse<Supplier>> {
  const res = await nextAuthFetch({
    url: `${process.env.NEXT_PUBLIC_API_URL}approval-processes/${id}/user`,
    method: "POST",
    data: {
      changePassword: data.changePassword,
      approvalProcessId: id,
      password: data.password,
    },
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("supplier");
  return buildApiResponseAsync<Supplier>(res);
}
