import React from "react";
import { useFormContext } from "react-hook-form";

interface ReadOnlyFieldProps {
  label: string;
  name: string;
  type?: "text" | "number" | "color" | "boolean";
  className?: string;
}

export default function ReadOnlyField({ 
  label, 
  name, 
  type = "text", 
  className = "" 
}: ReadOnlyFieldProps) {
  const { watch } = useFormContext();
  const value = watch(name);

  const renderValue = () => {
    if (value === undefined || value === null || value === "") {
      return <span className="text-gray-400 dark:text-gray-500 italic">No especificado</span>;
    }

    switch (type) {
      case "boolean":
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            value 
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}>
            {value ? "Habilitado" : "Deshabilitado"}
          </span>
        );
      case "color":
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: value }}
            />
            <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{value}</span>
          </div>
        );
      case "number":
        return <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>;
      default:
        return <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
        {renderValue()}
      </div>
    </div>
  );
}
