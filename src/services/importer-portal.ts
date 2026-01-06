"use server";
// Validación simple de IDs para rutas (alfanumérico, guion, guion bajo)
function isValidId(id: string) {
  return /^[A-Za-z0-9_-]+$/.test(id);
}

import { backendRoutes } from "@/lib/endpoint";
import { cookies } from "next/headers";

const IMPORTER_TOKEN_COOKIE = "importer_access_token";
const IMPORTER_ID_COOKIE = "importer_id";

async function getImporterToken(): Promise<{
  token: string;
  importerId: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(IMPORTER_TOKEN_COOKIE)?.value;
  const importerId = cookieStore.get(IMPORTER_ID_COOKIE)?.value;

  if (!token || !importerId) {
    return null;
  }

  return { token, importerId };
}

// Allowlist de patrones de rutas permitidas para el portal de importadoras
// Solo estas rutas pueden ser accedidas a través de importerFetch
const ALLOWED_PATH_PATTERNS: RegExp[] = [
  // Rutas de importer-access
  /^\/importer-access\/validate$/,
  /^\/importer-access\/data$/,
  /^\/importer-access\/contracts$/,
  /^\/importer-access\/pending-contracts$/,
  /^\/importer-access\/contracts\/[A-Za-z0-9_-]+\/approve$/,
  /^\/importer-access\/contracts\/[A-Za-z0-9_-]+\/reject$/,
  /^\/importer-access\/[A-Za-z0-9_-]+\/generate-qr$/,
  /^\/importer-access\/[A-Za-z0-9_-]+\/sessions$/,
  /^\/importer-access\/[A-Za-z0-9_-]+\/revoke$/,
  /^\/importer-access\/nomenclators\/[A-Za-z0-9_-]+$/,
  /^\/importer-access\/nomenclators\/[A-Za-z0-9_-]+\/toggle-status$/,
  /^\/importer-access\/categories$/,
  // Rutas de importer-contracts
  /^\/importer-contracts$/,
  /^\/importer-contracts\/[A-Za-z0-9_-]+$/,
  /^\/importer-contracts\/[A-Za-z0-9_-]+\/approve$/,
  /^\/importer-contracts\/[A-Za-z0-9_-]+\/reject$/,
  /^\/importer-contracts\/[A-Za-z0-9_-]+\/nomenclators$/,
  // Rutas de importers
  /^\/importers\/[A-Za-z0-9_-]+$/,
  /^\/importers\/[A-Za-z0-9_-]+\/contracts$/,
];

function isAllowedPath(pathname: string): boolean {

  const normalizedPath = pathname.replace(/\/+$/, "");

  return ALLOWED_PATH_PATTERNS.some(pattern => pattern.test(normalizedPath));
}

function validateAndConstructUrl(inputUrl: string, baseUrl: string): string {
  const baseUrlObj = new URL(baseUrl);
  const trustedHost = baseUrlObj.hostname;
  const trustedProtocol = baseUrlObj.protocol;
  
  let pathname: string;
  let search: string;
  
  try {
    if (inputUrl.startsWith("http://") || inputUrl.startsWith("https://")) {
      const urlObj = new URL(inputUrl);

      if (urlObj.hostname !== trustedHost) {
        throw new Error("Host no permitido");
      }
      
      pathname = urlObj.pathname;
      search = urlObj.search;
    } else {

      const urlObj = new URL(inputUrl, baseUrl);
      pathname = urlObj.pathname;
      search = urlObj.search;
    }

    if (!isAllowedPath(pathname)) {
      throw new Error("Ruta no permitida");
    }
    
    return `${trustedProtocol}//${trustedHost}${pathname}${search}`;
    
  } catch (error) {
    if (error instanceof Error && error.message !== "Ruta no permitida" && error.message !== "Host no permitido") {
      throw new Error("URL malformada");
    }
    throw error;
  }
}

async function importerFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const auth = await getImporterToken();

  if (!auth) {
    throw new Error("No hay sesión activa de importadora");
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL no está configurado");
  }
  
  // Validar y construir URL segura usando allowlist
  const safeUrl = validateAndConstructUrl(url, baseUrl);

  const headers: Record<string, string> = {
    "X-Importer-Session-Token": auth.token,
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  return fetch(safeUrl, {
    ...options,
    headers,
  });
}

export { importerFetch };

export type ImporterContract = {
  id: string;
  importerId: string;
  importerName: string;
  approvalProcessId: string;
  approvalProcessName: string;
  status: "Pending" | "Approved" | "Rejected" | "Expired";
  startDate: string;
  endDate: string;
  createdAt: string;
  rejectionReason?: string;
  approvedAt?: string;
  approvalProcessUser?: {
    userId: string;
    userName: string;
    userEmail: string;
  };
  nomenclators?: ImporterNomenclator[];
};

export type NomenclatorFeature = {
  featureId: string;
  featureName: string;
  featureDescription: string;
  suggestions: string[];
  isRequired: boolean;
  isPrimary: boolean;
};

export type NomenclatorCategory = {
  id: string;
  name: string;
  active: boolean;
  departmentId: string;
  departmentName: string;
  description: string;
  image: string;
  features: NomenclatorFeature[];
};

export type ImporterNomenclator = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  categories: NomenclatorCategory[];
};

export type ImporterData = {
  importerId: string;
  importerName: string;
  isActive: boolean;
  nomenclators: ImporterNomenclator[];
  contracts: ImporterContract[];
  accessedAt: string;
  sessionExpiresAt: string;
};

export type ContractResponse = {
  success: boolean;
  data?: ImporterContract[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  message?: string;
  error?: boolean;
};

export type ImporterDataResponse = {
  success: boolean;
  data?: ImporterData;
  message?: string;
  error?: boolean;
};

export async function getImporterData(): Promise<ImporterDataResponse> {
  try {
    const response = await importerFetch(backendRoutes.importerAccess.getData);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: true,
        message:
          errorData.message || "Error al obtener datos de la importadora",
      };
    }

    const responseData = await response.json();

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error("Error getting importer data:", error);
    return {
      success: false,
      error: true,
      message: "Error al obtener datos de la importadora",
    };
  }
}

export async function getImporterContracts(
  importerId: string,
  params?: { page?: number; pageSize?: number; search?: string }
): Promise<ContractResponse> {
  if (!isValidId(importerId)) {
    return {
      success: false,
      error: true,
      message: "ID de importadora inválido",
    };
  }
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());
    if (params?.search) queryParams.append("search", params.search);

    const url = `${backendRoutes.importers.getById(importerId)}/contracts${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await importerFetch(url);

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: true,
        message: responseData.message || "Error al obtener contratos",
      };
    }

    return {
      success: true,
      data: responseData.data || [],
      totalCount: responseData.totalCount,
      page: responseData.page,
      pageSize: responseData.pageSize,
    };
  } catch (error) {
    console.error("Error getting importer contracts:", error);
    return {
      success: false,
      error: true,
      message: "Error al obtener contratos",
    };
  }
}

export async function getPendingContracts(
  importerId: string,
  params?: { page?: number; pageSize?: number; search?: string }
): Promise<ContractResponse> {
  if (!isValidId(importerId)) {
    return {
      success: false,
      error: true,
      message: "ID de importadora inválido",
    };
  }
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());
    if (params?.search) queryParams.append("search", params.search);

    const url = `${backendRoutes.importerAccess.pendingContracts}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await importerFetch(url);

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: true,
        message:
          responseData.message || "Error al obtener contratos pendientes",
      };
    }

    return {
      success: true,
      data: responseData.data || [],
      totalCount: responseData.totalCount,
      page: responseData.page,
      pageSize: responseData.pageSize,
    };
  } catch (error) {
    console.error("Error getting pending contracts:", error);
    return {
      success: false,
      error: true,
      message: "Error al obtener contratos pendientes",
    };
  }
}

export async function getContractDetail(
  contractId: string
): Promise<ContractResponse> {
  if (!isValidId(contractId)) {
    return {
      success: false,
      error: true,
      message: "ID de contrato inválido",
    };
  }
  try {
    const response = await importerFetch(
      backendRoutes.importerContracts.getById(contractId)
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: true,
        message: data.message || "Error al obtener detalle del contrato",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error getting contract detail:", error);
    return {
      success: false,
      error: true,
      message: "Error al obtener detalle del contrato",
    };
  }
}

export async function approveContract(
  contractId: string
): Promise<ContractResponse> {
  if (!isValidId(contractId)) {
    return {
      success: false,
      error: true,
      message: "ID de contrato inválido",
    };
  }
  try {
    const response = await importerFetch(
      backendRoutes.importerAccess.approveContract(contractId),
      { method: "POST" }
    );

    const data = await response.json();

    // Verificar si la respuesta es exitosa (200-299) o tiene un indicador de éxito
    if (response.ok || response.status === 200 || data.success !== false) {
      return {
        success: true,
        data,
        message: data.message || "Contrato aprobado exitosamente",
      };
    }

    return {
      success: false,
      error: true,
      message: data.message || "Error al aprobar contrato",
    };
  } catch (error) {
    console.error("Error approving contract:", error);
    return {
      success: false,
      error: true,
      message: "Error al aprobar contrato",
    };
  }
}

export async function rejectContract(
  contractId: string,
  reason: string
): Promise<ContractResponse> {
  if (!isValidId(contractId)) {
    return {
      success: false,
      error: true,
      message: "ID de contrato inválido",
    };
  }
  try {
    const response = await importerFetch(
      backendRoutes.importerAccess.rejectContract(contractId),
      {
        method: "POST",
        body: JSON.stringify({ reason }),
      }
    );

    const data = await response.json();

    // Verificar si la respuesta es exitosa (200-299) o tiene un indicador de éxito
    if (response.ok || response.status === 200 || data.success !== false) {
      return {
        success: true,
        data,
        message: data.message || "Contrato rechazado",
      };
    }

    return {
      success: false,
      error: true,
      message: data.message || "Error al rechazar contrato",
    };
  } catch (error) {
    console.error("Error rejecting contract:", error);
    return {
      success: false,
      error: true,
      message: "Error al rechazar contrato",
    };
  }
}

export async function addNomenclatorsToContract(
  contractId: string,
  nomenclatorIds: string[]
): Promise<ContractResponse> {
  if (!isValidId(contractId)) {
    return {
      success: false,
      error: true,
      message: "ID de contrato inválido",
    };
  }
  try {
    const response = await importerFetch(
      `${backendRoutes.importerContracts.getById(contractId)}/nomenclators`,
      {
        method: "POST",
        body: JSON.stringify({ nomenclatorIds }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: true,
        message: data.message || "Error al agregar nomencladores",
      };
    }

    return {
      success: true,
      data,
      message: "Nomencladores agregados exitosamente",
    };
  } catch (error) {
    console.error("Error adding nomenclators to contract:", error);
    return {
      success: false,
      error: true,
      message: "Error al agregar nomencladores",
    };
  }
}

export async function getImporterNomenclators(): Promise<ContractResponse> {
  try {
    const endpoint = backendRoutes.importerAccess.getData;
    const response = await importerFetch(endpoint);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: true,
        message: data.message || "Error al obtener nomencladores",
      };
    }

    const nomenclators = data.nomenclators || data.data?.nomenclators || [];

    return {
      success: true,
      data: nomenclators,
    };
  } catch (error) {
    console.error("Error getting importer nomenclators:", error);
    return {
      success: false,
      error: true,
      message: "Error al obtener nomencladores",
    };
  }
}

export type UpdateNomenclatorPayload = {
  name: string;
  categoryIds: string[];
};

export type NomenclatorResponse = {
  success: boolean;
  data?: any;
  message?: string;
  error?: boolean;
};

export async function updateImporterNomenclator(
  id: string,
  data: UpdateNomenclatorPayload
): Promise<NomenclatorResponse> {
  if (!isValidId(id)) {
    return {
      success: false,
      error: true,
      message: "ID de nomenclador inválido",
    };
  }
  try {
    const response = await importerFetch(
      backendRoutes.importerAccess.updateNomenclator(id),
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: true,
        message: responseData.message || "Error al actualizar nomenclador",
      };
    }

    return {
      success: true,
      data: responseData,
      message: "Nomenclador actualizado exitosamente",
    };
  } catch (error) {
    console.error("Error updating nomenclator:", error);
    return {
      success: false,
      error: true,
      message: "Error al actualizar nomenclador",
    };
  }
}

export async function toggleImporterNomenclatorStatus(
  id: string
): Promise<NomenclatorResponse> {
  if (!isValidId(id)) {
    return {
      success: false,
      error: true,
      message: "ID de nomenclador inválido",
    };
  }
  try {
    const response = await importerFetch(
      backendRoutes.importerAccess.toggleNomenclatorStatus(id),
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("[toggleImporterNomenclatorStatus] error data:", errorData);
      return {
        success: false,
        error: true,
        message: errorData.message || "Error al cambiar estado del nomenclador",
      };
    }

    const responseData = await response.json().catch(() => ({}));

    return {
      success: true,
      data: responseData,
      message: "Estado del nomenclador actualizado",
    };
  } catch (error) {
    console.error("Error toggling nomenclator status:", error);
    return {
      success: false,
      error: true,
      message: "Error al cambiar estado del nomenclador",
    };
  }
}
