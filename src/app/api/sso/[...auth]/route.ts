// Importamos desde sso.ts para garantizar que initSSO se ejecute antes de exponer los handlers
import { handlers } from "@/sso";

// Exportas directamente GET y POST compatibles con el App Router
export const { GET } = handlers;

// (Opcional) si quieres forzar runtime node por uso de crypto:
// export const runtime = "nodejs";
