"use client";

import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
} from "@microsoft/signalr";
import { createContext, useRef, ReactNode } from "react";

const NotificationSignalContext = createContext<HubConnection | null>(null);
export default NotificationSignalContext;

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
