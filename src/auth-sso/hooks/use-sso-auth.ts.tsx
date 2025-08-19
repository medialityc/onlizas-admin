"use client";
import { paths } from "@/config/paths";
import crypto from "crypto";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { authenticateWithTokens } from "../services/server-actions";
import { useAuth } from "./use-auth";
import { useDispatch } from "react-redux";
import { setLoading } from "../store/auth-slice";

export function useSSOAuth({ clientId }: { clientId: string }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const session = useAuth();
  const popupRef = useRef<Window | null>(null);
  const handlerRef = useRef<(e: MessageEvent) => void>();
  const ssoStartedRef = useRef(false);
  const popupCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const status = useMemo(() => {
    return isLoading
      ? "loading"
      : session.tokens?.accessToken
        ? "authenticated"
        : "unauthenticated";
  }, [isLoading, session.tokens?.accessToken]);
  // 1. Generar URL de SSO de forma segura
  const getSSOUrl = useCallback(
    (state: string): string => {
      console.log("[getSSOUrl] INICIO");
      console.log("[getSSOUrl] clientId:", clientId);
      console.log("[getSSOUrl] state:", state);
      const url = new URL(`${process.env.NEXT_PUBLIC_SSO_URL}/login`);
      url.searchParams.set("client", clientId);
      url.searchParams.set("state", state);
      url.searchParams.set(
        "redirect_uri",
        process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      );
      console.log("[getSSOUrl] URL generada:", url.toString());
      return url.toString();
    },
    [clientId]
  );

  // 2. Manejo seguro de apertura de popup
  const openLogin = useCallback((url: string) => {
    const popupWidth = 500;
    const popupHeight = 1000;
    const left = window.screenX + (window.innerWidth - popupWidth) / 2;
    const top = window.screenY + (window.innerHeight - popupHeight) / 2;

    console.log("[openLogin] INICIO");
    console.log("[openLogin] URL:", url);

    const features = `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`;

    const popup = window.open(url, "SSO_Login", features);

    if (!popup) {
      console.warn(
        "[openLogin] Popup bloqueado, redirigiendo en la misma ventana"
      );
      window.location.href = url;
    } else {
      console.log("[openLogin] Popup abierto correctamente");
    }
    return popup;
  }, []);

  // 3. Validación de origen y estado
  const validateOrigin = useCallback((origin: string): boolean => {
    const valid = origin === new URL(process.env.NEXT_PUBLIC_SSO_URL!).origin;
    console.log(
      `[validateOrigin] Origen recibido: ${origin}, válido: ${valid}`
    );
    return valid;
  }, []);

  const validateState = useCallback((state: string): boolean => {
    const expected = sessionStorage.getItem("sso_state");
    const valid = state === expected;
    console.log(
      `[validateState] State recibido: ${state}, esperado: ${expected}, válido: ${valid}`
    );
    return valid;
  }, []);

  // 4. Inicio de sesión con tokens
  const handleSignIn = useCallback(
    async (accessToken: string, refreshToken: string) => {
      console.log("[handleSignIn] INICIO");
      console.log("[handleSignIn] accessToken:", accessToken);
      console.log("[handleSignIn] refreshToken:", refreshToken);
      const res = await authenticateWithTokens({
        accessToken,
        refreshToken,
      });

      console.log("[handleSignIn] Resultado de signIn:", res);

      if (res?.error) {
        console.error("[handleSignIn] Error al iniciar sesión:", res.error);
        setError(res.message || "Error al iniciar sesión");
        return false;
      }
      console.log("[handleSignIn] Sesión iniciada correctamente");
      setIsSignedIn(true);
      return true;
    },
    []
  );

  // 5. Iniciar flujo SSO (controlado externamente)
  const startSSO = useCallback(() => {
    console.log("[startSSO] INICIO");
    if (ssoStartedRef.current) {
      console.log("[startSSO] SSO ya iniciado, saliendo");
      return;
    }
    ssoStartedRef.current = true; // Marcar SSO como iniciado
    setIsLoading(true);
    setError(null);
    setIsSignedIn(false);
    const state = crypto.randomBytes(16).toString("hex");
    sessionStorage.setItem("sso_state", state);
    console.log(
      "[startSSO] State generado y guardado en sessionStorage:",
      state
    );

    const url = getSSOUrl(state);
    popupRef.current = openLogin(url);

    // Handler para mensajes del popup
    const handler = async (e: MessageEvent) => {
      console.log("[startSSO:handler] INICIO");
      console.log("[startSSO:handler] Mensaje recibido:", e);
      if (e.data.type !== "SSO_TOKEN" || !validateOrigin(e.origin)) {
        console.warn(
          "[startSSO:handler] Tipo de mensaje inválido o origen no válido"
        );
        return;
      }

      const { accessToken, refreshToken, state: responseState } = e.data;
      console.log("[startSSO:handler] Datos recibidos:", {
        accessToken,
        refreshToken,
        responseState,
      });

      if (!validateState(responseState)) {
        console.error(
          "[startSSO:handler] State inválido recibido en el mensaje"
        );
        setError("Invalid state");
        return;
      }

      console.log(
        "[startSSO:handler] Tokens recibidos, intentando iniciar sesión"
      );
      const success = await handleSignIn(accessToken, refreshToken);
      console.log("[startSSO:handler] Resultado de handleSignIn:", success);
      if (success) {
        console.log(
          "[startSSO:handler] Login exitoso, cerrando popup y redirigiendo"
        );
        window.removeEventListener("message", handler);
        popupRef.current?.close();
        router.push(paths.dashboard.root);
      }
    };

    window.addEventListener("message", handler);
    handlerRef.current = handler;
    console.log("[startSSO] Listener de mensajes agregado");

    // Limpiar si el popup se cierra manualmente
    popupCheckIntervalRef.current = setInterval(() => {
      if (popupRef.current?.closed) {
        console.log(
          "[startSSO] Popup cerrado manualmente, limpiando listener e intervalo"
        );
        ssoStartedRef.current = false;
        if (handlerRef.current) {
          window.removeEventListener("message", handlerRef.current);
        }
        clearInterval(popupCheckIntervalRef.current!);       
        dispatch(setLoading(true));
      }
    }, 1000);
  }, [
    getSSOUrl,
    handleSignIn,
    openLogin,
    router,
    validateOrigin,
    validateState,
  ]);

  // 6. Efecto principal (manejo de redirección)
  useEffect(() => {
    console.log(
      `[${new Date().toLocaleTimeString()}] [FIX-AUTH]'sso auth first render'`,
      {
        error,
        startSSO,
        status,
        isLoading,
        isSignedIn,
      }
    );
    console.log("[useEffect] INICIO");
    console.log("[useEffect] Estado de autenticación:", status);
    if (ssoStartedRef.current) {
      console.log("[useEffect] SSO ya iniciado, saliendo");
      return;
    }
    // Redirigir si ya está autenticado
    if (status === "authenticated") {
      console.log("[useEffect] Usuario autenticado, redirigiendo al dashboard");
      setIsSignedIn(true);
      router.push(paths.dashboard.root);
      return;
    }

    // Manejar tokens en URL (solo si vienen del SSO)
    const state = params.get("state");
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    console.log("[useEffect] Parámetros en URL:", {
      state,
      accessToken,
      refreshToken,
    });

    if (state && accessToken && refreshToken) {
      console.log("[useEffect] Se detectaron tokens en la URL");
      if (!validateState(state)) {
        console.error("[useEffect] State inválido en la URL");
        setError("Invalid state parameter");
        return;
      }

      (async () => {
        console.log(
          "[useEffect] Tokens válidos en URL, intentando iniciar sesión"
        );
        const success = await handleSignIn(accessToken, refreshToken);
        console.log("[useEffect] Resultado de handleSignIn:", success);
        if (success) {
          console.log(
            "[useEffect] Login exitoso desde URL, redirigiendo al dashboard"
          );
          router.push(paths.dashboard.root);
        }
      })();
    }
  }, [params, router, handleSignIn, validateState, status]);

  // 7. Limpieza de listeners
  useEffect(() => {
    console.log("[useEffect] ENV values:", {
      NEXT_PUBLIC_SSO_URL: process.env.NEXT_PUBLIC_SSO_URL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    });
    return () => {
      console.log("[cleanup] Limpiando listeners y cerrando popup si existe");
      if (handlerRef.current) {
        window.removeEventListener("message", handlerRef.current);
      }
      popupRef.current?.close();
    };
  }, []);

  console.log("[useSSOAuth] Renderizando hook", {
    error,
    isLoading,
    session,
    isSignedIn,
  });

  return {
    error,
    startSSO,
    status,
    isLoading,
    isSignedIn,
  };
}
