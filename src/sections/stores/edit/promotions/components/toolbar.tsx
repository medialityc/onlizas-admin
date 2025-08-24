import React from "react";
import { PlusIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/button/button";

export default function PromotionsToolbar({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-md font-bold text-gray-900">Gestión de Promociones</h3>
        <p className="text-sm text-gray-500">Crea y gestiona promociones para incentivar las ventas</p>
      </div>
      <Button onClick={onNew} className="border-none shadow-md inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-3 py-1.5 text-sm hover:bg-black/90">
        <PlusIcon className="h-4 w-4"/> Nueva Promoción
      </Button>
    </div>
  );
}
