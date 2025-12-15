"use server";

import { backendRoutes } from "@/lib/endpoint";
import { cookies } from "next/headers";

const IMPORTER_TOKEN_COOKIE = "importer_access_token";
const IMPORTER_ID_COOKIE = "importer_id";
const IMPORTER_EXPIRES_COOKIE = "importer_expires_at";

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

export type ImporterData = {
  importerId: string;
  importerName: string;
  isActive: boolean;
  nomenclators: Array<{
    id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    categories: Array<{
      id: string;
      name: string;
      active: boolean;
      departmentId: string;
      departmentName: string;
      description: string;
      image: string;
      features: Array<{
        featureId: string;
        featureName: string;
        featureDescription: string;
        suggestions: string[];
        isRequired: boolean;
        isPrimary: boolean;
      }>;
    }>;
  }>;
  contracts: Array<{
    id: string;
    importerId: string;
    importerName: string;
    supplierId: string;
    supplierName: string;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
  }>;
  accessedAt: string;
  sessionExpiresAt: string;
};

export async function validateImporterAccess(
  importerId: string,
  code: string
): Promise<ValidateResponse> {
  try {
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
      expiresAt = Date.now() + (data.expiresIn * 1000);
    } else {
      expiresAt = Date.now() + (3600 * 1000); 
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
    const importerId = cookieStore.get(IMPORTER_ID_COOKIE)?.value;

    if (!token || !importerId) {
      return {
        error: true,
        message: "No hay sesión activa",
      };
    }

    const response = await fetch(backendRoutes.importerAccess.getData(importerId), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    console.log("getImporterData response status:", response.status);
    console.log("getImporterData request headers:", {
      Authorization: `Bearer ${token.substring(0, 20)}...`,
      importerId,
      url: backendRoutes.importerAccess.getData(importerId),
    });

    const text = await response.text();
    console.log("getImporterData response text:", text.substring(0, 500));

    if (!text) {
      return {
        error: true,
        message: "Respuesta vacía del servidor",
      };
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return {
        error: true,
        message: "Respuesta inválida del servidor",
      };
    }

    if (!response.ok || data.error) {
      return {
        error: true,
        message: data.message || "Error al obtener los datos",
      };
    }

    return {
      data: data,
    };
  } catch (error) {
    console.error("Error getting importer data:", error);
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

export async function getImporterSessions(
  importerId: string
): Promise<{
  data?: ImporterSession[];
  error?: boolean;
  message?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(IMPORTER_TOKEN_COOKIE)?.value;

    if (!token) {
      return {
        error: true,
        message: "No hay sesión activa",
      };
    }

    const response = await fetch(backendRoutes.importerAccess.sessions(importerId), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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

export async function generateImporterQR(
  importerId: string
): Promise<{
  data?: QRCodeResponse;
  error?: boolean;
  message?: string;
}> {
  try {
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
