"use client";

import { Label } from "@/components/label/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ShippingConfigFormProps {
  selectedShippingMethod: string;
  onShippingMethodChange: (value: string) => void;
  disabled?: boolean;
}

const shippingMethods = [
  { id: 1, name: 'Entrega Estándar', description: 'Entrega en 5-7 días hábiles' },
  { id: 2, name: 'Entrega Express', description: 'Entrega en 1-2 días hábiles' },
  { id: 3, name: 'Recogida en Tienda', description: 'El cliente recoge en punto físico' },
  { id: 4, name: 'Envío Internacional', description: 'Entrega fuera del país' },
];

export function ShippingConfigForm({
  selectedShippingMethod,
  onShippingMethodChange,
  disabled = false
}: ShippingConfigFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Seleccionar Método de Entrega</Label>
        <Select value={selectedShippingMethod} onValueChange={onShippingMethodChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un método de entrega" />
          </SelectTrigger>
          <SelectContent>
            {shippingMethods.map((method) => (
              <SelectItem key={method.id} value={String(method.id)}>
                <div className="flex flex-col">
                  <span className="font-medium">{method.name}</span>
                  <span className="text-xs text-gray-500">{method.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedShippingMethod && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Método seleccionado
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {shippingMethods.find(m => m.id === parseInt(selectedShippingMethod))?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}