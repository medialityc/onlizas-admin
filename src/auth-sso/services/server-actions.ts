"use server";

import { cookies as cookiesFn } from "next/headers";
import { SessionData, Tokens, User } from "../types";
import { COOKIE_SESSION_NAME, ENDPOINTS, MAX_COOKIES_AGE } from "../lib/config";
import { ApiResponse } from "@/types/fetch/api";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { decrypt, encrypt } from "../lib/crypto";

// Tipos

// Almacenar sesión
export const storeSession = async (
  session: SessionData,
  callbacks?: { onSuccess?: () => void; onError?: (error: unknown) => void }
) => {

  try {
    const data: SessionData = {
      tokens: {
        ...(session.tokens as Tokens),
        ...(session.tokens as Tokens),       
      },
      user: {
        emails: session.user?.emails as User["emails"],
        name: session.user?.name as User["name"],
        phones: session.user?.phones as User["phones"],
        photoUrl: session.user?.photoUrl as User["photoUrl"],
      },
    };
    const cookies = await cookiesFn();
    const encryptedData = encrypt(JSON.stringify(data));

    cookies.set(COOKIE_SESSION_NAME, encryptedData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_COOKIES_AGE,
    });
    callbacks?.onSuccess?.();
  } catch (error) {
    callbacks?.onError?.(error);
    throw error;
  }
};

// Obtener sesión

// Eliminar sesión
export const clearSession = async (callbacks?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const cookies = await cookiesFn();
  try {
    cookies.delete(COOKIE_SESSION_NAME);
    callbacks?.onSuccess?.();
  } catch (error) {
    callbacks?.onError?.(error);
    throw error;
  }
};

// Autenticar con credenciales
export const authenticateWithTokens = async (
  credentials: Tokens,
  callbacks?: { onSuccess?: () => void; onError?: (error: unknown) => void }
): Promise<ApiResponse<User | null>> => {
  try {
    const userResponse = await fetchUser(credentials.accessToken);
    if (!userResponse.data) return userResponse;

    await storeSession({ user: userResponse.data, tokens: credentials });
    callbacks?.onSuccess?.();
    console.log("User authenticated successfully:", userResponse);
    return {
      data: userResponse.data,
      status: userResponse.status,
      error: false,
    };
  } catch (error) {
    console.error("Error authenticating with credentials:", error);
    callbacks?.onError?.(error);
    return { data: null, status: 500, error: true };
  }
};

// Refrescar token
export const refreshTokens = async (callbacks?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  try {
    const session = await getSession();
    if (!session?.tokens?.refreshToken) throw new Error("No session");

    const response = await fetch(ENDPOINTS.refresh, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.tokens.refreshToken }),
    });

    if (!response.ok) return handleApiServerError(response);

    const tokens: Tokens = await response.json();
    let user = session.user;
    if (!user && tokens.accessToken) {
      const userResponse = await fetchUser(tokens.accessToken);
      if (!userResponse.data) return handleApiServerError(response);
      user = userResponse.data;
    }
    if (!user) return handleApiServerError(response);
    await storeSession({ user, tokens });
    callbacks?.onSuccess?.();
  } catch (error) {
    await clearSession();
    callbacks?.onError?.(error);
    console.error("Error refreshing tokens:", error);
  }
};

// Obtener información de usuario
const fetchUser = async (accessToken: string): Promise<ApiResponse<User>> => {
  const response = await fetch(ENDPOINTS.me, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return handleApiServerError(response);
  return buildApiResponseAsync<User>(response);
};

export const getSession = async () => {
  const cookies = await cookiesFn();
  const encryptedSession = cookies.get(COOKIE_SESSION_NAME)?.value;

  if (!encryptedSession) {
    return { user: null, tokens: null, shouldClear: false };
  }

  try {
    const decryptedData = decrypt(encryptedSession);
    const sessionData = JSON.parse(decryptedData) as SessionData;
    if (!sessionData || !sessionData.tokens) {
      return { user: null, tokens: null, shouldClear: true };
    }
    return JSON.parse(decryptedData) as SessionData;
  } catch {
    return { user: null, tokens: null, shouldClear: true };
  }
};
