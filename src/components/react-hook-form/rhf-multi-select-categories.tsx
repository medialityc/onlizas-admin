"use client";

import React, { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { StoreCategory } from "@/types/store-categories";
import { getStoreCategories } from "@/services/store-categories";
import { adaptStoreCategories } from "@/sections/provider-management/stores/edit/categories/utils/adapter";

interface Props {
  name: string;
  label: string;
  storeId: number;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function RHFMultiSelectCategories({
  name,
  label,
  storeId,
  placeholder = "Seleccionar categorías...",
  required = false,
  className = "",
}: Props) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({
    name,
    control,
    rules: { required: required ? `${label} es requerido` : false },
  });

  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Cargar categorías de la tienda
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const res = await getStoreCategories(storeId);
        const raw: any[] = Array.isArray(res?.data)
          ? (res.data as any[])
          : Array.isArray((res?.data as any)?.data)
            ? ((res?.data as any).data as any[])
            : [];
        
        if (res && !res.error) {
          const adaptedCategories = adaptStoreCategories(raw);
          // Solo categorías activas
          setCategories(adaptedCategories.filter(cat => cat.isActive));
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      loadCategories();
    }
  }, [storeId]);

  const selectedIds = field.value || [];
  
  const handleToggleCategory = (categoryId: number) => {
    const newSelected = selectedIds.includes(categoryId)
      ? selectedIds.filter((id: number) => id !== categoryId)
      : [...selectedIds, categoryId];
    
    field.onChange(newSelected);
  };

  const selectedCategories = categories.filter(cat => selectedIds.includes(cat.categoryId));

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {/* Campo de selección */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={loading}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
            fieldState.error ? 'border-red-500' : ''
          }`}
        >
          {loading ? (
            <span className="text-gray-500">Cargando categorías...</span>
          ) : selectedCategories.length > 0 ? (
            <span>{selectedCategories.length} categoría(s) seleccionada(s)</span>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>

        {/* Dropdown de opciones */}
        {isOpen && !loading && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
            {categories.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">No hay categorías disponibles</div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.categoryId}
                  onClick={() => handleToggleCategory(category.categoryId)}
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                    selectedIds.includes(category.categoryId) ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(category.categoryId)}
                      onChange={() => {}} // Controlled by onClick
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                    />
                    <span className="block truncate">{category.categoryName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Mostrar categorías seleccionadas */}
      {selectedCategories.length > 0 && (
        <div className="mt-2">
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <span
                key={category.categoryId}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {category.categoryName}
                <button
                  type="button"
                  onClick={() => handleToggleCategory(category.categoryId)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:text-blue-600"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {fieldState.error && (
        <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>
      )}

      {/* Click fuera para cerrar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
