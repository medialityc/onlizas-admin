"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "zas-sso-client";
import { useQuery } from "@tanstack/react-query";
import useSound from "use-sound";
import {
  getUnreadNotificationsCount,
  markNotificationAsRead,
  respondToNotification,
} from "@/services/notifications";
import showToast from "@/config/toast/toastConfig";
import { sileo } from "sileo";
import { useNotificationSignal } from "../hooks/use-notification-signal";
import { usePushNotification } from "../hooks/use-push-notification";
import type {
  AppNotification,
  NotificationContextValue,
  NotificationHistoryPayload,
  IncomingNotification,
  NotificationStatusUpdate,
} from "../types/notification.types";

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { connection, connected, connecting } = useNotificationSignal();
  const session = useAuth();
  const userId = String(session.user?.id ?? "");

  const { showPush, requestPermission, testPush } = usePushNotification(userId);
  const [playSound] = useSound("/assets/sounds/success.mp3", { volume: 0.5 });

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [ringing, setRinging] = useState(false);

  const addLoading = useCallback(
    (id: string) => setLoadingIds((prev) => new Set(prev).add(id)),
    [],
  );

  const removeLoading = useCallback(
    (id: string) =>
      setLoadingIds((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      }),
    [],
  );

  // Cargar el contador inicial desde el REST endpoint (antes de que SignalR responda)
  const { data: restUnreadCount, isLoading: loadingNotifications } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationsCount,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (restUnreadCount !== undefined) {
      setUnreadCount(restUnreadCount);
    }
  }, [restUnreadCount]);

  // Registrar usuario cuando la conexión esté lista
  useEffect(() => {
    if (!connection || !connected || !userId) return;
    connection.invoke("RegisterUser", userId).catch(console.error);
  }, [connection, connected, userId]);

  // Suscribir eventos SignalR
  useEffect(() => {
    if (!connection) return;

    const onHistory = (payload: NotificationHistoryPayload) => {
      setNotifications(payload.notifications);
      setUnreadCount(payload.unreadCount);
    };

    const onReceive = (incoming: IncomingNotification) => {
      const newNotif: AppNotification = {
        createdAt: incoming.createdAt,
        description: incoming.description,
        isRead: false,
        notificationId: incoming.notificationId,
        notificationType: incoming.notificationType,
        options: incoming.options,
        title: incoming.title,
        priority: incoming.priority,
        userId: incoming.userId,
        questionText: incoming.questionText,
        originSystemId: incoming.originSystemId,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Sonido
      playSound();

      // Push OS-level (solo si tab sin foco)
      showPush(incoming.title, incoming.description, incoming.priority);

      // Toast in-app
      sileo.info({
        title: incoming.title,
        description: incoming.description,
        position: "top-right",
        duration: 6000,
      });

      // Animación de campana
      setRinging(true);
      setTimeout(() => setRinging(false), 800);
    };

    const onStatusUpdate = (update: NotificationStatusUpdate) => {
      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.notificationId === update.notificationId
            ? {
                ...n,
                isRead: update.isRead,
                readAt: update.readAt ?? n.readAt,
                response: update.response ?? n.response,
                respondedAt: update.respondedAt ?? n.respondedAt,
                respondedInSystem:
                  update.respondedInSystem ?? n.respondedInSystem,
              }
            : n,
        );
        // Solo decrementar si la notificación NO estaba ya marcada como leída
        // (evita doble decremento cuando hay un optimistic update previo)
        const wasAlreadyRead = prev.find(
          (n) => n.notificationId === update.notificationId,
        )?.isRead;
        if (update.isRead && !wasAlreadyRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return updated;
      });
    };

    const onAlreadyResponded = (payload: { notificationId: string }) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === payload.notificationId
            ? { ...n, isRead: true }
            : n,
        ),
      );
    };

    connection.on("NotificationHistory", onHistory);
    connection.on("ReceiveNotification", onReceive);
    connection.on("NotificationStatusUpdate", onStatusUpdate);
    connection.on("NotificationAlreadyResponded", onAlreadyResponded);

    return () => {
      connection.off("NotificationHistory", onHistory);
      connection.off("ReceiveNotification", onReceive);
      connection.off("NotificationStatusUpdate", onStatusUpdate);
      connection.off("NotificationAlreadyResponded", onAlreadyResponded);
    };
  }, [connection]);

  const markAsRead = async (notificationId: string) => {
    addLoading(notificationId);
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === notificationId ? { ...n, isRead: true } : n,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      const result = await markNotificationAsRead(notificationId);
      if (result.error) {
        // Revert optimistic update
        setNotifications((prev) =>
          prev.map((n) =>
            n.notificationId === notificationId ? { ...n, isRead: false } : n,
          ),
        );
        setUnreadCount((prev) => prev + 1);
        showToast("No se pudo marcar la notificación como leída", "error");
      }
    } catch {
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: false } : n,
        ),
      );
      setUnreadCount((prev) => prev + 1);
      showToast("No se pudo marcar la notificación como leída", "error");
    } finally {
      removeLoading(notificationId);
    }
  };

  const respond = async (notificationId: string, response: string) => {
    addLoading(notificationId);
    try {
      const result = await respondToNotification(notificationId, response);
      if (result.error) {
        showToast("No se pudo enviar la respuesta", "error");
      }
    } catch {
      showToast("No se pudo enviar la respuesta", "error");
    } finally {
      removeLoading(notificationId);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        connected,
        connecting,
        ringing,
        loadingIds,
        loadingNotifications,
        markAsRead,
        respond,
        requestPushPermission: requestPermission,
        testPushNotification: () => testPush(),
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationsContext() {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotificationsContext debe usarse dentro de NotificationProvider",
    );
  return context;
}

export default NotificationContext;
