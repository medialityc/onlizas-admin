"use client";

import { SearchInput } from "@/components/search/search-input";
import { useState } from "react";

type Suggestion = { id: number; label: string; subtitle?: string };

export default function InventorySearch({
  query,
  onQueryChange,
  suggestions,
  onSelect,
  selected,
  onRemove,
  placeholder = "Buscar producto, categoría, proveedor o variante...",
}: {
  query: string;
  onQueryChange: (v: string) => void;
  suggestions: Suggestion[];
  onSelect: (id: number) => void;
  selected: Suggestion[];
  onRemove: (id: number) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const hasSuggestions = focused && suggestions.length > 0;
  return (
    <div className="w-full">
      <div
        className="flex items-center gap-2"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <SearchInput
          value={query}
          onChange={onQueryChange}
          placeholder={placeholder}
          className="w-full"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="text-xs text-gray-600 dark:text-gray-300 hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              title={s.subtitle || s.label}
            >
              {s.label}
              <button
                type="button"
                aria-label="Quitar de seleccionados"
                onClick={() => onRemove(s.id)}
                className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Quitar"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {hasSuggestions && (
        <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800 shadow-sm max-h-64 overflow-y-auto">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelect(s.id);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {s.label}
                  </div>
                  {s.subtitle && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {s.subtitle}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
