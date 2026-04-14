"use client";

import { useEffect, useRef, useCallback, useState } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function isSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "showNotification" in ServiceWorkerRegistration.prototype
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotification(userId: string) {
  const swRegistrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const [permissionState, setPermissionState] = useState<
    NotificationPermission | "unsupported"
  >(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "unsupported",
  );

  // Registrar SW al montar
  useEffect(() => {
    if (!isSupported()) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        swRegistrationRef.current = reg;
        // Si el permiso ya fue otorgado, re-suscribir automáticamente
        if (Notification.permission === "granted" && userId) {
          subscribeAndSave(reg, userId);
        }
      })
      .catch((err) =>
        console.error("[Push] Error registrando Service Worker:", err),
      );
  }, [userId]);

  const subscribeAndSave = async (
    reg: ServiceWorkerRegistration,
    uid: string,
  ) => {
    try {
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey:
          urlBase64ToUint8Array(VAPID_PUBLIC_KEY).toString(),
      });

      await fetch("/api/web-push/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription, userId: uid }),
      });
    } catch (err) {
      console.error("[Push] Error suscribiendo:", err);
    }
  };

  const requestPermission = useCallback(async () => {
    if (!isSupported()) return;

    const permission = await Notification.requestPermission();
    setPermissionState(permission);

    if (permission === "granted" && swRegistrationRef.current && userId) {
      await subscribeAndSave(swRegistrationRef.current, userId);
    }
  }, [userId]);

  const showPush = useCallback(
    (title: string, body: string, _priority?: string) => {
      if (!swRegistrationRef.current) return;
      // Solo mostrar push si el tab no tiene foco
      if (document.visibilityState === "visible") return;
      if (Notification.permission !== "granted") return;

      swRegistrationRef.current.showNotification(title, {
        body,
        icon: "/assets/images/NEWZAS.svg",
        badge: "/assets/images/NEWZAS.svg",
        tag: "onlizas-notification",
        data: { url: "/dashboard/notifications" },
      });
    },
    [],
  );

  const testPush = useCallback(async () => {
    if (!userId) return;
    try {
      await fetch("/api/web-push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          payload: {
            title: "Notificación de prueba",
            body: "Si ves esto, las notificaciones push funcionan correctamente.",
            url: "/dashboard/notifications",
          },
        }),
      });
    } catch (err) {
      console.error("[Push] Error enviando test push:", err);
    }
  }, [userId]);

  return { showPush, requestPermission, testPush, permissionState };
}
