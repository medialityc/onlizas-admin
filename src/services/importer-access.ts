"use server";

import { backendRoutes } from "@/lib/endpoint";
import { cookies } from "next/headers";
import type { ImporterData } from "./importer-portal";

// Re-exportar el tipo para mantener compatibilidad
export type { ImporterData };

const IMPORTER_TOKEN_COOKIE = "importer_access_token";
const IMPORTER_ID_COOKIE = "importer_id";
const IMPORTER_EXPIRES_COOKIE = "importer_expires_at";

// Validar que sea un UUID válido para prevenir SSRF
function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export type ValidateResponse = {
  success: boolean;
  token?: string;
  expiresIn?: number;
  importer?: {
    id: string;
    name: string;
  };
  requiresQRSetup?: boolean;
  message?: string;
  error?: boolean;
};

export async function validateImporterAccess(
  importerId: string,
  code: string
): Promise<ValidateResponse> {
  try {
    // Validar UUID para prevenir SSRF
    if (!isValidUUID(importerId)) {
      return {
        success: false,
        error: true,
        message: "ID de importadora inválido",
      };
    }

    const response = await fetch(backendRoutes.importerAccess.validate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ importerId, code }),
    });

    const data = await response.json();

    if (!response.ok || data.error || data.isValid === false) {
      const requiresQRSetup =
        data.requiresQRSetup === true ||
        response.status === 428 ||
        data.message?.toLowerCase().includes("qr") ||
        data.message?.toLowerCase().includes("configurar") ||
        data.message?.toLowerCase().includes("setup") ||
        data.message?.toLowerCase().includes("generar");

      return {
        success: false,
        error: true,
        requiresQRSetup,
        importer: data.importer || { id: importerId, name: "" },
        message: data.message || "Código inválido",
      };
    }

    const token = data.sessionToken || data.token;
    const expiresAtISO = data.expiresAt;

    if (!token) {
      console.error("Missing token in response:", data);
      return {
        success: false,
        error: true,
        message: "Respuesta inválida del servidor: token faltante",
      };
    }

    let expiresAt: number;
    if (expiresAtISO) {
      expiresAt = new Date(expiresAtISO).getTime();
    } else if (data.expiresIn) {
      expiresAt = Date.now() + data.expiresIn * 1000;
    } else {
      expiresAt = Date.now() + 3600 * 1000;
    }

    const expiresInSeconds = Math.floor((expiresAt - Date.now()) / 1000);

    const cookieStore = await cookies();

    cookieStore.set(IMPORTER_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresInSeconds,
    });

    cookieStore.set(IMPORTER_ID_COOKIE, importerId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresInSeconds,
    });

    cookieStore.set(IMPORTER_EXPIRES_COOKIE, expiresAt.toString(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresInSeconds,
    });

    return {
      success: true,
      token: token,
      expiresIn: expiresInSeconds,
      importer: { id: importerId, name: "" },
    };
  } catch (error) {
    console.error("Error validating importer access:", error);
    return {
      success: false,
      error: true,
      message: "Error al validar el código",
    };
  }
}

export async function getImporterData(): Promise<{
  data?: ImporterData;
  error?: boolean;
  message?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(IMPORTER_TOKEN_COOKIE)?.value;

    console.log("🔍 [getImporterData] Iniciando...", {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPreview: token ? `${token.substring(0, 30)}...` : "NO TOKEN",
    });

    if (!token) {
      console.error("❌ [getImporterData] No hay sesión activa");
      return {
        error: true,
        message: "No hay sesión activa",
      };
    }

    const endpoint = backendRoutes.importerAccess.getData;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "X-Importer-Session-Token": token,
      },
      cache: "no-store",
    });

    console.log("📨 [getImporterData] Response status:", response.status);
    console.log(
      "📨 [getImporterData] Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const text = await response.text();

    console.log("📄 [getImporterData] Response text length:", text.length);
    console.log(
      "📄 [getImporterData] Response text preview:",
      text.substring(0, 200)
    );

    if (!text) {
      console.error("❌ [getImporterData] Respuesta vacía");
      return {
        error: true,
        message: "Respuesta vacía del servidor",
      };
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return {
        error: true,
        message: "Respuesta inválida del servidor",
      };
    }

    if (!response.ok || data.error) {
      console.error("❌ [getImporterData] Error en respuesta:", {
        responseOk: response.ok,
        dataError: data.error,
        message: data.message,
        fullData: JSON.stringify(data, null, 2),
      });

      // Extraer mensaje de error si viene en el array errors
      let errorMessage = data.message || "Error al obtener los datos";
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        errorMessage = data.errors
          .map((e: any) => e.message || JSON.stringify(e))
          .join(", ");
        console.error("❌ [getImporterData] Errores detallados:", data.errors);
      }

      return {
        error: true,
        message: errorMessage,
      };
    }
    return {
      data: data,
    };
  } catch (error) {
    console.error("💥 [getImporterData] Excepción capturada:", error);
    return {
      error: true,
      message: "Error al obtener los datos",
    };
  }
}

export async function checkImporterSession(): Promise<{
  authenticated: boolean;
  importerId?: string;
  expiresAt?: number;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get(IMPORTER_TOKEN_COOKIE)?.value;
  const importerId = cookieStore.get(IMPORTER_ID_COOKIE)?.value;
  const expiresAt = cookieStore.get(IMPORTER_EXPIRES_COOKIE)?.value;

  if (!token || !importerId) {
    return { authenticated: false };
  }

  const expiresAtNum = expiresAt ? parseInt(expiresAt) : 0;
  if (expiresAtNum && Date.now() > expiresAtNum) {
    await logoutImporter();
    return { authenticated: false };
  }

  return {
    authenticated: true,
    importerId,
    expiresAt: expiresAtNum,
  };
}

export async function logoutImporter(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(IMPORTER_TOKEN_COOKIE);
  cookieStore.delete(IMPORTER_ID_COOKIE);
  cookieStore.delete(IMPORTER_EXPIRES_COOKIE);
}

export type ImporterSession = {
  sessionId: string;
  importerId: string;
  importerName: string;
  createdAt: string;
  expiresAt: string;
  lastAccessedAt: string;
  ipAddress: string;
  isActive: boolean;
  isExpired: boolean;
};

export async function getImporterSessions(importerId: string): Promise<{
  data?: ImporterSession[];
  error?: boolean;
  message?: string;
}> {
  try {
    if (!isValidUUID(importerId)) {
      return {
        error: true,
        message: "ID de importadora inválido",
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(IMPORTER_TOKEN_COOKIE)?.value;

    if (!token) {
      return {
        error: true,
        message: "No hay sesión activa",
      };
    }

    const response = await fetch(
      backendRoutes.importerAccess.sessions(importerId),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      return {
        error: true,
        message: data.message || "Error al obtener las sesiones",
      };
    }

    return {
      data: data,
    };
  } catch (error) {
    console.error("Error getting importer sessions:", error);
    return {
      error: true,
      message: "Error al obtener las sesiones",
    };
  }
}

export async function revokeImporterSession(
  importerId: string,
  sessionId: string,
  reason?: string
): Promise<{
  success: boolean;
  error?: boolean;
  message?: string;
}> {
  try {
    if (!isValidUUID(importerId)) {
      return {
        success: false,
        error: true,
        message: "ID de importadora inválido",
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(IMPORTER_TOKEN_COOKIE)?.value;

    if (!token) {
      return {
        success: false,
        error: true,
        message: "No hay sesión activa",
      };
    }

    const response = await fetch(
      backendRoutes.importerAccess.revokeSession(importerId),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId, reason }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      return {
        success: false,
        error: true,
        message: data.message || "Error al revocar la sesión",
      };
    }

    return {
      success: true,
      message: data.message || "Sesión revocada exitosamente",
    };
  } catch (error) {
    console.error("Error revoking importer session:", error);
    return {
      success: false,
      error: true,
      message: "Error al revocar la sesión",
    };
  }
}

export type QRCodeResponse = {
  importerId: string;
  importerName: string;
  secretKey: string;
  qrCodeUrl: string;
  qrCodeImageBase64: string;
  createdAt: string;
  instructions: string;
};

export async function generateImporterQR(importerId: string): Promise<{
  data?: QRCodeResponse;
  error?: boolean;
  message?: string;
}> {
  try {
    if (!isValidUUID(importerId)) {
      return {
        error: true,
        message: "ID de importadora inválido",
      };
    }

    const response = await fetch(
      backendRoutes.importerAccess.generateQr(importerId),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      return {
        error: true,
        message: data.message || "Error al generar el código QR",
      };
    }

    return {
      data: data,
    };
  } catch (error) {
    console.error("Error generating QR code:", error);
    return {
      error: true,
      message: "Error al generar el código QR",
    };
  }
}

export type UpdateContractPayload = {
  endDate: string;
  nomenclatorIds: string[];
};

export async function updateImporterContract(
  contractId: string,
  payload: UpdateContractPayload
): Promise<{
  success: boolean;
  data?: any;
  error?: boolean;
  message?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(IMPORTER_TOKEN_COOKIE)?.value;

    if (!token) {
      return {
        success: false,
        error: true,
        message: "No hay sesión activa",
      };
    }

    // LOG: Ver qué se está enviando
    console.log("[updateImporterContract] contractId:", contractId);
    console.log("[updateImporterContract] payload:", JSON.stringify(payload));

    const response = await fetch(
      `${backendRoutes.importerAccess.contracts}/${contractId}`,
      {
        method: "PUT",
        headers: {
          "X-Importer-Session-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    // LOG: Ver la respuesta cruda
    const text = await response.text();
    console.log("[updateImporterContract] raw response:", text);
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { error: true, message: "Respuesta no es JSON", raw: text };
    }

    if (!response.ok || data.error) {
      return {
        success: false,
        error: true,
        message: data.message || "Error al actualizar el contrato",
      };
    }

    return {
      success: true,
      data: data,
      message: "Contrato actualizado exitosamente",
    };
  } catch (error) {
    console.error("Error updating contract:", error);
    return {
      success: false,
      error: true,
      message: "Error al actualizar el contrato",
    };
  }
}
