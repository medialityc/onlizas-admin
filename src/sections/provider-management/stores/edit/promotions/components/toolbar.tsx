
import { PlusIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/button/button";

interface PromotionsToolbarProps {
  onNew: () => void;
}

export default function PromotionsToolbar({ onNew }: PromotionsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
      <div>
        <h3 className="text-md font-bold text-gray-900 dark:text-gray-100">Gestión de Promociones</h3>
        <p className="text-sm text-gray-500 dark:text-gray-300">Crea y gestiona promociones para incentivar las ventas</p>
      </div>
      
      <div className="flex items-center gap-3">        
        <Button onClick={onNew} className="inline-flex border-none items-center gap-2 rounded-md px-3 py-1.5 text-sm whitespace-nowrap flex-shrink-0
                                               bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-md hover:from-indigo-500 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/10">
            <PlusIcon className="h-4 w-4"/>
          </span>
          <span className="hidden sm:inline">Nueva Promoción</span>
          <span className="sm:hidden">Nueva</span>
        </Button>
      </div>
    </div>
  );
}
