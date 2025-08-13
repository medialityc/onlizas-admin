import { PaginatedResponse } from "./common";

export type NotificationPriority = "high" | "medium" | "low";
export type UserNotificationStatus = "sent" | "read" | "deleted";
export type NotificationChannel = "in_app" | "email" | "sms";
export type Frequency = "immediate" | "daily_summary";
export type NotificationType = "individual" | "massive";

/* export interface NotificationType {
  id: number;
  name: string;
  template: string;
  active: boolean;
  events?: NotificationEvent[];
  preferences?: NotificationPreference[];
} */

export interface NotificationEvent {
  id: number;
  entity: string;
  action: string;
  notificationTypeId: number;
  notificationType?: NotificationType;
}

export interface Notification {
  id: number;
  notificationType: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  date: Date;
  isRead?: boolean;
  userNotifications?: UserNotification[];
  channel: NotificationChannel[];
}

export interface UserNotification {
  id: number;
  notificationId: number;
  notification?: Notification;
  userId: number;
  status: UserNotificationStatus;
}

export interface NotificationPreference {
  id: number;
  userId: number;
  notificationTypeId: number;
  notificationType?: NotificationType;
  active: boolean;
  channels: NotificationChannel[];
  frequency: Frequency;
}
export type CreateNotificationPayload = {
  title: string;
  message: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  recipientType: ("specific" | "role")[];
  notificationType: NotificationType;
  specificRecipients?: number[];
  roleRecipients?: number[];
};
export type GetAllNotificationByUserResponse = PaginatedResponse<Notification>;
export type CreateNotificationResponse = PaginatedResponse<Notification>;
