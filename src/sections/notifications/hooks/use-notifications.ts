import { useNotificationsContext } from "../provider/notification-context";

export function useNotifications() {
  return useNotificationsContext();
}
