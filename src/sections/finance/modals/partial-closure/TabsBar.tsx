"use client";
import React from "react";

export function TabsBar({
  activeTab,
  setActiveTab,
  submitting,
  canSubmit,
  onSubmit,
}: {
  activeTab: "datos" | "proveedores";
  setActiveTab: (t: "datos" | "proveedores") => void;
  submitting: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-3 py-2 text-sm ${
            activeTab === "datos"
              ? "border-b-2 border-primary font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("datos")}
        >
          Datos
        </button>
        <button
          type="button"
          className={`px-3 py-2 text-sm ${
            activeTab === "proveedores"
              ? "border-b-2 border-primary font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("proveedores")}
        >
          Proveedores
        </button>
      </div>
      <div className="py-2">
        <button
          type="button"
          className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-50 inline-flex items-center gap-2"
          disabled={submitting || !canSubmit}
          onClick={onSubmit}
        >
          {submitting && (
            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {submitting ? "Enviando..." : "Enviar cierre parcial"}
        </button>
      </div>
    </div>
  );
}
