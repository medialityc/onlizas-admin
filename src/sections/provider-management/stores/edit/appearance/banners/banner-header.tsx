"use client";

import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

interface BannerHeaderProps {
  onNew: () => void;
}

export default function BannerHeader({ onNew }: BannerHeaderProps) {
  return (
    <div className="flex items-center justify-between mt-2">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Gestión de Banners</h3>
        <p className="text-xs text-gray-500">
          Crea y gestiona banners promocionales para tu tienda
        </p>
      </div>
      <button
        type="button"
        onClick={onNew}
        className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white text-xs font-medium px-3 py-2 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        <PlusIcon className="w-4 h-4" />
        Nuevo Banner
      </button>
    </div>
  );
}
