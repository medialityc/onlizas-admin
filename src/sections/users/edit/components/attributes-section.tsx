// components/attributes-section.tsx
import { Button } from "@/components/button/button";
import {
  CheckIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { EmptyState } from "./empty-state-component";

export const AttributesSection: React.FC = () => {
  const { watch, setValue } = useFormContext();
  const attributes = watch("attributes") || {};

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [tempEdit, setTempEdit] = useState({ key: "", value: "" });
  const handleAddAttribute = () => {
    if (newKey && newValue && !attributes[newKey]) {
      setValue("attributes", { ...attributes, [newKey]: newValue });
      setNewKey("");
      setNewValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevenir el submit del formulario
      handleAddAttribute();
    }
  };

  const startEditing = (key: string) => {
    setEditingKey(key);
    setTempEdit({ key, value: attributes[key] });
  };

  const saveEditing = () => {
    if (!editingKey || !tempEdit.key || !tempEdit.value) return;

    const newAttributes = { ...attributes };

    // Si la clave cambió, eliminamos la vieja y creamos una nueva
    if (editingKey !== tempEdit.key) {
      delete newAttributes[editingKey];
    }

    newAttributes[tempEdit.key] = tempEdit.value;
    setValue("attributes", newAttributes);
    cancelEditing();
  };

  const cancelEditing = () => {
    setEditingKey(null);
    setTempEdit({ key: "", value: "" });
  };

  const deleteAttribute = (key: string) => {
    const newAttributes = { ...attributes };
    delete newAttributes[key];
    setValue("attributes", newAttributes);
  };

  const attributeKeys = Object.keys(attributes);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-orange-800 dark:text-orange-200">
          Atributos
        </h3>
      </div>

      {/* Formulario para agregar nuevo atributo */}
      <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
          <div>
            <label className="block text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">
              Clave
            </label>{" "}
            <input
              type="text"
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border border-orange-200 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-100 rounded px-3 py-2 w-full"
              maxLength={25}
              placeholder="Ej: departamento"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">
              Valor
            </label>{" "}
            <input
              type="text"
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border border-orange-200 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-100 rounded px-3 py-2 w-full"
              maxLength={25}
              placeholder="Ej: ventas"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddAttribute}
            className="bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-2"
            disabled={!newKey || !newValue || !!attributes[newKey]}
          >
            <PlusIcon className="h-4 w-4" />
            Agregar
          </Button>
        </div>
      </div>

      {/* Lista de atributos existentes */}
      {attributeKeys.length > 0 ? (
        <div className="space-y-2">
          {" "}
          {attributeKeys.map(key => (
            <div
              key={key}
              className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-lg p-4"
            >
              {editingKey === key ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                  <div>
                    <input
                      type="text"
                      value={tempEdit.key}
                      onChange={e =>
                        setTempEdit({ ...tempEdit, key: e.target.value })
                      }
                      className="border border-orange-200 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-100 rounded px-3 py-2 w-full"
                      maxLength={25}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={tempEdit.value}
                      onChange={e =>
                        setTempEdit({ ...tempEdit, value: e.target.value })
                      }
                      className="border border-orange-200 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-100 rounded px-3 py-2 w-full"
                      maxLength={25}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={saveEditing}
                      className="bg-green-600 hover:bg-green-700 p-2"
                      disabled={!tempEdit.key || !tempEdit.value}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      onClick={cancelEditing}
                      className="bg-gray-500 hover:bg-gray-600 p-2"
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-orange-800 dark:text-orange-200">
                      {key}:{" "}
                    </span>
                    <span className="text-orange-600 dark:text-orange-300">
                      {attributes[key]}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => startEditing(key)}
                      className="bg-orange-500 hover:bg-orange-600 p-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => deleteAttribute(key)}
                      className="bg-red-500 hover:bg-red-600 p-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={
            <div className="h-12 w-12 mx-auto mb-4 opacity-50 bg-orange-200 rounded-full" />
          }
          title="No hay atributos definidos"
          description="Agregue atributos personalizados para este usuario"
        />
      )}
    </div>
  );
};
