"use server";

import { nextAuthFetch } from "./utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";

export interface ExtendApprovalProcessRequest {
  approvalProcessId?: number;
  extendExpiration?: boolean;
  newExpirationDate?: string;
  extendCategories?: boolean;
  categoryIds?: number[];
  documentNames?: string[];
  contents?: File[];
  comments?: string;
}

export async function extendApprovalProcess(
  id: string | number,
  data: FormData
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.approvalProcesses.extend(id),
    method: "POST",
    data: data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<ApiStatusResponse>(res);
}
