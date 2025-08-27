// Constantes y utilidades para banners
export const POSITION_LABELS: Record<number, string> = {
  1: "Hero (Principal)",
  2: "Sidebar",
  3: "Slideshow",
};

export const normalizePosition = (pos: unknown): number => {
  if (typeof pos === "number" && Number.isFinite(pos)) return pos;
  if (typeof pos === "string") {
    // Try parsing as number first
    const num = parseInt(pos, 10);
    if (!Number.isNaN(num) && Number.isFinite(num)) return num;

    // Map string enums to numbers
    const normalized = pos.toLowerCase().trim();
    if (normalized === "hero" || normalized === "1") return 1;
    if (normalized === "sidebar" || normalized === "2") return 2;
    if (normalized === "footer" || normalized === "3") return 3;
  }
  return 1; // Default to Hero if can't parse
};

export const getPositionLabel = (pos: number): string => {
  return POSITION_LABELS[pos] || `Posición ${pos}`;
};

export const toISOString = (d?: Date | null): string => {
  if (!d) return new Date().toISOString();
  return d instanceof Date ? d.toISOString() : new Date(d).toISOString();
};
