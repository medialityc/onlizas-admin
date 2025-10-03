"use client";

import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";
import { useState } from "react";
import { UnexpectedProduct } from "@/types/transfer-reception";

interface Props {
  onSave: (product: UnexpectedProduct) => void;
  onCancel: () => void;
}

export default function UnexpectedProductForm({ onSave, onCancel }: Props) {
  const [formData, setFormData] = useState({
    productName: "",
    quantityReceived: 0,
    unit: "",
    batchNumber: "",
    observations: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "El nombre del producto es requerido";
    }

    if (formData.quantityReceived <= 0) {
      newErrors.quantityReceived = "La cantidad debe ser mayor a 0";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "La unidad es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave({
      ...formData,
      quantityReceived: Number(formData.quantityReceived),
    });

    // Reset form
    setFormData({
      productName: "",
      quantityReceived: 0,
      unit: "",
      batchNumber: "",
      observations: "",
    });
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-4">
        Agregar Producto No Esperado
      </h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre del Producto *
            </label>
            <Input
              value={formData.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
              placeholder="Ingrese el nombre del producto"
              className={errors.productName ? "border-red-500" : ""}
            />
            {errors.productName && (
              <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cantidad Recibida *
            </label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={formData.quantityReceived || ""}
              onChange={(e) => handleChange("quantityReceived", Number(e.target.value))}
              placeholder="0"
              className={errors.quantityReceived ? "border-red-500" : ""}
            />
            {errors.quantityReceived && (
              <p className="text-red-500 text-sm mt-1">{errors.quantityReceived}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unidad *
            </label>
            <select
              value={formData.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.unit ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
            >
              <option value="">Seleccionar unidad</option>
              <option value="kg">Kilogramos (kg)</option>
              <option value="g">Gramos (g)</option>
              <option value="l">Litros (l)</option>
              <option value="ml">Mililitros (ml)</option>
              <option value="unidades">Unidades</option>
              <option value="cajas">Cajas</option>
              <option value="paquetes">Paquetes</option>
            </select>
            {errors.unit && (
              <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Número de Lote
            </label>
            <Input
              value={formData.batchNumber}
              onChange={(e) => handleChange("batchNumber", e.target.value)}
              placeholder="Opcional"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Observaciones
          </label>
          <textarea
            value={formData.observations}
            onChange={(e) => handleChange("observations", e.target.value)}
            rows={2}
            placeholder="Añade cualquier observación sobre este producto..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            Agregar Producto
          </Button>
        </div>
      </form>
    </div>
  );
}