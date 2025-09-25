"use server";

import { unauthorized } from "next/navigation";
import { getServerSession } from "zas-sso-client";

/**
 * Parámetros para la función `nextAuthFetch`.
 */
interface FetchWithAuthParams<T = unknown>
  extends Omit<RequestInit, "headers" | "body"> {
  /**
   * URL a la que se enviará la solicitud.
   */
  url: string;

  /**
   * Cuerpo de la solicitud. Puede ser un objeto serializable o `FormData`.
   */
  data?: BodyInit | T;

  /**
   * Headers personalizados a incluir en la solicitud.
   */
  headers?: Record<string, string>;

  /**
   * Si se debe usar autenticación mediante token. Por defecto es `true`.
   */
  useAuth?: boolean;

  /**
   * Token de acceso personalizado. Si no se proporciona, se intentará obtener automáticamente.
   */
  token?: string;

  /**
   * Tipo de contenido para el encabezado `Content-Type`. Por defecto es `application/json`.
   * Si se pasa `false`, no se establecerá ningún `Content-Type`.
   */
  contentType?: string;
}

/**
 * Realiza una solicitud `fetch` con soporte opcional para autenticación
 *
 * Esta función maneja automáticamente:
 * - El encabezado `Authorization` con un token de sesión si `useAuth` está activado.
 * - Serialización JSON o `FormData` como cuerpo de la solicitud.
 * - Inclusión opcional de encabezados personalizados.
 *
 * @param {FetchWithAuthParams} params - Parámetros para construir la solicitud.
 * @returns {Promise<Response>} - Respuesta de la solicitud `fetch`.
 *
 * @throws {Error} - Lanza error si `useAuth` es `true` pero no se puede obtener un token.
 *
 * @example
 * ```ts
 * const response = await nextAuthFetch({
 *   url: "/api/endpoint",
 *   method: "POST",
 *   data: { name: "John" },
 * });
 * const result = await response.json();
 * ```
 */

interface FetchWithAuthParams<T> extends Omit<RequestInit, "headers" | "body"> {
  url: string;
  data?: BodyInit | T;
  headers?: Record<string, string>;
  useAuth?: boolean;
  token?: string;
  contentType?: string; // e.g. "application/xml"; omit para JSON, false para dejar vacío
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
  // --- Obtener token si es necesario ---
  const accessToken =
    token ??
    (useAuth ? (await getServerSession())?.tokens?.accessToken : undefined);
  if (useAuth && !accessToken) {
    console.error(`No se ha proporcionado token de acceso para ${url}`);
  }

  // --- Construir los headers ---
  const hdrs = new Headers(headers);

  if (useAuth && accessToken) {
    hdrs.set("Authorization", `Bearer ${accessToken}`);
  }

  const isFormData = data instanceof FormData;
  if (isFormData) {
    // No fijamos Content-Type manualmente para FormData (el navegador añade boundary)
    contentType = "multipart/form-data";
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

  // --- Preparar body ---
  let body: BodyInit | undefined;
  if (method.toUpperCase() !== "GET" && data != null) {
    body = isFormData
      ? data
      : typeof data === "object" && contentType === "application/json"
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
  // --- Ejecutar fetch ---
  return res;
}
