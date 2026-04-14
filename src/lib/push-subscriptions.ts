import type webpush from "web-push";

declare global {
  var __pushSubscriptions: Map<string, webpush.PushSubscription> | undefined;
}

export const subscriptions: Map<string, webpush.PushSubscription> =
  global.__pushSubscriptions ??
  (global.__pushSubscriptions = new Map<string, webpush.PushSubscription>());
