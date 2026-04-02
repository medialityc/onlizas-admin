'use server';

import { getServerSession, getServerValidToken } from 'zas-sso-client';
import { forbidden, unauthorized } from 'next/navigation';
import { cache } from 'react';

/**
 * Parámetros para la función `nextAuthFetch`.
 */
interface FetchWithAuthParams<T = unknown> extends Omit<
  RequestInit,
  'headers' | 'body'
> {
  url: string;
  data?: BodyInit | T;
  headers?: Record<string, string>;
  useAuth?: boolean;
  token?: string;
  contentType?: string;
}

const FgCyan = '\x1b[36m';
const FgYellow = '\x1b[33m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgBlue = '\x1b[34m';
const FgOrange = '\x1b[38;5;208m';
const FgGray = '\x1b[90m';
const Reset = '\x1b[0m';

// Cambia este flag a false para desactivar todos los logs de nextAuthFetch
const ENABLE_NEXT_AUTH_FETCH_LOGS = true;

export async function nextAuthFetch<T>(
  params: FetchWithAuthParams<T>,
): Promise<Response> {
  const {
    url,
    method = 'GET',
    data,
    headers = {},
    useAuth = true,
    token,
    contentType = 'application/json',
    ...rest
  } = params;

  // 1. Obtener sesión y token inicial
  const session = useAuth ? await getMemoizedSession() : null;
  let accessToken = token ?? session?.tokens?.accessToken;

  if (useAuth && !accessToken) {
    if (ENABLE_NEXT_AUTH_FETCH_LOGS) {
      console.error(`No se ha proporcionado token de acceso para ${url}`);
    }
  }

  // --- Helper interno para ejecutar el fetch y no repetir lógica de headers/body ---
  const executeRequest = async (currentSafeToken?: string) => {
    const hdrs = new Headers(headers);
    if (useAuth && currentSafeToken) {
      hdrs.set('Authorization', `Bearer ${currentSafeToken}`);
    }

    const isFormData = data instanceof FormData;
    if (isFormData) {
      // No establecemos Content-Type, fetch lo hace solo para FormData
    } else if (
      contentType &&
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())
    ) {
      hdrs.set('Content-Type', contentType);
    }

    let body: BodyInit | undefined;
    if (method.toUpperCase() !== 'GET' && data != null) {
      body = isFormData
        ? (data as FormData)
        : typeof data === 'object' && contentType === 'application/json'
          ? JSON.stringify(data)
          : (data as BodyInit);
    }

    // Log del request en formato curl estándar (incluyendo headers y body)
    if (ENABLE_NEXT_AUTH_FETCH_LOGS) {
      try {
        const curlLines: string[] = [];
        curlLines.push(`'${method.toUpperCase()}' \\`);
        curlLines.push(`  '${FgBlue}${url}${Reset}' \\`);

        hdrs.forEach((value, key) => {
          curlLines.push(`  ${FgYellow}-H '${key}: ${value}'${Reset} \\`);
        });

        if (body) {
          // Representar correctamente el body según su tipo
          if (isFormData && data instanceof FormData) {
            // Para FormData, usar -F por cada campo
            for (const [key, value] of Array.from(data.entries())) {
              if (value instanceof File) {
                const fileDesc = `@${value.name};type=${value.type || 'application/octet-stream'}`;
                curlLines.push(
                  `  ${FgOrange}-F '${key}=${fileDesc}'${Reset} \\\
`,
                );
              } else {
                curlLines.push(
                  `  ${FgOrange}-F '${key}=${String(value)}'${Reset} \\\
`,
                );
              }
            }
          } else {
            // Para JSON u otros cuerpos textuales, usar -d
            const bodyStr =
              typeof body === 'string' ? body : JSON.stringify(body);
            curlLines.push(
              `  ${FgOrange}-d '${bodyStr}'${Reset} \\\
`,
            );
          }
        }

        // Quitar la barra invertida de la última línea
        if (curlLines.length > 0) {
          curlLines[curlLines.length - 1] = curlLines[
            curlLines.length - 1
          ].replace(/ \\\\$/, '');
        }

        console.log(`${FgGreen}curl -X :${Reset}${curlLines.join('\n')}`);
      } catch (err) {
        console.error('Error generando curl para nextAuthFetch:', err);
      }
    }

    return await fetch(url, {
      ...rest,
      method,
      headers: hdrs,
      body,
      cache: rest.cache,
    });
  };

  // --- PRIMER INTENTO ---
  let res = await executeRequest(accessToken);

  // --- LÓGICA DE SEMÁFORO ---
  if (res.status === 401 && useAuth) {
    if (ENABLE_NEXT_AUTH_FETCH_LOGS) {
      console.warn(
        `401 detectado en ${url}. Intentando validación/refresco de token...`,
      );
    }

    // El coordinador se encarga de que si hay 20 peticiones, solo una refresque
    const newToken = await getServerValidToken(session?.tokens?.refreshToken);

    if (newToken) {
      if (ENABLE_NEXT_AUTH_FETCH_LOGS) {
        console.log(`Reintentando petición a ${url} con nuevo token.`);
      }
      res = await executeRequest(newToken);
    } else {
      // Si el coordinador no pudo obtener un token nuevo, sesión expirada
      unauthorized();
    }
  }

  // Verificación final tras el reintento
  if (res.status === 401) {
    unauthorized();
  }
  if (res.status === 403) {
    forbidden();
  }

  // Log de respuesta en caso de error (status no OK)
  if (!res.ok) {
    try {
      const cloned = res.clone();
      const text = await cloned.text();
      if (ENABLE_NEXT_AUTH_FETCH_LOGS) {
        console.error(
          `${FgRed}nextAuthFetch ERROR - ${method.toUpperCase()} ${url} - Status: ${res.status} - Body: ${text}${Reset}`,
        );
      }
    } catch (err) {
      if (ENABLE_NEXT_AUTH_FETCH_LOGS) {
        console.error('Error leyendo respuesta de nextAuthFetch:', err);
      }
    }
  }

  if (ENABLE_NEXT_AUTH_FETCH_LOGS) {
    console.log(
      `${FgGray}[nextAuthFetch] Puedes desactivar estos logs cambiando la constante ENABLE_NEXT_AUTH_FETCH_LOGS a false en este archivo.${Reset}`,
    );
  }

  return res;
}

export const getMemoizedSession = cache(async () => {
  return await getServerSession();
});
