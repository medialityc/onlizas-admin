"use client";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import BreadcrumbLinks, { BreadcrumbItem } from "./breadcrumbs";

// Mapa de etiquetas legibles para segmentos de ruta.
const LABEL_MAP: (hasParent: boolean) => Record<string, string> = (
  hasParent: boolean,
) => ({
  dashboard: "Dashboard",
  users: "Usuarios",
  roles: "Roles",
  permissions: "Permisos",
  subsystems: "Subsistemas",
  businesses: "Negocios",
  documents: "Documentos",
  templates: "Plantillas",
  edit: "Editar",
  create: "Crear",
  new: "Nuevo",
  "order-status": "Estados de orden",
  dispatch: "Despacho",
  reception: hasParent ? "Entrega" : "Recepción",
  parcels: "Bultos",
  orders: "Órdenes",
  summary: "Resumen",
  scan: "Escanear",
  "order-types": "Tipo de Orden",
  "accounts-payable": "Cuentas por pagar",
  "accounts-receivable": "Cuentas por cobrar",
  business: "Negocios",
  details: "Detalles",
  transfer: "Transferencias",
  "partial-closures": "Cierres parciales",
  "closures-report": "Cierres de reporte",
  "daily-closures": "Cierres diarios",
  categories: "Categorías",
  strategies: "Estrategias",
  products: "Productos",
  "hbl-range": "Rango HBL",
  units: "Unidades",
  "payment-methods": "Métodos de pago",
  "shipping-types": "Tipos de envío",
  countries: "Países",
  transports: "Transportes",
  ports: "Puertos marítimos",
  airports: "Aeropuertos",
  airlines: "Aerolíneas",
  airwaybills: "Guías aéreas",
  "shipping-lines": "Líneas marítimas",
  "land-fleets": "Flotas terrestres",
  "land-terminals": "Terminales terrestres",
  "land-waybills": "Guías terrestres",
  states: "Estados",
  districts: "Distritos",
  "maritime-bills-of-lading": "B/L marítimos",
  cargoUnits: "Unidades de carga",
  closure: "Cierres",
  labels: "Factura",
  "shipping-agents": "Transitarias",
  list: "Lista",
});

// Detecta si un segmento es un valor dinámico (id numérico, uuid, hash largo, etc.)
function isDynamicValue(segment: string) {
  if (!segment) return false;
  if (/^\d+$/.test(segment)) return true; // solo números
  if (/^[0-9a-fA-F-]{8,}$/.test(segment) && segment.includes("-")) return true; // uuid tipo 8-4-4-4-12
  // Cadenas largas alfanuméricas que contengan al menos un dígito (evita palabras como "businesses")
  if (/^[0-9a-zA-Z]{10,}$/.test(segment) && /\d/.test(segment)) return true; // hash/alfanum largo con números
  return false;
}

function segmentToLabel(segment: string, hasParent: boolean): string {
  const labels = LABEL_MAP(hasParent);
  if (labels[segment]) return labels[segment];
  if (isDynamicValue(segment)) return segment;
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

interface AutoBreadcrumbsProps {
  finalLabelOverride?: string; // Permite sobreescribir el último label
  showOnRoot?: boolean; // Mostrar en /dashboard (por defecto false)
  /**
   * Permite sobreescribir el label de UN segmento específico por su valor literal.
   * Ej: segmentOverrides={{ [userId]: userName }} reemplaza el id por el nombre.
   */
  segmentOverrides?: Record<string, string>;
  /**
   * Callback avanzada para resolver el label de cualquier segmento.
   * Si retorna undefined/null se usa la lógica normal.
   */
  segmentLabelResolver?: (args: {
    segment: string;
    index: number;
    segments: string[];
  }) => string | undefined | null;
}

const AutoBreadcrumbs: React.FC<AutoBreadcrumbsProps> = ({
  finalLabelOverride,
  showOnRoot = false,
  segmentOverrides,
  segmentLabelResolver,
}) => {
  const pathname = usePathname();
  const hasParent = false;

  const items: BreadcrumbItem[] = useMemo(() => {
    if (!pathname) return [];
    const segments = pathname.split("/").filter(Boolean);
    const dashboardIndex = segments.indexOf("dashboard");
    if (dashboardIndex === -1) return [];

    const relevant = segments.slice(dashboardIndex);
    if (relevant.length === 1 && !showOnRoot) return [];

    // Build cumulative hrefs including dynamic segments, but only show labels for non-dynamic segments
    const acc: BreadcrumbItem[] = [];
    let cumulativeSegments: string[] = [];

    relevant.forEach((seg, idx) => {
      cumulativeSegments.push(seg);
      const isLast = idx === relevant.length - 1;
      const dynamic = isDynamicValue(seg);

      // Only show breadcrumb for non-dynamic segments, but href includes all segments up to this point
      if (!dynamic) {
        // 1) Override literal por diccionario
        let label: string | undefined | null = segmentOverrides?.[seg];
        // 2) Resolver dinámico vía callback si no lo resolvió el diccionario
        if (label == null && segmentLabelResolver) {
          label = segmentLabelResolver({
            segment: seg,
            index: idx,
            segments: relevant,
          });
        }
        // 3) Fallback a label normal
        if (label == null) {
          label = segmentToLabel(seg, hasParent);
        }
        if (isLast && finalLabelOverride) label = finalLabelOverride;
        const href = !isLast ? "/" + cumulativeSegments.join("/") : undefined;
        acc.push({ label: String(label), linkTo: href });
      }
    });
    return acc;
  }, [
    pathname,
    finalLabelOverride,
    showOnRoot,
    segmentOverrides,
    segmentLabelResolver,
  ]);

  if (!items.length) return null;
  return (
    <div className="p-4 pb-0">
      <BreadcrumbLinks items={items} />
    </div>
  );
};

export default AutoBreadcrumbs;
