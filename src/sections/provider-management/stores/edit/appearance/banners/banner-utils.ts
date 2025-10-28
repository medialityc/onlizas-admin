// Constantes y utilidades para banners
export const POSITION_LABELS: Record<number, string> = {
  0: "Hero (Principal)",
  1: "Sidebar",
  2: "Footer",
};

export const normalizePosition = (pos: unknown): number => {
  if (typeof pos === "number" && Number.isFinite(pos)) return pos;
  if (typeof pos === "string") {
    // Try parsing as number first
    const num = parseInt(pos, 10);
    if (!Number.isNaN(num) && Number.isFinite(num)) return num;

    // Map string enums to numbers
    const normalized = pos.toLowerCase().trim();
    if (normalized === "hero" || normalized === "0") return 0;
    if (normalized === "sidebar" || normalized === "1") return 1;
    if (normalized === "footer" || normalized === "2") return 2;
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

// Genera un ID temporal negativo único para banners creados en UI
export const createTempBannerId = (): number => {
  // Combina timestamp y aleatorio para minimizar colisiones y siempre negativo
  const base = Date.now() % 1_000_000_000;
  const rnd = Math.floor(Math.random() * 10_000);
  return -1 * (base * 10_000 + rnd);
};
