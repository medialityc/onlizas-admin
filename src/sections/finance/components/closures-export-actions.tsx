"use client";

import { useState } from "react";
import { Download, FileChartColumn } from "lucide-react";
import {
  exportClosuresSummaryPdf,
  exportClosuresSummaryExcel,
  exportClosuresListPdf,
  exportClosuresListExcel,
} from "../utils/exporters";
import type {
  Closure,
  ClosuresSummary,
  SupplierFinancialSummaryItem,
} from "@/types/finance";

// ─── Variant A: for the closures list page ────────────────────────────────────

interface ListProps {
  closures: Closure[];
}

export function ClosuresListExportActions({ closures }: ListProps) {
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const handlePdf = () => {
    setExportingPdf(true);
    try {
      exportClosuresListPdf(closures);
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExcel = async () => {
    setExportingExcel(true);
    try {
      await exportClosuresListExcel(closures);
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

// ─── Variant B: for the closures summary / account-states dashboard ───────────

interface SummaryProps {
  summary: ClosuresSummary;
  suppliers: SupplierFinancialSummaryItem[];
  startDate?: string;
  endDate?: string;
}

export function ClosuresSummaryExportActions({
  summary,
  suppliers,
  startDate,
  endDate,
}: SummaryProps) {
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const handlePdf = () => {
    setExportingPdf(true);
    try {
      exportClosuresSummaryPdf(summary, suppliers, startDate, endDate);
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExcel = async () => {
    setExportingExcel(true);
    try {
      await exportClosuresSummaryExcel(summary, suppliers, startDate, endDate);
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
