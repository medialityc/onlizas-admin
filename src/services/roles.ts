"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";

import { RoleUpdateData } from "@/sections/roles/edit/role-update-schema";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import {
  CreateRoleRequest,
  CreateRoleResponse,
  DeleteRoleResponse,
  GetAllRolesResponse,
  UpdateRoleResponse,
} from "@/types/roles";
import { revalidateTag } from "next/cache";
import { nextAuthFetch } from "./utils/next-auth-fetch";

export async function getAllRoles(
  params: IQueryable
): Promise<ApiResponse<GetAllRolesResponse>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.roles.getAll
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["roles"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllRolesResponse>(res);
}

export async function createRole(
  data: CreateRoleRequest
): Promise<ApiResponse<CreateRoleResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.roles.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("roles");
  return buildApiResponseAsync<CreateRoleResponse>(res);
}

export async function deleteRole(
  id: number
): Promise<ApiResponse<DeleteRoleResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.roles.delete(id),
    method: "DELETE",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("roles");
  return buildApiResponseAsync<DeleteRoleResponse>(res);
}

export async function updateRole(
  id: number,
  data: RoleUpdateData
): Promise<ApiResponse<UpdateRoleResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.roles.update(id),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("roles");
  return buildApiResponseAsync<UpdateRoleResponse>(res);
}

// export async function getRoleById(id: number): Promise<ApiResponse<IRole>> {
//   const res = await nextAuthFetch({
//     url: backendRoutes.roles.getById(id),
//     method: "GET",
//     useAuth: true,
//   });

//   if (!res.ok) return handleApiServerError(res);
//   return buildApiResponseAsync<IRole>(res);
// }

// export async function updateRoleAttributes(
//   id: number,
//   data: UpdateRoleAttributesRequest
// ): Promise<ApiResponse<UpdateRoleAttributesResponse>> {
//   const res = await nextAuthFetch({
//     url: backendRoutes.roles.updateAttributes(id),
//     method: "PATCH",
//     data,
//     useAuth: true,
//   });

//   if (!res.ok) return handleApiServerError(res);
//   return buildApiResponseAsync<UpdateRoleAttributesResponse>(res);
// }

// export async function getRoleAttributeHistory(
//   id: number
// ): Promise<ApiResponse<RoleAttributeLogResponse[]>> {
//   const res = await nextAuthFetch({
//     url: backendRoutes.roles.getAttributeHistory(id),
//     method: "GET",
//     useAuth: true,
//   });

//   if (!res.ok) return handleApiServerError(res);
//   return buildApiResponseAsync<RoleAttributeLogResponse[]>(res);
// }

// export async function toggleBlockRole(data: { roleId: number }): Promise<
//   ApiResponse<{
//     id: 0;
//     isBlocked: true;
//   }>
// > {
//   const res = await nextAuthFetch({
//     url: backendRoutes.roles.blockToggle,
//     method: "POST",
//     data,
//     useAuth: true,
//   });

//   if (!res.ok) return handleApiServerError(res);
//   return buildApiResponseAsync<{
//     id: 0;
//     isBlocked: true;
//   }>(res);
// }

// // export async function getRoleDocuments(
// //   id: number
// // ): Promise<ApiResponse<RoleDocumentResponse[]>> {
// //   const res = await nextAuthFetch({
// //     url: backendRoutes.roles.getDocuments(id),
// //     method: "GET",
// //     useAuth: true,
// //   });

// //   if (!res.ok) return handleApiServerError(res);
// //   return buildApiResponseAsync<RoleDocumentResponse>(res);
// // }

// // export async function uploadRoleDocument(
// //   roleId: number,
// //   data: UploadRoleDocumentRequest
// // ): Promise<ApiResponse<UploadRoleDocumentResponse>> {
// //   const formData = new FormData();
// //   formData.append("name", data.name);
// //   if (data.description) formData.append("description", data.description);
// //   formData.append("file", data.file);
// //   const res = await nextAuthFetch({
// //     url: backendRoutes.roles.uploadDocument(roleId),
// //     method: "POST",
// //     data: formData,
// //     useAuth: true,
// //   });

// //   if (!res.ok) return handleApiServerError(res);
// //   return buildApiResponseAsync<UploadRoleDocumentResponse>(res);
// // }

// // export async function downloadRoleDocument(
// //   roleId: number,
// //   documentId: number
// // ): Promise<ApiResponse<DownloadDocumentResponse>> {
// //   const res = await nextAuthFetch({
// //     url: backendRoutes.roles.downloadDocument(roleId, documentId),
// //     method: "GET",
// //     useAuth: true,
// //   });

// //   if (!res.ok) return handleApiServerError(res);
// //   return buildApiResponseAsync<DownloadDocumentResponse>(res);
// // }
