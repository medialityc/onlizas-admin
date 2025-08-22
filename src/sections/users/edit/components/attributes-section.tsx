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
  // attributes puede contener strings, null u objetos anidados simples
  const attributes: Record<string, any> = watch("attributes") || {};

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [tempEdit, setTempEdit] = useState<{
    key: string;
    value: string;
    isJson: boolean;
  }>({ key: "", value: "", isJson: false });
  const handleAddAttribute = () => {
    if (!newKey || !newValue) return;
    if (Object.prototype.hasOwnProperty.call(attributes, newKey)) return; // evita duplicado aunque sea null

    // Intentar parse JSON si parece objeto/array
    let parsed: any = newValue;
    const trimmed = newValue.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        // dejar como string si falla
      }
    }
    setValue("attributes", { ...attributes, [newKey]: parsed });
    setNewKey("");
    setNewValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevenir el submit del formulario
      handleAddAttribute();
    }
  };

  const startEditing = (key: string) => {
    const original = attributes[key];
    const isObj = original && typeof original === "object";
    setEditingKey(key);
    setTempEdit({
      key,
      value: isObj ? JSON.stringify(original, null, 2) : (original ?? ""),
      isJson: isObj,
    });
  };

  const saveEditing = () => {
    if (!editingKey || !tempEdit.key) return;

    const newAttributes = { ...attributes } as Record<string, any>;

    // Si la clave cambió, eliminamos la vieja y creamos una nueva
    if (editingKey !== tempEdit.key) {
      delete newAttributes[editingKey];
    }

    let finalValue: any = tempEdit.value;
    if (tempEdit.isJson) {
      try {
        finalValue = JSON.parse(tempEdit.value);
      } catch {
        // si falla, mantener string
      }
    }
    newAttributes[tempEdit.key] = finalValue;
    setValue("attributes", newAttributes);
    cancelEditing();
  };

  const cancelEditing = () => {
    setEditingKey(null);
    setTempEdit({ key: "", value: "", isJson: false });
  };

  const deleteAttribute = (key: string) => {
    const newAttributes = { ...attributes };
    delete newAttributes[key];
    setValue("attributes", newAttributes);
  };

  const attributeKeys = Object.keys(attributes);

  const renderValuePreview = (val: any) => {
    if (val === null || val === undefined)
      return <span className="italic opacity-60">—</span>;
    if (typeof val === "object") {
      if (val.Name) return <span>{val.Name}</span>;
      const keys = Object.keys(val);
      return (
        <span className="text-xs text-orange-700 dark:text-orange-300">
          {"{"}
          {keys
            .slice(0, 3)
            .map((k) => `${k}: ${shorten(val[k])}`)
            .join(", ")}
          {keys.length > 3 ? ", …" : ""}
          {"}"}
        </span>
      );
    }
    return <span>{String(val)}</span>;
  };

  const shorten = (v: any) => {
    const s = typeof v === "object" ? JSON.stringify(v) : String(v ?? "");
    return s.length > 15 ? s.slice(0, 15) + "…" : s;
  };
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
              onChange={(e) => setNewKey(e.target.value)}
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
              onChange={(e) => setNewValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border border-orange-200 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-100 rounded px-3 py-2 w-full"
              maxLength={250}
              placeholder='Ej: ventas o {"Name":"Eritrea"}'
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
          {attributeKeys.map((key) => (
            <div
              key={key}
              className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-lg p-4"
            >
              {editingKey === key ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                    <input
                      type="text"
                      value={tempEdit.key}
                      onChange={(e) =>
                        setTempEdit({ ...tempEdit, key: e.target.value })
                      }
                      className="border border-orange-200 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-100 rounded px-3 py-2 w-full"
                      maxLength={50}
                    />
                    <div className="md:col-span-2 space-y-1">
                      <textarea
                        value={tempEdit.value}
                        onChange={(e) =>
                          setTempEdit({ ...tempEdit, value: e.target.value })
                        }
                        className="border h-24 resize-y border-orange-200 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-100 rounded px-3 py-2 w-full text-xs font-mono"
                        placeholder={
                          tempEdit.isJson ? '{"Name":"Eritrea"}' : "valor"
                        }
                      />
                      <label className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-300">
                        <input
                          type="checkbox"
                          checked={tempEdit.isJson}
                          onChange={(e) =>
                            setTempEdit({
                              ...tempEdit,
                              isJson: e.target.checked,
                            })
                          }
                        />
                        JSON
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={saveEditing}
                      className="bg-green-600 hover:bg-green-700 p-2"
                      disabled={
                        !tempEdit.key || (!tempEdit.value && !tempEdit.isJson)
                      }
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
                  <div className="pr-4">
                    <span className="font-medium text-orange-800 dark:text-orange-200">
                      {key}:{" "}
                    </span>
                    <span className="text-orange-600 dark:text-orange-300 break-all">
                      {renderValuePreview(attributes[key])}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
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
