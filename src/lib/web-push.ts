import webpush from "web-push";

export function ensureVapidDetails() {
  const subject = process.env.VAPID_EMAIL;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!subject || !publicKey || !privateKey) {
    throw new Error(
      "VAPID credentials not configured. Set VAPID_EMAIL, NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables."
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
}
