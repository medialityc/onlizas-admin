import { ApiError, ApiResponse } from "@/types/fetch/api";

export const isApiError = (error: unknown): error is ApiError => {
  if (error instanceof ApiError) return true;
  return false;
};

export const handleApiServerError = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  try {
    const contentType = response.headers.get("content-type");

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
  response: Response
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
    const baseMessage: string | undefined =
      anyErr.message || anyErr.title || anyErr.detail;
    const errorsMap = anyErr.errors;
    if (errorsMap && typeof errorsMap === "object") {
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
      .map((e) => (typeof e === "string" ? e : e?.detail || e?.message))
      .filter(Boolean)
      .join(", ");
  }
  return "Ocurrió un error inesperado...";
};
