
import { PlusIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/button/button";

interface PromotionsToolbarProps {
  onNew: () => void;
}

export default function PromotionsToolbar({ onNew }: PromotionsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
      <div>
        <h3 className="text-md font-bold text-gray-900">Gestión de Promociones</h3>
        <p className="text-sm text-gray-500">Crea y gestiona promociones para incentivar las ventas</p>
      </div>
      
      <div className="flex items-center gap-3">        
        <Button onClick={onNew} className="inline-flex border-none shadow-black items-center gap-2 rounded-md bg-gray-900 text-white px-3 py-1.5 text-sm hover:bg-black/90 whitespace-nowrap flex-shrink-0">
          <PlusIcon className="h-4 w-4"/> 
          <span className="hidden sm:inline">Nueva Promoción</span>
          <span className="sm:hidden">Nueva</span>
        </Button>
      </div>
    </div>
  );
}
