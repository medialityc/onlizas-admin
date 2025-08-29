"use client";

import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

type Props = {
  onNew?: () => void;
};

export default function CategoriesToolbar({ onNew }: Props) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-medium font-semibold text-gray-900">Categorías de Productos</h3>
        <p className="text-sm text-gray-500">Organiza tus productos en categorías para facilitar la navegación</p>
      </div>
      {/* <button
        type="button"
        onClick={onNew}
        className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-3 py-1.5 text-xs hover:bg-black/90"
      >
        <PlusIcon className="w-4 h-4" />
        Nueva Categoría
      </button> */}
    </div>
  );
}
