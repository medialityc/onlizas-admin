"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Tipos para las opciones del filtro
interface FilterOption {
  value: string;
  label: string;
  [key: string]: any;
}

// Props del componente
interface StatusFilterProps {
  options: FilterOption[];
  searchParamKey?: string;
  placeholder?: string;
  allowMultiple?: boolean;
  className?: string;
  separator?: string;
  enableSearch?: boolean;
  maxHeight?: string;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  options = [],
  searchParamKey = "status",
  placeholder = "Filter by status...",
  allowMultiple = true,
  className = "",
  separator = ",",
  enableSearch = true,
  maxHeight = "240px",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Obtener valores seleccionados desde searchParams
  const getSelectedStatuses = useCallback((): string[] => {
    const paramValue = searchParams.get(searchParamKey);
    if (!paramValue) return [];
    return allowMultiple ? paramValue.split(separator) : [paramValue];
  }, [searchParams, searchParamKey, allowMultiple, separator]);

  const selectedStatuses = getSelectedStatuses();

  // Filtrar opciones basado en el término de búsqueda
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const term = searchTerm.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(term) ||
        option.value.toLowerCase().includes(term)
    );
  }, [options, searchTerm]);

  // Actualizar searchParams de forma optimizada
  const updateSearchParams = useCallback(
    (newStatuses: string[]) => {
      const params = new URLSearchParams(searchParams);

      if (newStatuses.length === 0) {
        params.delete(searchParamKey);
      } else {
        const paramValue = allowMultiple
          ? newStatuses.join(separator)
          : newStatuses[0];
        params.set(searchParamKey, paramValue);
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, searchParamKey, allowMultiple, separator]
  );

  const handleStatusToggle = useCallback(
    (value: string) => {
      if (!allowMultiple) {
        const newSelection = selectedStatuses.includes(value) ? [] : [value];
        updateSearchParams(newSelection);
        setIsOpen(false);
      } else {
        const newStatuses = selectedStatuses.includes(value)
          ? selectedStatuses.filter((status) => status !== value)
          : [...selectedStatuses, value];
        updateSearchParams(newStatuses);
      }
    },
    [allowMultiple, selectedStatuses, updateSearchParams]
  );

  const clearAll = useCallback(() => {
    updateSearchParams([]);
    setSearchTerm("");
  }, [updateSearchParams]);

  const getDisplayText = useCallback((): string => {
    if (selectedStatuses.length === 0) return placeholder;
    if (selectedStatuses.length === 1) {
      const selected = options.find((opt) => opt.value === selectedStatuses[0]);
      return selected ? selected.label : selectedStatuses[0];
    }
    return `${selectedStatuses.length} selected`;
  }, [selectedStatuses, options, placeholder]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchTerm("");
  }, []);

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-48 px-3 py-2 text-left 
                   bg-white dark:bg-gray-800 
                   border border-gray-200 dark:border-gray-600 
                   rounded-md shadow-sm 
                   hover:border-gray-300 dark:hover:border-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                   focus:border-transparent
                   transition-all duration-200 ease-in-out
                   text-gray-900 dark:text-gray-100"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className={`truncate text-sm ${
            selectedStatuses.length === 0
              ? "text-gray-500 dark:text-gray-400"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {getDisplayText()}
        </span>
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {selectedStatuses.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Clear filters"
              type="button"
              aria-label="Limpiar selecciones"
            >
              <X
                size={12}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              />
            </button>
          )}
          <ChevronDown
            size={14}
            className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 
                        bg-white dark:bg-gray-800 
                        border border-gray-200 dark:border-gray-600 
                        rounded-md shadow-lg 
                        overflow-hidden"
          style={{ maxHeight }}
        >
          {/* Search Input */}
          {enableSearch && options.length > 5 && (
            <div className="p-2 border-b border-gray-100 dark:border-gray-700">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm
                           bg-gray-50 dark:bg-gray-700
                           border border-gray-200 dark:border-gray-600
                           rounded
                           focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400
                           focus:border-transparent
                           text-gray-900 dark:text-gray-100
                           placeholder-gray-500 dark:placeholder-gray-400"
                  autoComplete="off"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: enableSearch ? "calc(100% - 60px)" : "100%" }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-gray-500 dark:text-gray-400 text-sm text-center">
                {searchTerm ? "No options found" : "No options available"}
              </div>
            ) : (
              <>
                {/* Header con contador */}
                {allowMultiple && selectedStatuses.length > 0 && (
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600 flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {selectedStatuses.length} de {options.length}
                    </span>
                    <button
                      onClick={clearAll}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                      type="button"
                    >
                      Limpiar todo
                    </button>
                  </div>
                )}

                {/* Options */}
                <div className="py-1">
                  {filteredOptions.map((option) => {
                    const isSelected = selectedStatuses.includes(option.value);

                    return (
                      <button
                        key={option.value}
                        onClick={() => handleStatusToggle(option.value)}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm",
                          {
                            "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300":
                              isSelected,
                          },
                          "hover:bg-gray-50 dark:hover:bg-gray-700",
                          "transition-colors duration-150",
                          "flex items-center justify-between group"
                        )}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span className="truncate">{option.label}</span>

                        {/* Checkbox for multiple selection */}
                        {allowMultiple && (
                          <div
                            className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500"
                                : "border-gray-300 dark:border-gray-500 group-hover:border-gray-400 dark:group-hover:border-gray-400"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                className="w-2.5 h-2.5 text-white"
                                fill="currentColor"
                                viewBox="0 0 8 8"
                              >
                                <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                              </svg>
                            )}
                          </div>
                        )}

                        {/* Radio dot for single selection */}
                        {!allowMultiple && isSelected && (
                          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Backdrop para cerrar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
