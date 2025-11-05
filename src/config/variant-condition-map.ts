// Mapa de condiciones de productos/variantes reutilizable
// Claves numéricas provenientes del backend
export const variantConditionMap: Record<number, string> = {
  1: "Usado: como nuevo",
  2: "Usado: muy bueno",
  3: "Usado: buen estado",
  4: "Usado: aceptable",
  5: "Usado: tal cual",
  6: "Nuevo",
  7: "Reacondicionado",
};

export function getVariantConditionLabel(value?: number | null): string {
  if (!value) return "-";
  return variantConditionMap[value] || "-";
}
