# Prompt: Implementar sistema de notificaciones en tiempo real

Implementa un sistema de notificaciones en tiempo real en un proyecto **Next.js App Router con TypeScript y Tailwind CSS**. El sistema combina **SignalR** (`@microsoft/signalr`) para recepción en tiempo real con endpoints REST para operaciones de lectura y respuesta.

---

## Stack y dependencias

- Next.js App Router (`"use client"` / `"use server"`)
- TypeScript
- Tailwind CSS
- `@microsoft/signalr` — instalar con `npm install @microsoft/signalr --legacy-peer-deps`
- `@tanstack/react-query` — para el fetch inicial del contador
- `react-toastify` (o el sistema de toast del proyecto) — para errores
- Hook de autenticación que exponga `user.id` (en este proyecto: `useAuth()` de `zas-sso-client`)
- Función de fetch autenticada del proyecto (en este proyecto: `nextAuthFetch` de `@/services/utils/next-auth-fetch`)

---

## Estructura de archivos a crear

```
src/sections/notifications/
├── index.ts
├── types/
│   └── notification.types.ts
├── provider/
│   ├── notification-signal-provider.tsx
│   └── notification-context.tsx
├── hooks/
│   ├── use-notification-signal.ts
│   └── use-notifications.ts
└── components/
    ├── notification-bell.tsx
    ├── notification-item.tsx
    ├── notification-question.tsx
    └── notification-empty.tsx

src/services/notifications.ts   ← server actions REST
```

---

## Paso 1 — Tipos TypeScript

**`src/sections/notifications/types/notification.types.ts`**

```typescript
export type NotificationPriority = "Low" | "Medium" | "High" | "Critical";
export type NotificationType = "Read" | "Question";

export interface AppNotification {
  callbackUrl?: string | null;
  createdAt: string; // ISO datetime
  description: string;
  isRead: boolean;
  metadata?: string | null; // JSON arbitrario
  notificationId: string;
  notificationType: NotificationType;
  options?: any; // JSON string: '["Sí","No"]'
  originSystemId?: string;
  priority: NotificationPriority;
  questionText?: string | null;
  readAt?: string | null;
  respondedAt?: string | null;
  respondedInSystem?: string | null;
  response?: string | null;
  subsystemCode?: string;
  title: string;
  userId: string;
}

export interface NotificationHistoryPayload {
  userId: string;
  unreadCount: number;
  notifications: AppNotification[];
}

export interface IncomingNotification {
  notificationId: string;
  userId: string;
  title: string;
  description: string;
  priority: NotificationPriority;
  notificationType: NotificationType;
  originSystemId: string;
  questionText?: string | null;
  options?: string | null;
  metadata?: string | null;
  createdAt: string;
}

export interface NotificationStatusUpdate {
  notificationId: string;
  title: string;
  description: string;
  priority: NotificationPriority;
  notificationType: NotificationType;
  questionText?: string | null;
  options?: string | null;
  metadata?: string | null;
  isRead: boolean;
  readAt?: string | null;
  response?: string | null;
  respondedAt?: string | null;
  respondedInSystem?: string | null;
}

export interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  connected: boolean;
  connecting: boolean;
  loadingIds: Set<string>; // IDs con operación en curso
  loadingNotifications: boolean; // carga inicial del contador REST
  markAsRead: (notificationId: string) => Promise<void>;
  respond: (notificationId: string, response: string) => Promise<void>;
}
```

---

## Paso 2 — Endpoints REST (adaptar según el proyecto)

Agregar al objeto `backendRoutes` del proyecto las rutas:

```typescript
notifications: {
  unreadCount: `${process.env.NEXT_PUBLIC_API_URL}user-notifications/unread-count`,
  markRead: (id: string) => `${process.env.NEXT_PUBLIC_API_URL}notifications/${id}/mark-read`,
  respond:  (id: string) => `${process.env.NEXT_PUBLIC_API_URL}notifications/${id}/respond`,
},
```

---

## Paso 3 — Service functions (server actions)

**`src/services/notifications.ts`**

```typescript
"use server";

import { backendRoutes } from "@/lib/endpoint";
import { nextAuthFetch } from "./utils/next-auth-fetch"; // ← adaptar al proyecto
import { ApiResponse } from "@/types/fetch/api";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";

// GET contador de no leídas — usado para el badge inicial antes de que SignalR responda
export async function getUnreadNotificationsCount(): Promise<number> {
  const res = await nextAuthFetch({
    url: backendRoutes.notifications.unreadCount,
    method: "GET",
    useAuth: true,
    cache: "no-cache",
  });
  if (!res.ok) return 0;
  try {
    const data = await res.json();
    if (typeof data === "number") return data;
    if (typeof data?.count === "number") return data.count;
    if (typeof data?.unreadCount === "number") return data.unreadCount;
    return 0;
  } catch {
    return 0;
  }
}

// POST marcar como leída
// El body debe incluir: notificationId, systemId (identificador del sistema), clientIdentifier
export async function markNotificationAsRead(
  notificationId: string,
): Promise<ApiResponse<any>> {
  const res = await nextAuthFetch({
    url: backendRoutes.notifications.markRead(notificationId),
    method: "POST",
    useAuth: true,
    data: {
      notificationId,
      systemId: "NOMBRE_DEL_SISTEMA", // ← cambiar por el id del sistema destino
      clientIdentifier: "web-browser-chrome",
    },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync(res);
}

// POST responder a una notificación tipo "Question"
export async function respondToNotification(
  notificationId: string,
  response: string,
): Promise<ApiResponse<any>> {
  const res = await nextAuthFetch({
    url: backendRoutes.notifications.respond(notificationId),
    method: "POST",
    useAuth: true,
    data: { response },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync(res);
}
```

---

## Paso 4 — SignalR provider (crea la conexión singleton)

**`src/sections/notifications/provider/notification-signal-provider.tsx`**

```tsx
"use client";

import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
} from "@microsoft/signalr";
import { createContext, useRef, ReactNode } from "react";

const NotificationSignalContext = createContext<HubConnection | null>(null);
export default NotificationSignalContext;

// URL del hub: NEXT_PUBLIC_API_URL debe terminar en "/"
const HUB_URL = `${process.env.NEXT_PUBLIC_API_URL}Notifications/notification-hub`;

export function NotificationSignalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const connectionRef = useRef<HubConnection | null>(null);

  if (!connectionRef.current) {
    connectionRef.current = new HubConnectionBuilder()
      .withUrl(HUB_URL, { withCredentials: false })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();
  }

  return (
    <NotificationSignalContext.Provider value={connectionRef.current}>
      {children}
    </NotificationSignalContext.Provider>
  );
}
```

> Si el hub requiere autenticación por token Bearer, añadir `accessTokenFactory` en `.withUrl()`.

---

## Paso 5 — Hook de ciclo de vida de la conexión

**`src/sections/notifications/hooks/use-notification-signal.ts`**

Este hook maneja el ciclo completo de la conexión y es compatible con **React Strict Mode** (que ejecuta los efectos dos veces en desarrollo).

```typescript
"use client";

import { useContext, useEffect, useState } from "react";
import type * as signalR from "@microsoft/signalr";
import NotificationSignalContext from "../provider/notification-signal-provider";

interface UseNotificationSignalResult {
  connection: signalR.HubConnection | null;
  connected: boolean;
  connecting: boolean;
}

// WeakMap para guardar la promise de start() por instancia.
// Necesario para que el segundo montaje de React Strict Mode se enganche
// a la promise ya existente en lugar de llamar start() de nuevo.
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
        setConnected(true);
        setConnecting(false);
      }
    };
    const onFailed = (err: unknown) => {
      if (isMounted) {
        console.error("[Notifications] Error conectando:", err);
        setConnecting(false);
      }
    };

    if (connection.state === "Connected") {
      setConnected(true);
      setConnecting(false);
    } else if (connection.state === "Disconnected") {
      setConnecting(true);
      const promise = connection.start().then(onResolved).catch(onFailed);
      startPromises.set(connection, promise);
    } else if (connection.state === "Connecting") {
      // React Strict Mode: engancharse a la promise existente
      setConnecting(true);
      startPromises.get(connection)?.then(onResolved).catch(onFailed);
    }

    connection.onreconnecting(() => {
      if (isMounted) {
        setConnected(false);
        setConnecting(true);
      }
    });
    connection.onreconnected(() => {
      if (isMounted) {
        setConnected(true);
        setConnecting(false);
      }
    });
    connection.onclose(() => {
      if (isMounted) {
        setConnected(false);
        setConnecting(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [connection]);

  return { connection, connected, connecting };
}
```

---

## Paso 6 — Contexto de estado y acciones

**`src/sections/notifications/provider/notification-context.tsx`**

Puntos clave del diseño:

- El `unreadCount` se inicializa desde el REST endpoint via `useQuery` (visible antes de que SignalR responda).
- Al conectar SignalR, el evento `NotificationHistory` sobreescribe el estado con el historial real.
- `markAsRead` hace **optimistic update** → llama REST → revierte + toast si hay error.
- `onStatusUpdate` de SignalR **no decrementa** el contador si la notificación ya estaba marcada como leída localmente (evita doble decremento).
- `loadingIds: Set<string>` permite que cada ítem sepa si tiene una operación en curso.

```tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "zas-sso-client"; // ← reemplazar por el hook de auth del sistema
import { useQuery } from "@tanstack/react-query";
import {
  getUnreadNotificationsCount,
  markNotificationAsRead,
  respondToNotification,
} from "@/services/notifications";
import showToast from "@/config/toast/toastConfig"; // ← reemplazar por el sistema de toast del proyecto
import { useNotificationSignal } from "../hooks/use-notification-signal";
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
  const userId = session.user?.id ?? ""; // ← adaptar al hook de auth del sistema

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

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

  // Contador inicial desde REST (antes de que SignalR responda)
  const { data: restUnreadCount, isLoading: loadingNotifications } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationsCount,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (restUnreadCount !== undefined) setUnreadCount(restUnreadCount);
  }, [restUnreadCount]);

  // Registrar usuario en el hub cuando la conexión esté lista
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
        callbackUrl: null,
        createdAt: incoming.createdAt,
        description: incoming.description,
        isRead: false,
        metadata: incoming.metadata ?? null,
        notificationId: incoming.notificationId,
        notificationType: incoming.notificationType,
        options: incoming.options ?? null,
        originSystemId: incoming.originSystemId,
        priority: incoming.priority,
        questionText: incoming.questionText ?? null,
        readAt: null,
        respondedAt: null,
        respondedInSystem: null,
        response: null,
        subsystemCode: "",
        title: incoming.title,
        userId: incoming.userId,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const onStatusUpdate = (update: NotificationStatusUpdate) => {
      setNotifications((prev) => {
        const wasAlreadyRead = prev.find(
          (n) => n.notificationId === update.notificationId,
        )?.isRead;
        // Solo decrementar si no había optimistic update previo
        if (update.isRead && !wasAlreadyRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.map((n) =>
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
        // Revertir
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
      if (result.error) showToast("No se pudo enviar la respuesta", "error");
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
        loadingIds,
        loadingNotifications,
        markAsRead,
        respond,
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
```

---

## Paso 7 — Hook público

**`src/sections/notifications/hooks/use-notifications.ts`**

```typescript
import { useNotificationsContext } from "../provider/notification-context";
export function useNotifications() {
  return useNotificationsContext();
}
```

---

## Paso 8 — Componentes de UI

### `notification-bell.tsx` — Botón del navbar con dropdown

- Muestra spinner mientras carga (`loadingNotifications`)
- Bloquea apertura del dropdown durante la carga (`pointer-events-none`)
- Badge numérico rojo con el contador de no leídas
- Punto amarillo pulsante mientras SignalR está conectando
- Header con gradiente de color primario
- Lista con scroll vertical (`max-h` + `overflow-y-auto`)

```tsx
"use client";

import { useNotifications } from "../hooks/use-notifications";
import { NotificationItem } from "./notification-item";
import { NotificationQuestion } from "./notification-question";
import { NotificationEmpty } from "./notification-empty";
import Dropdown from "@/components/ui/dropdown"; // ← componente Dropdown del proyecto
import IconBellBing from "@/components/icon/icon-bell-bing"; // ← ícono de campana del proyecto

export function NotificationBell() {
  const { notifications, unreadCount, connecting, loadingNotifications } =
    useNotifications();

  return (
    <Dropdown
      offset={[0, 8]}
      placement="bottom-end"
      btnClassName={`relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60 ${loadingNotifications ? "pointer-events-none opacity-60" : ""}`}
      button={
        <span className="relative">
          {loadingNotifications ? (
            <svg
              className="h-5 w-5 animate-spin text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            <IconBellBing className="h-5 w-5" />
          )}
          {!loadingNotifications && connecting && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
            </span>
          )}
          {!loadingNotifications && !connecting && unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white shadow">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </span>
      }
    >
      <div className="w-80 overflow-hidden rounded-xl shadow-lg sm:w-96">
        <div className="flex items-center justify-between bg-linear-to-r from-primary to-primary/80 px-4 py-3">
          <div className="flex items-center gap-2">
            <IconBellBing className="h-4 w-4 text-white" />
            <h4 className="text-sm font-semibold text-white">Notificaciones</h4>
          </div>
          {unreadCount > 0 && (
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              {unreadCount > 99 ? "99+" : unreadCount} sin leer
            </span>
          )}
        </div>
        <ul className="max-h-[420px] divide-y divide-gray-100 overflow-y-auto dark:divide-white/5">
          {notifications.length === 0 ? (
            <NotificationEmpty />
          ) : (
            notifications.map((notif, index) =>
              notif.notificationType === "Question" && !notif.response ? (
                <NotificationQuestion
                  key={notif.notificationId}
                  notification={notif}
                />
              ) : (
                <NotificationItem
                  key={`${notif.notificationId}-${index}`}
                  notification={notif}
                />
              ),
            )
          )}
        </ul>
      </div>
    </Dropdown>
  );
}
```

### `notification-item.tsx` — Notificación de tipo "Read"

Características:

- Barra lateral de color según prioridad (verde/amarillo/rojo/rojo pulsante)
- Ícono circular → spinner durante la petición de marcar como leída
- El ítem completo queda `opacity-60 cursor-wait` mientras carga
- Click bloqueado si ya está cargando o ya está leída
- Badge de prioridad con etiqueta en texto + timestamp con ícono

```tsx
"use client";

import { useNotifications } from "../hooks/use-notifications";
import type { AppNotification } from "../types/notification.types";
// Usar los íconos disponibles en el proyecto para IconCircleCheck e IconClock

const PRIORITY_STYLES = {
  Low: {
    bar: "bg-success",
    badge: "bg-success/10 text-success",
    label: "Baja",
  },
  Medium: {
    bar: "bg-warning",
    badge: "bg-warning/10 text-warning",
    label: "Media",
  },
  High: { bar: "bg-danger", badge: "bg-danger/10 text-danger", label: "Alta" },
  Critical: {
    bar: "bg-danger animate-pulse",
    badge: "bg-danger/20 text-danger font-semibold",
    label: "Crítica",
  },
};

export function NotificationItem({
  notification,
}: {
  notification: AppNotification;
}) {
  const { markAsRead, loadingIds } = useNotifications();
  const priority = PRIORITY_STYLES[notification.priority];
  const isLoading = loadingIds.has(notification.notificationId);

  return (
    <li onClick={(e) => e.stopPropagation()}>
      <div
        onClick={() => {
          if (!notification.isRead && !isLoading)
            markAsRead(notification.notificationId);
        }}
        className={`relative flex gap-3 px-4 py-3.5 transition-colors
          ${isLoading ? "cursor-wait opacity-60" : "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"}
          ${!notification.isRead ? "bg-primary/5 dark:bg-primary/10" : ""}`}
      >
        <span
          className={`absolute inset-y-0 left-0 w-0.5 rounded-full ${priority?.bar ?? "bg-gray-300"}`}
        />
        {/* ícono circular + spinner si isLoading */}
        {/* contenido: título, descripción, badge de prioridad, timestamp */}
      </div>
    </li>
  );
}
```

### `notification-question.tsx` — Notificación de tipo "Question"

Características:

- Muestra `questionText` en un bloque con borde diferenciado
- Botones de respuesta generados desde `options` (JSON string `'["Sí","No"]'`)
- Spinner inline en los botones mientras se procesa la respuesta
- Feedback visual inmediato al responder (chip verde) sin esperar a SignalR

```tsx
"use client";

import { useState } from "react";
import { useNotifications } from "../hooks/use-notifications";
import type { AppNotification } from "../types/notification.types";

export function NotificationQuestion({
  notification,
}: {
  notification: AppNotification;
}) {
  const { respond, loadingIds } = useNotifications();
  const [answered, setAnswered] = useState<string | null>(null);
  const isLoading = loadingIds.has(notification.notificationId);

  let options: string[] = [];
  try {
    if (notification.options) options = JSON.parse(notification.options);
  } catch {
    options = [];
  }

  const handleRespond = async (option: string) => {
    await respond(notification.notificationId, option);
    setAnswered(option);
  };

  return (
    <li onClick={(e) => e.stopPropagation()}>
      {/* contenido con questionText en bloque, botones de opciones con spinner, chip de respondido */}
    </li>
  );
}
```

### `notification-empty.tsx` — Estado vacío

```tsx
export function NotificationEmpty() {
  return (
    <li onClick={(e) => e.stopPropagation()}>
      <div className="flex min-h-52 flex-col items-center justify-center gap-3 px-6 py-8 text-center">
        {/* ícono de campana en contenedor circular gris */}
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Todo al día
        </p>
        <p className="mt-0.5 text-xs text-gray-400">
          No tienes notificaciones pendientes
        </p>
      </div>
    </li>
  );
}
```

---

## Paso 9 — Barrel de exportaciones

**`src/sections/notifications/index.ts`**

```typescript
export { NotificationSignalProvider } from "./provider/notification-signal-provider";
export { NotificationProvider } from "./provider/notification-context";
export { NotificationBell } from "./components/notification-bell";
export { useNotifications } from "./hooks/use-notifications";
export type {
  AppNotification,
  NotificationContextValue,
  NotificationPriority,
  NotificationType,
} from "./types/notification.types";
```

---

## Paso 10 — Integración en el layout del dashboard

```tsx
// src/app/dashboard/layout.tsx
import {
  NotificationSignalProvider,
  NotificationProvider,
} from "@/sections/notifications";

export default function Layout({ children }) {
  return (
    <NotificationSignalProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </NotificationSignalProvider>
  );
}
```

## Paso 11 — Colocar el botón en el header

```tsx
// src/layouts/header/header.tsx
import { NotificationBell } from "@/sections/notifications";

// Dentro del JSX del header, en la zona de iconos del navbar:
<NotificationBell />;
```

---

## Contrato con el Hub SignalR (backend .NET)

### Métodos invocados desde el cliente

| Método         | Parámetros       | Descripción                     |
| -------------- | ---------------- | ------------------------------- |
| `RegisterUser` | `userId: string` | Registra al usuario en su grupo |

### Eventos recibidos desde el servidor

| Evento                         | Payload                      | Descripción                                |
| ------------------------------ | ---------------------------- | ------------------------------------------ |
| `NotificationHistory`          | `NotificationHistoryPayload` | Historial inicial al conectar              |
| `ReceiveNotification`          | `IncomingNotification`       | Nueva notificación en tiempo real          |
| `NotificationStatusUpdate`     | `NotificationStatusUpdate`   | Actualización de estado (leída/respondida) |
| `NotificationAlreadyResponded` | `{ notificationId: string }` | Notificación respondida desde otro sistema |

### Endpoints REST del backend

| Método | Ruta                               | Body                                             |
| ------ | ---------------------------------- | ------------------------------------------------ |
| GET    | `/user-notifications/unread-count` | —                                                |
| POST   | `/notifications/{id}/mark-read`    | `{ notificationId, systemId, clientIdentifier }` |
| POST   | `/notifications/{id}/respond`      | `{ response }`                                   |

---

## Puntos de adaptación por sistema

1. **URL del hub**: cambiar `Notifications/notification-hub` si el backend usa otra ruta.
2. **`NEXT_PUBLIC_API_URL`**: debe terminar en `/`. Configurar en `.env`.
3. **`systemId`** en `markNotificationAsRead`: cambiar `"onlizas"` por el identificador del sistema destino.
4. **Hook de autenticación**: reemplazar `useAuth()` de `zas-sso-client` por el hook/store que exponga `user.id` en el sistema destino.
5. **Función de fetch autenticada**: reemplazar `nextAuthFetch` por la función equivalente del sistema destino.
6. **Sistema de toast**: reemplazar `showToast` por el sistema de notificaciones toast del proyecto destino.
7. **Componente Dropdown**: reemplazar por el componente dropdown disponible en el proyecto destino. Debe renderizar el contenido como children al abrirse.
8. **Íconos**: reemplazar `IconBellBing`, `IconCircleCheck`, `IconClock`, `IconInfoCircle` por los íconos equivalentes del proyecto destino.
9. **Credenciales SignalR**: si el hub requiere token Bearer, añadir `accessTokenFactory: () => token` en `.withUrl()`.
10. **`"use client"` / `"use server"`**: son directivas de Next.js App Router. En otros frameworks eliminarlas.

---

## Flujo completo

```
App monta
│
├── useQuery → GET /user-notifications/unread-count → setUnreadCount (badge inicial inmediato)
│
├── NotificationSignalProvider → crea HubConnection singleton
│
├── useNotificationSignal → connection.start() → Connected
│
├── NotificationProvider → RegisterUser(userId)
│   ├── on("NotificationHistory") → setNotifications + setUnreadCount (estado real)
│   ├── on("ReceiveNotification") → prepend notification + unreadCount++
│   ├── on("NotificationStatusUpdate") → update notification, solo decrementa si no había optimistic update
│   └── on("NotificationAlreadyResponded") → isRead = true
│
└── NotificationBell (navbar)
    ├── loadingNotifications=true → spinner + pointer-events-none
    ├── connecting=true → punto amarillo pulsante
    ├── unreadCount > 0 → badge rojo numérico
    │
    ├── NotificationItem
    │   └── click → markAsRead → optimistic update → POST /mark-read
    │       ├── éxito → SignalR emite StatusUpdate (sin doble decremento)
    │       └── error → revert + toast error
    │
    └── NotificationQuestion
        └── click opción → respond → POST /respond → answered chip inmediato
            └── error → toast error
```
