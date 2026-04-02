"use client";

import { useState } from "react";
import { Download, FileChartColumn } from "lucide-react";
import {
  exportOrdersListPdf,
  exportOrdersListExcel,
  exportOrderDetailPdf,
  exportOrderDetailExcel,
} from "../utils/exporters";
import type { Order } from "@/types/order";

// ─── List export (shows on orders list page) ──────────────────────────────────

interface ListProps {
  orders: Order[];
}

export function OrdersListExportActions({ orders }: ListProps) {
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const handlePdf = () => {
    setExportingPdf(true);
    try {
      exportOrdersListPdf(orders);
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExcel = async () => {
    setExportingExcel(true);
    try {
      await exportOrdersListExcel(orders);
    } finally {
      setExportingExcel(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handlePdf}
        disabled={exportingPdf}
        className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/60"
      >
        <Download className="h-3.5 w-3.5" />
        {exportingPdf ? "Generando..." : "Reporte PDF"}
      </button>
      <button
        type="button"
        onClick={handleExcel}
        disabled={exportingExcel}
        className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/60"
      >
        <FileChartColumn className="h-3.5 w-3.5" />
        {exportingExcel ? "Generando..." : "Excel"}
      </button>
    </div>
  );
}

// ─── Single order detail export ───────────────────────────────────────────────

interface DetailProps {
  order: Order;
}

export function OrderDetailExportActions({ order }: DetailProps) {
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const handlePdf = () => {
    setExportingPdf(true);
    try {
      exportOrderDetailPdf(order);
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExcel = async () => {
    setExportingExcel(true);
    try {
      await exportOrderDetailExcel(order);
    } finally {
      setExportingExcel(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handlePdf}
        disabled={exportingPdf}
        className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/60"
      >
        <Download className="h-3.5 w-3.5" />
        {exportingPdf ? "Generando..." : "Reporte PDF"}
      </button>
      <button
        type="button"
        onClick={handleExcel}
        disabled={exportingExcel}
        className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/60"
      >
        <FileChartColumn className="h-3.5 w-3.5" />
        {exportingExcel ? "Generando..." : "Excel"}
      </button>
    </div>
  );
}
