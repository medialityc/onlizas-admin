"use client";

import { useState } from "react";
import { Download, FileChartColumn } from "lucide-react";
import {
  exportWarehouseInventoryListPdf,
  exportWarehouseInventoryListExcel,
  exportInventoryProviderDetailPdf,
  exportInventoryProviderDetailExcel,
} from "../utils/exporters";
import type { InventoryProvider } from "@/types/inventory";

// ─── List export (shows on warehouse inventory page) ──────────────────────────

interface ListProps {
  items: InventoryProvider[];
  warehouseName?: string;
}

export function WarehouseInventoryExportActions({
  items,
  warehouseName,
}: ListProps) {
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const handlePdf = () => {
    setExportingPdf(true);
    try {
      exportWarehouseInventoryListPdf(items, warehouseName);
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExcel = async () => {
    setExportingExcel(true);
    try {
      await exportWarehouseInventoryListExcel(items, warehouseName);
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

// ─── Single inventory provider detail export ─────────────────────────────────

interface DetailProps {
  item: InventoryProvider;
}

export function InventoryProviderDetailExportActions({ item }: DetailProps) {
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const handlePdf = () => {
    setExportingPdf(true);
    try {
      exportInventoryProviderDetailPdf(item);
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExcel = async () => {
    setExportingExcel(true);
    try {
      await exportInventoryProviderDetailExcel(item);
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
