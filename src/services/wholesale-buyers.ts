"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { updateTag } from "next/cache";
import {
  ApproveWholesaleBuyerInput,
  ListWholesaleBuyersResult,
  RejectWholesaleBuyerInput,
  RevokeWholesaleBuyerInput,
  WholesaleBuyerCommandResponse,
} from "@/types/wholesale-buyers";

const TAG = "wholesale-buyers";

export async function getAllWholesaleBuyers(
  params: IQueryable,
): Promise<ApiResponse<ListWholesaleBuyersResult>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.wholesaleBuyers.list,
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [TAG] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<ListWholesaleBuyersResult>(res);
}

export async function approveWholesaleBuyer(
  id: string,
  data: ApproveWholesaleBuyerInput,
): Promise<ApiResponse<WholesaleBuyerCommandResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.wholesaleBuyers.approve(id),
    method: "PUT",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  updateTag(TAG);

  return buildApiResponseAsync<WholesaleBuyerCommandResponse>(res);
}

export async function rejectWholesaleBuyer(
  id: string,
  data: RejectWholesaleBuyerInput,
): Promise<ApiResponse<WholesaleBuyerCommandResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.wholesaleBuyers.reject(id),
    method: "PUT",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  updateTag(TAG);

  return buildApiResponseAsync<WholesaleBuyerCommandResponse>(res);
}

export async function revokeWholesaleBuyer(
  id: string,
  data: RevokeWholesaleBuyerInput,
): Promise<ApiResponse<WholesaleBuyerCommandResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.wholesaleBuyers.revoke(id),
    method: "PUT",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  updateTag(TAG);

  return buildApiResponseAsync<WholesaleBuyerCommandResponse>(res);
}
