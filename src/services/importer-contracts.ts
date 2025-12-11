"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { ApiResponse } from "@/types/fetch/api";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";

const CONTRACTS_TAG = "importer-contracts";

export async function approveContractRequest(id: string): Promise<ApiResponse<void>> {
  const res = await nextAuthFetch({
    url: backendRoutes.importerContracts.approve(id),
    method: "POST",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  
  revalidateTag(CONTRACTS_TAG);
  revalidateTag("importers");
  return buildApiResponseAsync<void>(res);
}

export async function rejectContractRequest(id: string): Promise<ApiResponse<void>> {
  const res = await nextAuthFetch({
    url: backendRoutes.importerContracts.reject(id),
    method: "POST",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  
  revalidateTag(CONTRACTS_TAG);
  revalidateTag("importers");
  return buildApiResponseAsync<void>(res);
}
