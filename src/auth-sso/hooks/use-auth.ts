"use client";

import { RootState } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSession,
  setError,
  setLoading,
  setSession,
} from "../store/auth-slice";
import { clearSession as serverCleanSession } from "../services/server-actions";

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.authSlice);
  const dispatch = useDispatch();

  const loadSession = async () => {
    dispatch(setLoading(true));
    try {
      const res = await fetch(`/api/session`, {
        cache: "no-store",
      });
      const session = await res.json();

      if (session?.tokens) {
        dispatch(setSession(session));
      } else {
        dispatch(clearSession());
        dispatch(setError("Failed to load session"));
      }
    } catch (err) {
      console.error(err);
      dispatch(setError("Failed to load session"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  //   const handleRefresh = async () => {
  //     dispatch(setLoading(true));
  //     try {
  //       const { user, tokens } = await refreshTokens();
  //       dispatch(setSession({ user, tokens }));
  //     } catch (err) {
  //         console.error(err)
  //       dispatch(clearSession());
  //       dispatch(setError("Session expired, please login again"));
  //     } finally {
  //       dispatch(setLoading(false));
  //     }
  //   };

  const handleClearSession = async () => {
    dispatch(setLoading(true));
    try {
      const res = await serverCleanSession();
      console.log('clear session',res)
      dispatch(clearSession());
    } catch (err) {
      console.error(err);
      dispatch(setError("Failed to clear session"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  //   // Verificar expiración del token
  //     useEffect(() => {
  //       console.log("se renderiza AuthGuard");
  //       if (!auth.tokens?.accessToken) return;

  //       const tokenClaims = getJWTClaims(auth.tokens.accessToken);

  //       if (!tokenClaims?.exp) {
  //         console.log("No exp in token claims");
  //         return;
  //       }

  //       const now = Math.floor(Date.now() / 1000);
  //       const refreshThreshold = 30; // segundos antes de que expire
  //       const expiresIn = tokenClaims.exp - now;
  //       const refreshInMs = Math.max((expiresIn - refreshThreshold) * 1000, 0);

  //       console.log(`Scheduling token refresh in ${refreshInMs / 1000}s`);

  //       const timeoutId = setTimeout(async () => {
  //         console.log(
  //           "AccessToken expired (or near expiration), attempting refresh"
  //         );
  //         try {

  //           if (expiration - now < 300000) {
  //             // 5 minutos antes de expirar
  //             await handleRefresh();
  //           }
  //         } catch (err) {
  //           console.error(err);
  //           dispatch(setError("Invalid token"));
  //         }
  //       }, refreshInMs);

  //       return () => clearTimeout(timeoutId); // limpiar cuando cambie el session
  //       // eslint-disable-next-line react-hooks/exhaustive-deps

  //     }, [auth.tokens]);

  // Cargar sesión al montar
  useEffect(() => {
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...auth,
    // refreshSession: handleRefresh,
    clearSession: handleClearSession,
  };
};
