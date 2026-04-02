import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  createWorkbook,
  addSummaryWorksheet,
  addDataWorksheet,
  downloadWorkbook,
} from "@/utils/exceljs-warehouse-styles";
import { formatCurrency } from "@/utils/format";
import { Order, SubOrder, OrderStatus } from "@/types/order";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtD(val: string | Date | undefined | null): string {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleDateString("es-ES");
  } catch {
    return String(val);
  }
}

function fmtDT(val: string | Date | undefined | null): string {
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

function weightLabel(w: number): string {
  if (w >= 1000) return `${(w / 1000).toFixed(2)} kg`;
  return `${w} g`;
}

const STATUS_LABELS: Record<number, string> = {
  [OrderStatus.Pending]: "Pendiente",
  [OrderStatus.Processing]: "En proceso",
  [OrderStatus.Completed]: "Completado",
  [OrderStatus.Sent]: "Enviado",
  [OrderStatus.Received]: "Recibido",
  [OrderStatus.Cancelled]: "Cancelado",
  [OrderStatus.Refunded]: "Reembolsado",
};

function statusLabel(s: number): string {
  return STATUS_LABELS[s] ?? String(s);
}

// ─── PDF: lista de órdenes ────────────────────────────────────────────────────

export function exportOrdersListPdf(orders: Order[]) {
  const doc = new jsPDF({ orientation: "landscape" });
  const margin = 14;
  let y = 20;

  doc.setFontSize(16);
  doc.setTextColor(33);
  doc.text("Lista de Órdenes", margin, y);
  y += 6;
  doc.setFontSize(8);
  doc.text(`Generado: ${fmtDT(new Date())}`, margin, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [
      [
        "# Orden",
        "Estado",
        "Remitente",
        "Destinatario",
        "Monto",
        "Envío",
        "Impuesto",
        "Peso",
        "Fecha",
      ],
    ],
    body: orders.map((o) => [
      o.orderNumber,
      statusLabel(o.status),
      o.senderName,
      o.receiverName,
      cur(o.totalAmountPaid),
      cur(o.totalDeliveryAmount),
      cur(o.totalTaxAmount),
      weightLabel(o.totalWeight),
      fmtD(o.createdDatetime),
    ]),
    theme: "grid",
    styles: { fontSize: 7 },
    headStyles: { fillColor: [224, 231, 255], textColor: 55 },
  });

  doc.save("ordenes.pdf");
}

// ─── Excel: lista de órdenes ──────────────────────────────────────────────────

export async function exportOrdersListExcel(orders: Order[]) {
  const wb = createWorkbook();

  addDataWorksheet(
    wb,
    "Órdenes",
    "Lista de Órdenes",
    [
      "# Orden",
      "Estado",
      "Remitente",
      "Destinatario",
      "Monto Total",
      "Envío",
      "Impuesto",
      "Peso",
      "Subórdenes",
      "Fecha",
    ],
    orders.map((o) => [
      o.orderNumber,
      statusLabel(o.status),
      o.senderName,
      o.receiverName,
      cur(o.totalAmountPaid),
      cur(o.totalDeliveryAmount),
      cur(o.totalTaxAmount),
      weightLabel(o.totalWeight),
      o.subOrders?.length ?? 0,
      fmtD(o.createdDatetime),
    ]),
    [20, 14, 26, 26, 16, 14, 14, 12, 12, 18],
  );

  await downloadWorkbook(wb, "ordenes.xlsx");
}

// ─── PDF: detalle de una orden ────────────────────────────────────────────────

export function exportOrderDetailPdf(order: Order) {
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

  // Cabecera
  doc.setFontSize(18);
  doc.setTextColor(33);
  doc.text(`Orden ${order.orderNumber}`, margin, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(
    `Estado: ${statusLabel(order.status)}   Fecha: ${fmtD(order.createdDatetime)}`,
    margin,
    y,
  );
  y += 5;
  doc.text(
    `Monto total: ${cur(order.totalAmountPaid)}   Envío: ${cur(order.totalDeliveryAmount)}   Impuesto: ${cur(order.totalTaxAmount)}   Peso: ${weightLabel(order.totalWeight)}`,
    margin,
    y,
  );
  y += 8;
  doc.setTextColor(0);

  // Remitente / Destinatario
  stepY(20);
  doc.setFontSize(12);
  doc.text("Partes", margin, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Rol", "Nombre", "Email", "Teléfono", "Dirección"]],
    body: [
      [
        "Remitente",
        order.senderName,
        order.senderEmail,
        order.senderPhone,
        order.senderAddress,
      ],
      [
        "Destinatario",
        order.receiverName,
        order.receiverEmail,
        order.receiverPhone,
        order.receiverAddress,
      ],
    ],
    theme: "grid",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [224, 231, 255], textColor: 55 },
  });
  y = (doc as any).lastAutoTable?.finalY ?? y;
  y += 8;

  // Sub-órdenes
  if (order.subOrders?.length) {
    const cancelled = order.subOrders.filter(
      (s) => s.status === OrderStatus.Cancelled,
    );
    const active = order.subOrders.filter(
      (s) => s.status !== OrderStatus.Cancelled,
    );

    if (active.length) {
      stepY(20);
      doc.setFontSize(12);
      doc.text("Sub-Órdenes", margin, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        head: [
          [
            "# Sub-Orden",
            "Tienda",
            "Producto",
            "Cant.",
            "Estado",
            "Monto",
            "Envío",
            "Peso",
            "Fecha",
          ],
        ],
        body: active.map((s) => [
          s.subOrderNumber,
          s.storeName,
          s.productName,
          String(s.requestedQuantity),
          statusLabel(s.status),
          cur(s.amountPaid),
          cur(s.deliveryAmount),
          weightLabel(s.weight),
          fmtD(s.createdDatetime),
        ]),
        theme: "grid",
        styles: { fontSize: 7 },
        headStyles: { fillColor: [224, 231, 255], textColor: 55 },
      });
      y = (doc as any).lastAutoTable?.finalY ?? y;
      y += 8;
    }

    if (cancelled.length) {
      stepY(20);
      doc.setFontSize(12);
      doc.text("Sub-Órdenes Canceladas", margin, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        head: [["# Sub-Orden", "Tienda", "Producto", "Cant.", "Monto"]],
        body: cancelled.map((s) => [
          s.subOrderNumber,
          s.storeName,
          s.productName,
          String(s.requestedQuantity),
          cur(s.amountPaid),
        ]),
        theme: "grid",
        styles: { fontSize: 7 },
        headStyles: { fillColor: [254, 242, 242], textColor: 156 },
      });
    }
  }

  doc.save(`orden-${order.orderNumber}.pdf`);
}

// ─── Excel: detalle de una orden ─────────────────────────────────────────────

export async function exportOrderDetailExcel(order: Order) {
  const wb = createWorkbook();

  // Hoja 1: Resumen
  addSummaryWorksheet(wb, "Resumen", `Orden ${order.orderNumber}`, [
    ["# Orden", order.orderNumber],
    ["Estado", statusLabel(order.status)],
    ["Fecha", fmtD(order.createdDatetime)],
    ["Monto total", cur(order.totalAmountPaid)],
    ["Total envío", cur(order.totalDeliveryAmount)],
    ["Total impuesto", cur(order.totalTaxAmount)],
    ["Peso total", weightLabel(order.totalWeight)],
    ["Remitente", order.senderName],
    ["Email remitente", order.senderEmail],
    ["Teléf. remitente", order.senderPhone],
    ["Dirección remit.", order.senderAddress],
    ["Destinatario", order.receiverName],
    ["Email destino", order.receiverEmail],
    ["Teléf. destino", order.receiverPhone],
    ["Dirección dest.", order.receiverAddress],
  ]);

  // Hoja 2: Sub-órdenes
  if (order.subOrders?.length) {
    addDataWorksheet(
      wb,
      "Sub-Órdenes",
      `Sub-Órdenes — ${order.orderNumber}`,
      [
        "# Sub-Orden",
        "Tienda",
        "Producto",
        "Cantidad",
        "Estado",
        "Monto",
        "Envío",
        "Impuesto",
        "Peso",
        "Fecha",
      ],
      order.subOrders.map((s: SubOrder) => [
        s.subOrderNumber,
        s.storeName,
        s.productName,
        s.requestedQuantity,
        statusLabel(s.status),
        cur(s.amountPaid),
        cur(s.deliveryAmount),
        cur(s.taxAmount),
        weightLabel(s.weight),
        fmtD(s.createdDatetime),
      ]),
      [20, 24, 30, 10, 14, 14, 14, 14, 12, 18],
    );

    // Hoja 3: Canceladas (si hay)
    const cancelled = order.subOrders.filter(
      (s: SubOrder) => s.status === OrderStatus.Cancelled,
    );
    if (cancelled.length) {
      addDataWorksheet(
        wb,
        "Canceladas",
        "Sub-Órdenes Canceladas",
        ["# Sub-Orden", "Tienda", "Producto", "Cantidad", "Monto"],
        cancelled.map((s: SubOrder) => [
          s.subOrderNumber,
          s.storeName,
          s.productName,
          s.requestedQuantity,
          cur(s.amountPaid),
        ]),
        [20, 24, 30, 10, 14],
        "FFEF4444",
      );
    }
  }

  await downloadWorkbook(wb, `orden-${order.orderNumber}.xlsx`);
}

// ─── PDF: etiqueta de entrega (para pegar en caja) ────────────────────────────
// Formato: 100 x 150 mm  — blanco y negro

export async function exportSubOrderLabelPdf(order: Order, subOrder: SubOrder) {
  const W = 100;
  const H = 150;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [W, H],
  });

  const ML = 6; // margin left
  const MR = W - 6; // margin right
  const CW = W - 12; // usable content width

  // ── QR code ──────────────────────────────────────────────────────────────
  // Install: npm install qrcode @types/qrcode
  let qrDataUrl: string | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const QRCode = require("qrcode") as {
      toDataURL: (text: string, opts: object) => Promise<string>;
    };
    qrDataUrl = await QRCode.toDataURL(subOrder.subOrderNumber, {
      width: 200,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
    });
  } catch {
    // qrcode not available — renders placeholder
  }

  // ── draw helpers ─────────────────────────────────────────────────────────
  const black = () => doc.setTextColor(0, 0, 0);
  const gray = () => doc.setTextColor(80, 80, 80);

  const hLine = (y: number, lw = 0.2) => {
    doc.setDrawColor(0);
    doc.setLineWidth(lw);
    doc.line(ML, y, MR, y);
  };

  const blackRect = (x: number, y: number, w: number, h: number) => {
    doc.setFillColor(0, 0, 0);
    doc.rect(x, y, w, h, "F");
  };

  const whiteRect = (x: number, y: number, w: number, h: number) => {
    doc.setFillColor(255, 255, 255);
    doc.rect(x, y, w, h, "F");
  };

  // ── OUTER BORDER ─────────────────────────────────────────────────────────
  doc.setDrawColor(0);
  doc.setLineWidth(0.6);
  doc.rect(1, 1, W - 2, H - 2);

  // =========================================================================
  // HEADER (black bar)
  // =========================================================================
  const HEADER_H = 10;
  blackRect(1, 1, W - 2, HEADER_H);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("ONLIZAS", ML + 1, 8.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("ETIQUETA DE ENTREGA", ML + 1, 12 - 1.5);

  // Sub-order number — right side of header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text(subOrder.subOrderNumber, MR - 1, 8.5, { align: "right" });

  let y = 1 + HEADER_H + 4; // cursor after header

  // =========================================================================
  // QR + sub-order details side-by-side row
  // =========================================================================
  const QR_SIZE = 28;
  const qrX = MR - QR_SIZE - 1;
  const qrY = y;

  // QR block
  if (qrDataUrl) {
    doc.addImage(qrDataUrl, "PNG", qrX, qrY, QR_SIZE, QR_SIZE);
  } else {
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.rect(qrX, qrY, QR_SIZE, QR_SIZE);
    doc.setFontSize(5);
    gray();
    doc.text("QR", qrX + QR_SIZE / 2, qrY + QR_SIZE / 2 + 1.5, {
      align: "center",
    });
  }

  // Left of QR: FROM mini block
  const leftW = qrX - ML - 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.5);
  black();
  doc.text("DE:", ML, y + 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  black();
  const fromName = doc.splitTextToSize(order.senderName || "—", leftW);
  doc.text(fromName, ML, y + 8.5);

  doc.setFontSize(5.5);
  gray();
  const fromAddr = doc.splitTextToSize(order.senderAddress || "—", leftW);
  doc.text(fromAddr, ML, y + 8.5 + fromName.length * 3.5);

  const fromBottom = y + QR_SIZE;
  y = Math.max(qrY + QR_SIZE, fromBottom) + 4;

  // =========================================================================
  // SECTION DIVIDER: PARA / DESTINATARIO
  // =========================================================================
  hLine(y - 1, 0.5);

  // "PARA:" label — inverted pill
  const paraLabel = " PARA: ";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  const paraW = doc.getTextWidth(paraLabel) + 2;
  blackRect(ML, y + 0.5, paraW, 5);
  doc.setTextColor(255, 255, 255);
  doc.text(paraLabel, ML + 1, y + 4.5);
  y += 8;

  // Receiver name — largest text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  black();
  const rcvLines = doc.splitTextToSize(order.receiverName || "—", CW);
  doc.text(rcvLines, ML, y);
  y += rcvLines.length * 6;

  // Address
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  black();
  const addrLines = doc.splitTextToSize(order.receiverAddress || "—", CW);
  doc.text(addrLines, ML, y);
  y += addrLines.length * 3.8 + 1;

  // Phone
  doc.setFontSize(6.5);
  gray();
  doc.text(`Tel: ${order.receiverPhone || "—"}`, ML, y);
  y += 3.5;
  doc.text(`Email: ${order.receiverEmail || "—"}`, ML, y);
  y += 5;

  // =========================================================================
  // SECTION DIVIDER: DETALLE DEL PAQUETE
  // =========================================================================
  hLine(y - 1, 0.3);
  y += 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  gray();
  doc.text("DETALLE DEL PAQUETE", ML, y);
  y += 4;

  // Product name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  black();
  const prodLines = doc.splitTextToSize(subOrder.productName || "—", CW);
  doc.text(prodLines, ML, y);
  y += prodLines.length * 4 + 1;

  // Stats grid: 3 columns
  const col = CW / 3;
  const stats = [
    ["Cantidad", String(subOrder.requestedQuantity)],
    ["Peso", weightLabel(subOrder.weight)],
    ["Monto", cur(subOrder.amountPaid)],
  ];
  stats.forEach(([label, value], i) => {
    const x = ML + i * col;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    gray();
    doc.text(label, x, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    black();
    doc.text(value, x, y + 3.5);
  });
  y += 9;

  // Store & date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  gray();
  doc.text(`Tienda: ${subOrder.storeName || "—"}`, ML, y);
  doc.text(`Fecha: ${fmtD(subOrder.createdDatetime)}`, ML + CW / 2, y);
  y += 4;

  // =========================================================================
  // REFERENCE LINE
  // =========================================================================
  hLine(y, 0.3);
  y += 3;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  gray();
  doc.text(`Orden: ${order.orderNumber}`, ML, y);
  doc.text(`Estado: ${statusLabel(subOrder.status)}`, ML + CW / 2, y);
  y += 3;

  // =========================================================================
  // BARCODE AREA (bottom — fixed)
  // =========================================================================
  const bcAreaY = H - 18;
  hLine(bcAreaY, 0.3);

  // Pseudo-barcode centered
  const pattern = [
    1.4, 0.5, 0.9, 0.5, 1.8, 0.5, 0.7, 0.5, 1.2, 0.5, 1.5, 0.5, 0.6, 0.5, 1.6,
    0.5, 0.9, 0.5, 1.1, 0.5, 1.3, 0.5, 0.8, 0.5, 1.7, 0.5, 0.6, 0.5, 1.0,
  ];
  const bcH = 7;
  const totalBcW = pattern.reduce((a, b) => a + b, 0);
  let bx = (W - totalBcW) / 2;
  const bcY = bcAreaY + 3;
  pattern.forEach((w, i) => {
    if (i % 2 === 0) blackRect(bx, bcY, w, bcH);
    bx += w;
  });

  // Sub-order number below barcode
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  black();
  doc.text(subOrder.subOrderNumber, W / 2, bcY + bcH + 4, { align: "center" });

  doc.save(`etiqueta-${subOrder.subOrderNumber}.pdf`);
}
