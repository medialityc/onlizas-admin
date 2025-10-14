// Utilidad para verificar si un valor es un archivo (File o Blob)
export function isFileLike(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    (Object.prototype.toString.call(value) === "[object File]" ||
      Object.prototype.toString.call(value) === "[object Blob]")
  );
}
