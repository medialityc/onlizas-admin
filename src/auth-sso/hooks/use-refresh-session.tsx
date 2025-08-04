"use client";
import { useEffect, useState } from "react";
import { getJWTClaims } from "../utils/decode";
import { refreshTokens } from "../services/server-actions";
import { useAuth } from "./use-auth";

export default function useRefreshSession() {
  const [error, setError] = useState<boolean>(false);
  const session = useAuth();

  useEffect(() => {
    console.log("se renderiza AuthGuard");
    setError(false)
    if (!session?.tokens?.accessToken || !session?.tokens?.refreshToken) {
      console.log("No accessToken or refreshToken present");
      return;
    }

    const { accessToken } = session.tokens;
    const tokenClaims = getJWTClaims(accessToken);

    if (!tokenClaims?.exp) {
      console.log("No exp in token claims");
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const refreshThreshold = 30; // segundos antes de que expire
    const expiresIn = tokenClaims.exp - now;
    const refreshInMs = Math.max((expiresIn - refreshThreshold) * 1000, 0);

    console.log(`Scheduling token refresh in ${refreshInMs / 1000}s`);

    const timeoutId = setTimeout(async () => {
      console.log(
        "AccessToken expired (or near expiration), attempting refresh"
      );
      const response = await refreshTokens();
      if (response?.message) {
        console.error("Error refreshing tokens:", response);
        setError(true);
      } else {
        console.log("Tokens refreshed successfully:", response);
      }
    }, refreshInMs);

    return () => clearTimeout(timeoutId); // limpiar cuando cambie el session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.tokens]);

  return { session, error };
}
