import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  createWorkbook,
  addSummaryWorksheet,
  addDataWorksheet,
  downloadWorkbook,
} from "@/utils/exceljs-warehouse-styles";
import { formatCurrency } from "@/utils/format";
import type {
  InventoryProvider,
  InventoryProductItem,
} from "@/types/inventory";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtDT(val?: string | Date | null): string {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleString("es-ES");
  } catch {
    return String(val);
  }
}

function cur(n: number | null | undefined): string {
  return formatCurrency(n ?? 0, "USD");
}

// ─── PDF: lista de inventarios del almacén ─────────────────────────────────────

export function exportWarehouseInventoryListPdf(
  items: InventoryProvider[],
  warehouseName?: string,
) {
  const doc = new jsPDF({ orientation: "landscape" });
  const margin = 14;
  const pageH = doc.internal.pageSize.getHeight();
  let y = 20;

  const stepY = (need = 10) => {
    if (y + need > pageH - 20) {
      doc.addPage();
      y = 20;
    }
  };

  doc.setFontSize(16);
  doc.setTextColor(33);
  doc.text(
    warehouseName ? `Inventario — ${warehouseName}` : "Inventario del Almacén",
    margin,
    y,
  );
  y += 6;
  doc.setFontSize(8);
  doc.text(`Generado: ${fmtDT(new Date())}`, margin, y);
  y += 8;

  // Resumen por producto
  stepY(20);
  doc.setFontSize(12);
  doc.text("Productos en Inventario", margin, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [
      [
        "Producto",
        "Proveedor",
        "Tienda",
        "Cant. Total",
        "Precio Total",
        "Variantes",
        "Almacén",
        "Mayorista",
      ],
    ],
    body: items.map((i) => [
      i.parentProductName,
      i.supplierName,
      i.storeName,
      String(i.totalQuantity),
      cur(i.totalPrice),
      String(i.products?.length ?? 0),
      i.warehouseName,
      i.isMayorista ? "Sí" : "No",
    ]),
    theme: "grid",
    styles: { fontSize: 7 },
    headStyles: { fillColor: [224, 231, 255], textColor: 55 },
  });
  y = (doc as any).lastAutoTable?.finalY ?? y;
  y += 8;

  // Variantes por producto (agrupadas)
  for (const item of items) {
    if (!item.products?.length) continue;
    stepY(20);
    doc.setFontSize(11);
    doc.text(`Variantes: ${item.parentProductName}`, margin, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [
        [
          "SKU",
          "Nombre",
          "Stock",
          "Precio",
          "Precio Desc.",
          "Cond.",
          "Delivery",
          "Activo",
        ],
      ],
      body: item.products.map((p: InventoryProductItem) => [
        p.sku,
        p.productName,
        String(p.stock),
        cur(p.price),
        cur(p.discountedPrice),
        String(p.condition),
        p.deliveryMode ?? (p.deliveryType === 0 ? "ONLIZAS" : "PROVEEDOR"),
        p.isActive ? "Sí" : "No",
      ]),
      theme: "grid",
      styles: { fontSize: 7 },
      headStyles: { fillColor: [240, 248, 255], textColor: 55 },
    });
    y = (doc as any).lastAutoTable?.finalY ?? y;
    y += 6;
  }

  const namePart = warehouseName
    ? `-${warehouseName.replace(/\s+/g, "-").toLowerCase()}`
    : "";
  doc.save(`inventario${namePart}.pdf`);
}

// ─── Excel: lista de inventarios del almacén ──────────────────────────────────

export async function exportWarehouseInventoryListExcel(
  items: InventoryProvider[],
  warehouseName?: string,
) {
  const wb = createWorkbook();
  const title = warehouseName
    ? `Inventario — ${warehouseName}`
    : "Inventario del Almacén";

  // Hoja 1: Resumen de productos
  addDataWorksheet(
    wb,
    "Productos",
    title,
    [
      "Producto",
      "Proveedor",
      "Tienda",
      "Almacén",
      "Cant. Total",
      "Precio Total",
      "Variantes",
      "Mayorista",
    ],
    items.map((i) => [
      i.parentProductName,
      i.supplierName,
      i.storeName,
      i.warehouseName,
      i.totalQuantity,
      cur(i.totalPrice),
      i.products?.length ?? 0,
      i.isMayorista ? "Sí" : "No",
    ]),
    [32, 26, 22, 22, 14, 16, 12, 12],
  );

  // Hoja 2: Todas las variantes (una fila por SKU)
  const allVariants: (string | number)[][] = [];
  for (const item of items) {
    for (const p of item.products ?? []) {
      allVariants.push([
        item.parentProductName,
        item.supplierName,
        item.storeName,
        p.sku,
        p.productName,
        p.stock,
        cur(p.price),
        cur(p.discountedPrice),
        String(p.condition),
        p.deliveryMode ?? (p.deliveryType === 0 ? "ONLIZAS" : "PROVEEDOR"),
        p.isActive ? "Sí" : "No",
        p.upc ?? "—",
        p.ean ?? "—",
      ]);
    }
  }

  if (allVariants.length) {
    addDataWorksheet(
      wb,
      "Variantes",
      "Variantes de Inventario",
      [
        "Producto",
        "Proveedor",
        "Tienda",
        "SKU",
        "Nombre Variante",
        "Stock",
        "Precio",
        "Precio Desc.",
        "Condición",
        "Delivery",
        "Activo",
        "UPC",
        "EAN",
      ],
      allVariants,
      [28, 22, 18, 14, 28, 10, 14, 14, 12, 14, 10, 16, 16],
    );
  }

  const namePart = warehouseName
    ? `-${warehouseName.replace(/\s+/g, "-").toLowerCase()}`
    : "";
  await downloadWorkbook(wb, `inventario${namePart}.xlsx`);
}

// ─── PDF: detalle de un inventario (un InventoryProvider) ─────────────────────

export function exportInventoryProviderDetailPdf(item: InventoryProvider) {
  const doc = new jsPDF();
  const margin = 14;
  const pageH = doc.internal.pageSize.getHeight();
  let y = 20;

  const stepY = (need = 10) => {
    if (y + need > pageH - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // Cabecera del inventario
  doc.setFontSize(18);
  doc.setTextColor(33);
  doc.text(item.parentProductName, margin, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(
    `Proveedor: ${item.supplierName}   Tienda: ${item.storeName}   Almacén: ${item.warehouseName}`,
    margin,
    y,
  );
  y += 5;
  doc.text(
    `Cant. Total: ${item.totalQuantity}   Precio Total: ${cur(item.totalPrice)}   Mayorista: ${item.isMayorista ? "Sí" : "No"}`,
    margin,
    y,
  );
  y += 8;
  doc.setTextColor(0);

  // Resumen
  stepY(20);
  doc.setFontSize(12);
  doc.text("Variantes del Producto", margin, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [
      [
        "SKU",
        "Nombre",
        "Stock",
        "Precio",
        "Precio Desc.",
        "Condición",
        "Delivery",
        "Activo",
      ],
    ],
    body: (item.products ?? []).map((p: InventoryProductItem) => [
      p.sku,
      p.productName,
      String(p.stock),
      cur(p.price),
      cur(p.discountedPrice),
      String(p.condition),
      p.deliveryMode ?? (p.deliveryType === 0 ? "ONLIZAS" : "PROVEEDOR"),
      p.isActive ? "Sí" : "No",
    ]),
    theme: "grid",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [224, 231, 255], textColor: 55 },
  });
  y = (doc as any).lastAutoTable?.finalY ?? y;
  y += 8;

  // Variantes sin stock (advertencia)
  const sinStock = (item.products ?? []).filter(
    (p: InventoryProductItem) => p.stock === 0 || p.stock == null,
  );
  if (sinStock.length) {
    stepY(20);
    doc.setFontSize(12);
    doc.text("Variantes sin Stock", margin, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [["SKU", "Nombre", "Precio"]],
      body: sinStock.map((p: InventoryProductItem) => [
        p.sku,
        p.productName,
        cur(p.price),
      ]),
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [254, 242, 242], textColor: 156 },
    });
  }

  doc.save(
    `inventario-${item.parentProductName.replace(/\s+/g, "-").toLowerCase()}.pdf`,
  );
}

// ─── Excel: detalle de un inventario ─────────────────────────────────────────

export async function exportInventoryProviderDetailExcel(
  item: InventoryProvider,
) {
  const wb = createWorkbook();

  addSummaryWorksheet(wb, "Resumen", item.parentProductName, [
    ["Producto", item.parentProductName],
    ["Proveedor", item.supplierName],
    ["Tienda", item.storeName],
    ["Almacén", item.warehouseName],
    ["Cant. Total", String(item.totalQuantity)],
    ["Precio Total", cur(item.totalPrice)],
    ["Mayorista", item.isMayorista ? "Sí" : "No"],
    ["Total variantes", String(item.products?.length ?? 0)],
  ]);

  addDataWorksheet(
    wb,
    "Variantes",
    `Variantes — ${item.parentProductName}`,
    [
      "SKU",
      "Nombre",
      "Stock",
      "Precio",
      "Precio Desc.",
      "Condición",
      "Delivery",
      "Activo",
      "UPC",
      "EAN",
    ],
    (item.products ?? []).map((p: InventoryProductItem) => [
      p.sku,
      p.productName,
      p.stock,
      cur(p.price),
      cur(p.discountedPrice),
      String(p.condition),
      p.deliveryMode ?? (p.deliveryType === 0 ? "ONLIZAS" : "PROVEEDOR"),
      p.isActive ? "Sí" : "No",
      p.upc ?? "—",
      p.ean ?? "—",
    ]),
    [16, 28, 10, 14, 14, 12, 14, 10, 16, 16],
  );

  const sinStock = (item.products ?? []).filter(
    (p: InventoryProductItem) => p.stock === 0 || p.stock == null,
  );
  if (sinStock.length) {
    addDataWorksheet(
      wb,
      "Sin Stock",
      "Variantes sin Stock",
      ["SKU", "Nombre", "Precio"],
      sinStock.map((p: InventoryProductItem) => [
        p.sku,
        p.productName,
        cur(p.price),
      ]),
      [16, 28, 14],
      "FFEF4444",
    );
  }

  await downloadWorkbook(
    wb,
    `inventario-${item.parentProductName.replace(/\s+/g, "-").toLowerCase()}.xlsx`,
  );
}
