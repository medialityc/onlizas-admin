"use server";

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

async function importerFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const auth = await getImporterToken();

  if (!auth) {
    throw new Error("No hay sesión activa de importadora");
  }

  console.log("=== IMPORTER FETCH ===");
  console.log("📍 URL:", url);
  console.log("🔑 Token presente:", !!auth.token);
  console.log(
    "🔑 Token (primeros 50 chars):",
    auth.token.substring(0, 50) + "..."
  );
  console.log("👤 Importer ID:", auth.importerId);

  const headers: Record<string, string> = {
    "X-Importer-Session-Token": auth.token,
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  console.log("📤 Headers que se enviarán:", headers);
  console.log("=====================");

  return fetch(url, {
    ...options,
    headers,
  });
}

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

    console.log("getImporterData - Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("getImporterData - Error data:", errorData);
      return {
        success: false,
        error: true,
        message:
          errorData.message || "Error al obtener datos de la importadora",
      };
    }

    const responseData = await response.json();
    console.log("getImporterData - Response data:", responseData);

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
  try {
    console.log("=== APPROVE CONTRACT ===");
    console.log("Contract ID:", contractId);
    console.log(
      "Endpoint:",
      backendRoutes.importerAccess.approveContract(contractId)
    );

    const response = await importerFetch(
      backendRoutes.importerAccess.approveContract(contractId),
      { method: "POST" }
    );

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    const data = await response.json();
    console.log("Response data:", data);
    console.log("========================");

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
  try {
    console.log("=== REJECT CONTRACT ===");
    console.log("Contract ID:", contractId);
    console.log("Reason:", reason);
    console.log(
      "Endpoint:",
      backendRoutes.importerAccess.rejectContract(contractId)
    );

    const response = await importerFetch(
      backendRoutes.importerAccess.rejectContract(contractId),
      {
        method: "POST",
        body: JSON.stringify({ reason }),
      }
    );

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    const data = await response.json();
    console.log("Response data:", data);
    console.log("========================");

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
  try {
    const response = await importerFetch(
      backendRoutes.importerAccess.toggleNomenclatorStatus(id),
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
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
