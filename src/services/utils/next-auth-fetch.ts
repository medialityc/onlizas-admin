"use server";

import { unauthorized } from "next/navigation";
import { getServerSession } from "zas-sso-client";

interface FetchWithAuthParams<T = unknown>
  extends Omit<RequestInit, "headers" | "body"> {
  url: string;
  data?: BodyInit | T;
  headers?: Record<string, string>;
  useAuth?: boolean;
  token?: string;
  contentType?: string | false;
}

export async function nextAuthFetch<T>({
  url,
  method = "GET",
  data,
  headers = {},
  useAuth = true,
  token,
  contentType = "application/json",
  ...rest
}: FetchWithAuthParams<T>): Promise<Response> {
  const accessToken =
    token ?? (useAuth ? (await getServerSession())?.tokens?.accessToken : undefined);

  if (useAuth && !accessToken) {
    console.error(`No se ha proporcionado token de acceso para ${url}`);
  }

  const hdrs = new Headers(headers);

  if (useAuth && accessToken) {
    hdrs.set("Authorization", `Bearer ${accessToken}`);
  }

  const isFormData = data instanceof FormData;

  // ❗ NO PONER multipart/form-data MANUALMENTE
  if (isFormData) {
    contentType = false;
  }

  const upperMethod = method.toUpperCase();

  if (
    !isFormData &&
    contentType &&
    upperMethod !== "GET" &&
    upperMethod !== "HEAD"
  ) {
    hdrs.set("Content-Type", contentType);
  }

  let body: BodyInit | undefined;
  if (upperMethod !== "GET" && data != null) {
    body =
      isFormData
        ? data
        : contentType === "application/json" && typeof data === "object"
          ? JSON.stringify(data)
          : (data as BodyInit);
  }

  console.log(url, {
    method,
    headers: hdrs,
    body,
    ...rest,
  });

  const res = await fetch(url, {
    method,
    headers: hdrs,
    body,
    ...rest,
  });

  if (res.status === 401) {
    unauthorized();
  }

  return res;
}

