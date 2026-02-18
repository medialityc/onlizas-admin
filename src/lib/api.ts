import { ApiError, ApiResponse } from "@/types/fetch/api";

export const isApiError = (error: unknown): error is ApiError => {
  if (error instanceof ApiError) return true;
  return false;
};

export const handleApiServerError = async <T>(
  response: Response,
): Promise<ApiResponse<T>> => {
  try {
    const contentType = response.headers.get("content-type");
    console.log(response);
    if (response.status === 401) {
      // await refreshServerSession();
      return {
        error: true,
        status: response.status,
        message: "No autorizado. Por favor, inicia sesión nuevamente.",
      };
    }
    if (response.status === 403) {
      // await refreshServerSession();
      return {
        error: true,
        status: response.status,
        message: "No autorizado. No cumples con los permisos necesarios.",
      };
    }

    if (contentType?.includes("application/json")) {
      const error = await response.json();
      console.error("API Error:", { error, url: response.url });
      return {
        error: true,
        status: response.status,
        message: getErrorMessage(error),
      };
    } else {
      const errorText = await response.text();
      console.error("API Error on text:", {
        error: errorText,
        url: response,
      });

      let message = errorText || "Ocurrió un error inesperado";
      try {
        const maybeJson = JSON.parse(errorText);
        message = getErrorMessage(maybeJson);
      } catch {
        // keep message as text
      }
      console.error("API Error on text:", {
        error: errorText,
        url: response.url,
      });
      return {
        error: true,
        status: response.status,
        message,
      };
    }
  } catch (err) {
    console.error("Error parsing response:", err, response.url);
    return {
      error: true,
      status: response.status,
      message: "Unexpected server error",
    };
  }
};

export const buildApiResponseAsync = async <T>(
  response: Response,
): Promise<ApiResponse<T>> => {
  try {
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return {
        data: null as unknown as T,
        error: false,
        status: response.status,
      };
    }

    const data = await response.json();
    return {
      data,
      error: false,
      status: response.status,
    };
  } catch (e) {
    if (isApiError(e)) {
      return { ...e, title: e.title, error: true };
    }
    return { status: 500, error: true };
  }
};

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    // try parse JSON string
    try {
      const parsed = JSON.parse(error);
      return getErrorMessage(parsed);
    } catch {
      return error;
    }
  }
  if (error instanceof Error) return error.message;
  if (error instanceof ApiError) return error.detail;
  if (isApiError(error)) return error.detail;
  // Backend common shape: { statusCode, message, errors: { field: [msg] } }
  if (typeof error === "object" && error && !Array.isArray(error)) {
    const anyErr = error as Record<string, any>;

    // Priorizar el campo 'detail' si existe, luego message, title
    const baseMessage: string | undefined =
      anyErr.detail || anyErr.message || anyErr.title;

    const errorsMap = anyErr.errors;

    // Caso 1: errors como array de objetos { name, reason, ... }
    if (Array.isArray(errorsMap)) {
      const fieldMessages: string[] = [];
      for (const item of errorsMap) {
        if (!item || typeof item !== "object") continue;
        const name = (item as any).name || (item as any).field;
        const reason =
          (item as any).reason ||
          (item as any).message ||
          (item as any).detail ||
          (item as any).code;

        if (name && reason) fieldMessages.push(`${name}: ${reason}`);
        else if (reason) fieldMessages.push(reason);
      }
      if (fieldMessages.length > 0) {
        return fieldMessages.join(" | ");
      }
    }

    // Caso 2: errors como objeto { field: ["msg"] }
    if (
      errorsMap &&
      typeof errorsMap === "object" &&
      !Array.isArray(errorsMap)
    ) {
      const fieldMessages: string[] = [];
      for (const [field, messages] of Object.entries(errorsMap)) {
        if (Array.isArray(messages)) {
          fieldMessages.push(`${field}: ${messages.join(", ")}`);
        } else if (typeof messages === "string") {
          fieldMessages.push(`${field}: ${messages}`);
        }
      }
      if (fieldMessages.length > 0) {
        return fieldMessages.join(" | ");
      }
    }
    if (baseMessage) return baseMessage;
  }
  if (Array.isArray(error)) {
    // array of error objects or strings
    return (error as any[])
      .map((e) => {
        if (typeof e === "string") return e;
        if (!e || typeof e !== "object") return undefined;
        const anyE = e as any;
        const name = anyE.name || anyE.field;
        const reason = anyE.reason || anyE.message || anyE.detail || anyE.code;
        if (name && reason) return `${name}: ${reason}`;
        return reason;
      })
      .filter(Boolean)
      .join(", ");
  }
  return "Ocurrió un error inesperado...";
};
