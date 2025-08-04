import React, { useState } from "react";
import { ExclamationTriangleIcon, XMarkIcon} from "@heroicons/react/24/outline";
import { FieldErrors } from "react-hook-form";

interface FormErrorSummaryProps {
  errors: FieldErrors;
  tabMappings: Record<string, { tabIndex: number; tabName: string; fieldLabel: string }>;
  onFieldClick?: (fieldName: string, tabIndex: number) => void;
  onClose?: () => void;
  isVisible?: boolean;
}

export default function FormErrorSummary({
  errors,
  tabMappings,
  onFieldClick,
  onClose,
  isVisible = true,
}: FormErrorSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const errorEntries = Object.entries(errors).filter(([, error]) => error?.message);
  
  if (!isVisible || errorEntries.length === 0) {
    return null;
  }

  const groupedErrors = errorEntries.reduce((acc, [fieldName, error]) => {
    const mapping = tabMappings[fieldName];
    if (!mapping) return acc;
    
    const { tabIndex, tabName } = mapping;
    if (!acc[tabIndex]) {
      acc[tabIndex] = { tabName, errors: [] };
    }
    
    acc[tabIndex].errors.push({
      fieldName,
      fieldLabel: mapping.fieldLabel,
      message: (error?.message as string) || "Error desconocido",
    });
    
    return acc;
  }, {} as Record<number, { tabName: string; errors: Array<{ fieldName: string; fieldLabel: string; message: string }> }>);

  return (
    <div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-4xl">
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg overflow-hidden">
        {/* Header siempre visible */}
        <div className="p-4">
          <div className="flex items-start justify-between w-full">
            <div className="flex items-center gap-3 flex-1">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold text-sm">
                  {errorEntries.length} error{errorEntries.length !== 1 ? 'es' : ''} en el formulario
                </h3>
                <p className="text-red-600 text-xs mt-1">
                  {isExpanded ? 'Ocultar detalles' : 'Haz clic para ver los detalles'}
                </p>
              </div>
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-red-600 hover:text-red-800 text-xs font-medium ml-2 px-2 py-1 hover:bg-red-100 rounded transition-colors"
              >
                {isExpanded ? 'Ocultar' : 'Ver detalles'}
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors"
                title={isExpanded ? "Ocultar detalles" : "Mostrar detalles"}
              >
              
              </button>
              
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors"
                  title="Cerrar"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Contenido desplegable */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-red-200 bg-red-25 animate-in slide-in-from-top-1 duration-200">
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(groupedErrors).map(([tabIndex, { tabName, errors: tabErrors }]) => (
                <div key={tabIndex} className="bg-white rounded-md border border-red-200 p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <h4 className="font-medium text-red-800 text-sm">{tabName}</h4>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      {tabErrors.length}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {tabErrors.map(({ fieldName, fieldLabel, message }) => (
                      <li key={fieldName}>
                        <button
                          onClick={() => onFieldClick?.(fieldName, parseInt(tabIndex))}
                          className="text-left w-full text-xs text-red-700 hover:text-red-900 hover:bg-red-50 p-1 rounded transition-colors"
                        >
                          <span className="font-medium">{fieldLabel}:</span>
                          <span className="ml-1">{message}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
