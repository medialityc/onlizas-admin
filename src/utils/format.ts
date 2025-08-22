/**
 * Utility functions for formatting data
 */

/**
 * Format a date string or Date object to locale string
 */
export function formatDate(
  date: string | Date,
  locale: string = "es-ES"
): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "-";
  }
}

/**
 * Format a date string or Date object to datetime string
 */
export function formatDateTime(
  date: string | Date,
  locale: string = "es-ES"
): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "EUR",
  locale: string = "es-ES"
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

/**
 * Format number with thousands separators
 */
export function formatNumber(num: number, locale: string = "es-ES"): string {
  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch {
    return num.toString();
  }
}

/**
 * Format percentage with specified decimal places
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Check if it's a Spanish phone number (9 digits starting with 6, 7, or 9)
  if (cleaned.length === 9 && /^[679]/.test(cleaned)) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
  }

  // Check if it's an international number with Spanish country code (+34)
  if (cleaned.length === 11 && cleaned.startsWith("34")) {
    const national = cleaned.substring(2);
    return `+34 ${national.substring(0, 3)} ${national.substring(3, 6)} ${national.substring(6)}`;
  }

  // Return original if doesn't match expected patterns
  return phone;
}

/**
 * Get initials from full name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: string | Date,
  locale: string = "es"
): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - dateObj.getTime()) / 1000
    );

    const intervals = [
      {
        label: locale === "es" ? "año" : "year",
        seconds: 31536000,
        plural: locale === "es" ? "años" : "years",
      },
      {
        label: locale === "es" ? "mes" : "month",
        seconds: 2592000,
        plural: locale === "es" ? "meses" : "months",
      },
      {
        label: locale === "es" ? "día" : "day",
        seconds: 86400,
        plural: locale === "es" ? "días" : "days",
      },
      {
        label: locale === "es" ? "hora" : "hour",
        seconds: 3600,
        plural: locale === "es" ? "horas" : "hours",
      },
      {
        label: locale === "es" ? "minuto" : "minute",
        seconds: 60,
        plural: locale === "es" ? "minutos" : "minutes",
      },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count > 0) {
        const unit = count === 1 ? interval.label : interval.plural;
        const suffix = locale === "es" ? "hace" : "ago";
        return locale === "es"
          ? `${suffix} ${count} ${unit}`
          : `${count} ${unit} ${suffix}`;
      }
    }

    return locale === "es" ? "ahora mismo" : "just now";
  } catch {
    return "-";
  }
}

/**
 * Convert a URL to a File object
 * @param url The URL to convert
 * @param filename Optional filename, if not provided it will be extracted from URL
 * @returns Promise<File> The File object
 */
export async function urlToFile(url: string, filename?: string): Promise<File> {
  try {
    // Fetch the URL
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the blob from response
    const blob = await response.blob();

    // Extract filename from URL if not provided
    let finalFilename = filename;
    if (!finalFilename) {
      const urlParts = url.split("/");
      finalFilename = urlParts[urlParts.length - 1];

      // If no extension found, try to get it from content type
      if (!finalFilename.includes(".")) {
        const contentType = response.headers.get("content-type");
        if (contentType) {
          if (
            contentType.includes("image/jpeg") ||
            contentType.includes("image/jpg")
          ) {
            finalFilename += ".jpg";
          } else if (contentType.includes("image/png")) {
            finalFilename += ".png";
          } else if (contentType.includes("image/gif")) {
            finalFilename += ".gif";
          } else if (contentType.includes("image/webp")) {
            finalFilename += ".webp";
          } else if (contentType.includes("image/svg")) {
            finalFilename += ".svg";
          } else {
            finalFilename += ".file";
          }
        } else {
          finalFilename += ".file";
        }
      }
    }

    // Create and return File object
    return new File([blob], finalFilename, {
      type: blob.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    throw new Error(
      `Error converting URL to File: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Check if a string is a valid URL
 * @param string The string to validate
 * @returns boolean
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert File to Base64 string
 * @param file The File object to convert
 * @returns Promise<string> Base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
  });
}

export function detailsArrayToObject(
  arr: Array<{ key: string; value: string }>,
  {
    trim = true,
    skipEmpty = true,
    max = 50,
  }: { trim?: boolean; skipEmpty?: boolean; max?: number } = {}
) {
  const out: Record<string, string> = {};
  for (const item of arr.slice(0, max)) {
    if (!item) continue;
    let k = item.key ?? "";
    let v = item.value ?? "";
    if (trim) {
      k = k.trim();
      v = v.trim();
    }
    if (!k) continue;
    if (skipEmpty && !v) continue;
    // Último gana si hay duplicado
    out[k] = v;
  }
  return out;
}

/**
 * Convierte un objeto de detalles (diccionario) a un array de pares {key,value}
 * Compatible con el componente de edición dinámico.
 */
export function detailsObjectToArray(
  obj: Record<string, any> | null | undefined,
  {
    trimKeys = true,
    trimValues = true,
    skipEmpty = true,
    max = 50,
    sort = "none",
  }: {
    trimKeys?: boolean;
    trimValues?: boolean;
    skipEmpty?: boolean;
    max?: number;
    sort?: "none" | "asc" | "desc";
  } = {}
): Array<{ key: string; value: string }> {
  if (!obj || typeof obj !== "object") return [];
  let entries = Object.keys(obj).map((k) => {
    let key = k;
    let value = obj[k];
    if (trimKeys) key = key.trim();
    if (value == null) value = "";
    else if (typeof value !== "string") value = String(value);
    if (trimValues) value = value.trim();
    return { key, value };
  });

  if (skipEmpty) {
    entries = entries.filter((e) => e.key && e.value);
  } else {
    entries = entries.filter((e) => e.key); // siempre necesita clave
  }

  if (sort !== "none") {
    entries.sort(
      (a, b) => a.key.localeCompare(b.key) * (sort === "asc" ? 1 : -1)
    );
  }

  if (entries.length > max) entries = entries.slice(0, max);
  return entries;
}
