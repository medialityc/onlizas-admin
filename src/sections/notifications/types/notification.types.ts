export type NotificationPriority = "Low" | "Medium" | "High" | "Critical";
export type NotificationType = "Read" | "Question";

export interface AppNotification {
  callbackUrl?: string | null;
  createdAt: string;
  description: string;
  isRead: boolean;
  metadata?: string | null;
  notificationId: string;
  notificationType: NotificationType;
  options?: any;
  originSystemId?: string;
  priority: NotificationPriority;
  questionText?: string | null;
  readAt?: string | null;
  respondedAt?: string | null;
  respondedInSystem?: string | null;
  response?: string | null;
  subsystemCode?: string;
  title: string;
  userId: string; // For incoming notifications that haven't been fully processed yet
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
  loadingIds: Set<string>;
  loadingNotifications: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  respond: (notificationId: string, response: string) => Promise<void>;
}
