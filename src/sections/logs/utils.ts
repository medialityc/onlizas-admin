// Small helper to normalize onRowClick payloads from Mantine DataTable
// Mantine can pass either the raw record or a wrapper { event, index, record }
export function extractRecord<T>(rowOrWrapper: any): T | null {
  if (!rowOrWrapper) return null;
  if (typeof rowOrWrapper === "object" && "record" in rowOrWrapper) {
    return rowOrWrapper.record as T;
  }
  return rowOrWrapper as T;
}
