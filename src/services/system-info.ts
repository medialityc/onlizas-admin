"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { ApiResponse } from "@/types/fetch/api";
import {
  Address,
  CreateUpdateAddress,
  SocialNetwork,
  CreateUpdateSocialNetwork,
  SystemNumber,
  CreateUpdateSystemNumber,
  SystemEmail,
  CreateUpdateSystemEmail,
} from "@/types/system-info";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTagFn } from "./revalidate";

// Addresses
export async function listAddresses(): Promise<ApiResponse<Address[]>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.addresses.list,
    method: "GET",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Address[]>(res);
}

export async function createAddress(
  data: CreateUpdateAddress
): Promise<ApiResponse<Address>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.addresses.create,
    method: "POST",
    useAuth: true,
    data,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTagFn("system-info-addresses");
  return buildApiResponseAsync<Address>(res);
}

export async function updateAddress(
  id: string,
  data: CreateUpdateAddress
): Promise<ApiResponse<Address>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.addresses.update(id),
    method: "PUT",
    useAuth: true,
    data,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTagFn("system-info-addresses");
  return buildApiResponseAsync<Address>(res);
}

export async function deleteAddress(id: string): Promise<ApiResponse<null>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.addresses.delete(id),
    method: "DELETE",
    useAuth: true,
  });
  if (res.status === 204)
    return { data: null, error: false, status: 204 } as any;
  if (!res.ok) return handleApiServerError(res);
  revalidateTagFn("system-info-addresses");
  return buildApiResponseAsync<null>(res);
}

// Social Networks
export async function listSocialNetworks(): Promise<
  ApiResponse<SocialNetwork[]>
> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.socialNetworks.list,
    method: "GET",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<SocialNetwork[]>(res);
}
export async function createSocialNetwork(
  data: CreateUpdateSocialNetwork
): Promise<ApiResponse<SocialNetwork>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.socialNetworks.create,
    method: "POST",
    useAuth: true,
    data,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTagFn("system-info-social-networks");
  return buildApiResponseAsync<SocialNetwork>(res);
}
export async function updateSocialNetwork(
  id: string,
  data: CreateUpdateSocialNetwork
): Promise<ApiResponse<SocialNetwork>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.socialNetworks.update(id),
    method: "PUT",
    useAuth: true,
    data,
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<SocialNetwork>(res);
}
export async function deleteSocialNetwork(
  id: string
): Promise<ApiResponse<null>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.socialNetworks.delete(id),
    method: "DELETE",
    useAuth: true,
  });
  if (res.status === 204)
    return { data: null, error: false, status: 204 } as any;
  if (!res.ok) return handleApiServerError(res);
  revalidateTagFn("system-info-social-networks");
  return buildApiResponseAsync<null>(res);
}

// Numbers
export async function listNumbers(): Promise<ApiResponse<SystemNumber[]>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.numbers.list,
    method: "GET",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<SystemNumber[]>(res);
}
export async function createNumber(
  data: CreateUpdateSystemNumber
): Promise<ApiResponse<SystemNumber>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.numbers.create,
    method: "POST",
    useAuth: true,
    data,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTagFn("system-info-numbers");
  return buildApiResponseAsync<SystemNumber>(res);
}
export async function updateNumber(
  id: string,
  data: CreateUpdateSystemNumber
): Promise<ApiResponse<SystemNumber>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.numbers.update(id),
    method: "PUT",
    useAuth: true,
    data,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTagFn("system-info-numbers");
  return buildApiResponseAsync<SystemNumber>(res);
}
export async function deleteNumber(id: string): Promise<ApiResponse<null>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.numbers.delete(id),
    method: "DELETE",
    useAuth: true,
  });
  if (res.status === 204)
    return { data: null, error: false, status: 204 } as any;
  if (!res.ok) return handleApiServerError(res);
  revalidateTagFn("system-info-numbers");
  return buildApiResponseAsync<null>(res);
}

// Emails
export async function listEmails(): Promise<ApiResponse<SystemEmail[]>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.emails.list,
    method: "GET",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<SystemEmail[]>(res);
}
export async function createEmail(
  data: CreateUpdateSystemEmail
): Promise<ApiResponse<SystemEmail>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.emails.create,
    method: "POST",
    useAuth: true,
    data,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTagFn("system-info-emails");
  return buildApiResponseAsync<SystemEmail>(res);
}
export async function updateEmail(
  id: string,
  data: CreateUpdateSystemEmail
): Promise<ApiResponse<SystemEmail>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.emails.update(id),
    method: "PUT",
    useAuth: true,
    data,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTagFn("system-info-emails");
  return buildApiResponseAsync<SystemEmail>(res);
}
export async function deleteEmail(id: string): Promise<ApiResponse<null>> {
  const res = await nextAuthFetch({
    url: backendRoutes.systemInfo.emails.delete(id),
    method: "DELETE",
    useAuth: true,
  });
  if (res.status === 204)
    return { data: null, error: false, status: 204 } as any;
  if (!res.ok) return handleApiServerError(res);
  revalidateTagFn("system-info-emails");
  return buildApiResponseAsync<null>(res);
}
