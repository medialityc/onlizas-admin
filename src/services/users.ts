"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";

import { CreateUserSchema } from "@/sections/users/create/create-user-schema";
import {
  UpdateUserAttributesRequest,
  UserUpdateData,
} from "@/sections/users/edit/components/user-schema";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import {
  GetAllUsersResponse,
  IDocument,
  IUser,
  OrderUser,
  PotentialOrderUser,
  UpdateUserAttributesResponse,
  UpdateUserResponse,
  UserAttributeLogResponse,
} from "@/types/users";
import { revalidateTag } from "next/cache";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { PaginatedResponse } from "@/types/common";

// - [ ] GET ALL USERS
export async function getAllUsers(
  params: IQueryable
): Promise<ApiResponse<GetAllUsersResponse>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.users.getAll
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["users"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllUsersResponse>(res);
}

// - [ ] UPDATE USER
export async function updateUser(
  id: string | number,
  data: UserUpdateData
): Promise<ApiResponse<UpdateUserResponse>> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "photo" && value instanceof File) {
        formData.append(key, value);
      } else if (typeof value !== "object") {
        formData.append(key, value.toString());
      } else {
        formData.append(key, JSON.stringify(value));
      }
    }
  });

  const res = await nextAuthFetch({
    url: backendRoutes.users.update(id),
    method: "PATCH",
    data: formData,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<UpdateUserResponse>(res);
}

// - [ ] CREATE USER
export async function createUser(
  data: CreateUserSchema
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.users.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("users");
  return buildApiResponseAsync<ApiStatusResponse>(res);
}
export async function resendEmail(data: {
  email: string;
}): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.users.resendEmail,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<ApiStatusResponse>(res);
}
export async function resendPhone(data: {
  phoneNumber: string;
  countryId: number;
}): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.users.resendPhone,
    method: "POST",
    data,
    useAuth: true,
  });
  console.log("RESEND-PHONE-VERIFICATION", res);

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<ApiStatusResponse>(res);
}

// - [ ] DELETE USER
export async function deactivateUser(
  id: number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.users.delete(id),
    method: "DELETE",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<ApiStatusResponse>(res);
}

// - [ ] GET USER BY ID
export async function getUserById(id: number): Promise<ApiResponse<IUser>> {
  const res = await nextAuthFetch({
    url: backendRoutes.users.getById(id),
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<IUser>(res);
}

// - [ ] GET USER PROVIDER BY ID
export async function getUserProviderById(
  id: number
): Promise<ApiResponse<IUser>> {
  const res = await nextAuthFetch({
    url: backendRoutes.users.getById(id),
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<IUser>(res);
}

// - [ ] UPDATE USER ATTRIBUTES
export async function updateUserAttributes(
  id: number,
  data: UpdateUserAttributesRequest
): Promise<ApiResponse<UpdateUserAttributesResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.users.updateAttributes(id),
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<UpdateUserAttributesResponse>(res);
}
export async function activateUser(
  id: number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.users.activateUser(id),
    method: "PATCH",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<ApiStatusResponse>(res);
}

// - [ ] GET USER ATTRIBUTE HISTORY
export async function getUserAttributeHistory(
  id: number
): Promise<ApiResponse<UserAttributeLogResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.users.getAttributeHistory(id),
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<UserAttributeLogResponse>(res);
}

// - [ ] GET USER DOCUMENT
export async function getUserDocumentById(
  userId: number,
  documentId: number
): Promise<ApiResponse<IDocument>> {
  const res = await nextAuthFetch({
    url: backendRoutes.users.getDocumentsById(userId, documentId),
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<IDocument>(res);
}
// - [ ] GET USER DOCUMENTS
export async function getUserDocuments(
  id: number
): Promise<ApiResponse<IDocument[]>> {
  const res = await nextAuthFetch({
    url: backendRoutes.users.getDocuments(id),
    method: "GET",
    useAuth: true,
    next: { tags: [`user-documents-${id}`] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<IDocument[]>(res);
}

// - [ ] UPLOAD USER DOCUMENT
export async function uploadOrUpdateUserDocument(data: {
  name: string;
  description?: string;
  file: File;
  documentId?: number;
  userId: number;
}): Promise<ApiResponse<any>> {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  formData.append("file", data.file);
  if (data.documentId)
    formData.append("documentId", data.documentId.toString());

  const res = await nextAuthFetch({
    url: backendRoutes.users.uploadDocument(data.userId),
    method: "POST",
    data: formData,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<any>(res);
}

// - [ ] DOWNLOAD USER DOCUMENT
export async function downloadUserDocument(
  userId: number,
  documentId: number
): Promise<ApiResponse<any>> {
  const res = await nextAuthFetch({
    url: backendRoutes.users.downloadDocument(userId, documentId),
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<any>(res);
}

// - [ ] BLOCK/UNBLOCK USER
export async function toggleBlockUser(data: { userId: number }): Promise<
  ApiResponse<{
    id: 0;
    isBlocked: true;
  }>
> {
  const res = await nextAuthFetch({
    url: backendRoutes.users.blockToggle,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<{
    id: 0;
    isBlocked: true;
  }>(res);
}

// - [ ] GET CURRENT USER (ME)
export async function fetchUserMe(token?: string): Promise<ApiResponse<IUser>> {
  const res = await nextAuthFetch({
    url: backendRoutes.users.me,
    method: "GET",
    useAuth: true,
    token,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<IUser>(res);
}

/**
 * Busca usuarios según los parámetros especificados.
 *
 * @param params - Parámetros de consulta para la búsqueda de usuarios.
 *   - `q` (string): Texto de búsqueda. Se usa para buscar por nombre, teléfono o email. Ejemplo: q=juan
 *   - `foreign` (boolean): Si es true, busca usuarios cuya dirección esté fuera de Cuba (CU). Si es false, solo usuarios con dirección en Cuba. Ejemplo: foreign=true
 *   - `count` (number): Número máximo de usuarios a devolver. Por defecto es 10. Ejemplo: count=5
 *   - `recipientId` (number, opcional): ID de un usuario destinatario. Si se incluye, ordena los resultados priorizando los beneficiarios de ese usuario. Ejemplo: recipientId=12
 * @returns Una promesa que resuelve a un arreglo de usuarios (`IUser[]`) que cumplen con los criterios de búsqueda.
 */
export async function searchUsers(
  params: IQueryable
): Promise<ApiResponse<PaginatedResponse<OrderUser>>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.users.search
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["users"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<PaginatedResponse<OrderUser>>(res);
}

export async function scanUser(
  params: IQueryable
): Promise<ApiResponse<PotentialOrderUser>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.users.scan
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<PotentialOrderUser>(res);
}

export async function getAllSupplierUsers(
  params: IQueryable
): Promise<ApiResponse<GetAllUsersResponse>> {
  const url = new QueryParamsURLFactory(
    { ...params, role: "ONL_SUPPLIER" },
    backendRoutes.users.listSuppliers
  ).build();
  console.log(url);

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["users-supplier"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllUsersResponse>(res);
}
