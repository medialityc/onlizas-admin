"use server";
import {
  AddDocumentResponse,
  ValidateDocument,
  ValidateDocumentResponse,
} from "@/types/documents";
import { ApiResponse } from "@/types/fetch/api";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { backendRoutes } from "@/lib/endpoint";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { revalidateTag } from "next/cache";

export async function validateDocument(
  id: number,
  data: ValidateDocument
): Promise<ApiResponse<ValidateDocumentResponse>> {
  console.log(data);

  const res = await nextAuthFetch({
    url: backendRoutes.documents.validate(id),
    method: "PUT",
    data,
    useAuth: true,
    // No establecer Content-Type manualmente para FormData
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("supplier");

  return buildApiResponseAsync<ValidateDocumentResponse>(res);
}

export async function uploadDocument(
  data: FormData
): Promise<ApiResponse<AddDocumentResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.documents.create,
    method: "POST",
    data,
    useAuth: true,
    // No establecer Content-Type manualmente para FormData
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("supplier");

  return buildApiResponseAsync<AddDocumentResponse>(res);
}
