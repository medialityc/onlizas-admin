"use client";

import { gateways } from "@/services/data-for-gateway-settings/mock-datas";
import { Label } from "@/components/label/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/cards/card";
import { Input } from "@/components/input/input";

interface PaymentConfigFormProps {
  selectedPaymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
  priority: number;
  onPriorityChange: (value: number) => void;
  disabled?: boolean;
}

export function PaymentConfigForm({
  selectedPaymentMethod,
  onPaymentMethodChange,
  priority,
  onPriorityChange,
  disabled = false
}: PaymentConfigFormProps) {
  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    const clampedValue = Math.max(1, Math.min(100, value));
    onPriorityChange(clampedValue);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Seleccionar Método de Pago</Label>
        <Select value={selectedPaymentMethod} onValueChange={onPaymentMethodChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un método de pago" />
          </SelectTrigger>
          <SelectContent>
            {gateways.map((gateway: any) => (
              <SelectItem key={gateway.id} value={String(gateway.id)}>
                <div className="flex items-center space-x-2">
                  <span>{gateway.name}</span>
                  <span className="text-xs text-gray-500 capitalize">({gateway.type})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedPaymentMethod && (
        <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                Configuración del método de pago
              </h4>
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prioridad (1-100)
                </Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  max="100"
                  value={priority}
                  onChange={handlePriorityChange}
                  disabled={disabled}
                  className="max-w-32"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Mayor número = mayor prioridad. Este método aparecerá primero si tiene mayor prioridad.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}