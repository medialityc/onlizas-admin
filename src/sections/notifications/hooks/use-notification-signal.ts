"use client";

import { useContext, useEffect, useState } from "react";
import type * as signalR from "@microsoft/signalr";
import NotificationSignalContext from "../provider/notification-signal-provider";

interface UseNotificationSignalResult {
  connection: signalR.HubConnection | null;
  connected: boolean;
  connecting: boolean;
}

// Guarda la promise de start() por instancia de conexión para que el segundo
// montaje de React Strict Mode pueda engancharse a ella sin llamar start() de nuevo.
const startPromises = new WeakMap<signalR.HubConnection, Promise<void>>();

export function useNotificationSignal(): UseNotificationSignalResult {
  const connection = useContext(NotificationSignalContext);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!connection) return;
    let isMounted = true;

    const onResolved = () => {
      if (isMounted) {
        console.log("[Notifications] Conectado al hub");
        setConnected(true);
        setConnecting(false);
      }
    };

    const onFailed = (err: unknown) => {
      if (isMounted) {
        console.error("[Notifications] Error conectando al hub:", err);
        setConnecting(false);
      }
    };

    if (connection.state === "Connected") {
      console.log("[Notifications] Ya conectado al hub");
      setConnected(true);
      setConnecting(false);
    } else if (connection.state === "Disconnected") {
      console.log("[Notifications] Iniciando conexión al hub...");
      setConnecting(true);
      const promise = connection.start().then(onResolved).catch(onFailed);
      startPromises.set(connection, promise);
    } else if (connection.state === "Connecting") {
      // React Strict Mode: start() ya fue llamado en el primer montaje.
      // Nos enganchamos a la promise existente para saber cuándo termina.
      console.log("[Notifications] Conexión en curso, esperando resolución...");
      setConnecting(true);
      const existing = startPromises.get(connection);
      if (existing) {
        existing.then(onResolved).catch(onFailed);
      }
    } else {
      console.log(
        `[Notifications] Estado actual de la conexión: ${connection.state}`,
      );
    }

    const onReconnecting = (err?: Error) => {
      if (isMounted) {
        console.warn("[Notifications] Reconectando al hub...", err);
        setConnected(false);
        setConnecting(true);
      }
    };
    const onReconnected = (connectionId?: string) => {
      if (isMounted) {
        console.log(
          "[Notifications] Reconectado al hub. ConnectionId:",
          connectionId,
        );
        setConnected(true);
        setConnecting(false);
      }
    };
    const onClose = (err?: Error) => {
      if (isMounted) {
        console.warn("[Notifications] Conexión cerrada", err ?? "");
        setConnected(false);
        setConnecting(false);
      }
    };

    connection.onreconnecting(onReconnecting);
    connection.onreconnected(onReconnected);
    connection.onclose(onClose);

    return () => {
      isMounted = false;
    };
  }, [connection]);

  return { connection, connected, connecting };
}
