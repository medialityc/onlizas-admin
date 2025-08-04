"use client";

import { useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ColumnSelectorProps } from "./types";
import { EXCLUDED_COLUMN_ACCESSORS, COLUMN_SELECTOR_WIDTH, COLUMN_SELECTOR_MAX_HEIGHT } from "./constants";

export function ColumnSelector<T extends Record<string, any>>({
  columns,
  hiddenColumns,
  onToggleColumn,
  isOpen,
  onToggle,
}: ColumnSelectorProps<T>) {
  // Get toggle-able columns (exclude actions and other special columns)
  const toggleableColumns = columns.filter(column => {
    const accessor = column.accessor as string;
    return !EXCLUDED_COLUMN_ACCESSORS.includes(accessor) && column.title;
  });

  // Close column selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.column-selector-container')) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onToggle]);

  return (
    <div className="relative column-selector-container">
      <button
        type="button"
        className="btn btn-outline-primary text-textColor flex items-center gap-2"
        onClick={onToggle}
      >
        <EyeIcon className="h-4 w-4" />
        Columnas
        <ChevronDownIcon 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className={`absolute right-0 top-full z-50 mt-2 ${COLUMN_SELECTOR_WIDTH} rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-600 dark:bg-gray-800 dark:shadow-gray-900/20`}>
          <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Mostrar/Ocultar Columnas
          </h4>
          <div className={`space-y-2 ${COLUMN_SELECTOR_MAX_HEIGHT} overflow-y-auto`}>
            {toggleableColumns.map((column) => {
              const accessor = column.accessor as string;
              const isVisible = !hiddenColumns.includes(accessor);
              return (
                <label
                  key={accessor}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => onToggleColumn(accessor)}
                    className="form-checkbox h-4 w-4 text-primary border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-primary"
                  />
                  <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    {isVisible ? (
                      <EyeIcon className="h-4 w-4 text-green-500 dark:text-green-400" />
                    ) : (
                      <EyeSlashIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    )}
                    {column.title || accessor}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
