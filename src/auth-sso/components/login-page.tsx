"use client";
import { clientsConfig } from "../utils/clients";
import { SSOLogin } from "./auth-page";
export default function LoginPage() {
  const id = clientsConfig.find(
    client => {
      console.log("Checking client:", client);
      const match = client.url == process.env.NEXT_PUBLIC_APP_URL || client.url == window.location.origin;
      return match;
    }
  )?.id;
  console.log("Client ID:", id);
  if (!id) throw new Error("Client ID not found for the current URL");
  return <SSOLogin clientId={id} />;
}
