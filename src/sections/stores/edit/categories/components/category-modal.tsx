"use client";

import React, { useEffect, useState } from "react";
import SimpleModal from "@/components/modal/modal";

import type { StoreCategory } from "../mock";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<StoreCategory, "id" | "productCount" | "views">) => void;
  title?: string;
  initial?: Partial<StoreCategory> | null;
};

export default function CategoryModal({ open, onClose, onSubmit, title = "Nueva Categoría", initial }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setIsActive] = useState(true);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setDescription(initial?.description ?? "");
      setIsActive(initial?.active ?? true);
    }
  }, [open, initial]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim(), active });
    onClose();
  };

  return (
    <SimpleModal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border-gray-300 text-sm"
            placeholder="Ej. Laptops"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border-gray-300 text-sm"
            rows={3}
            placeholder="Breve descripción"
          />
        </div>
        <div className="flex items-center justify-between">
          <span id="cat-active-label" className="text-sm text-gray-700">Activa</span>
          <label className="w-12 h-6 relative" htmlFor="cat-active">
            <input
              type="checkbox"
              className="absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
              id="cat-active"
              aria-labelledby="cat-active-label"
              checked={active}
              onChange={(e) => setIsActive(e.currentTarget.checked)}
            />
            <span
              className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full overflow-hidden
              before:absolute before:left-1 before:bg-white dark:before:bg-white-dark 
              dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 
              before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary
              before:transition-all before:duration-300"
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs rounded-md border">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1.5 text-xs rounded-md bg-gray-900 text-white hover:bg-black/90 disabled:opacity-50"
            disabled={!name.trim()}
          >
            Guardar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
