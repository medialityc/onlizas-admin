"use client";

import { useState } from "react";
import { Label } from "@/components/label/label";
import { Card, CardContent } from "@/components/cards/card";
import { Input } from "@/components/input/input";
import { useQuery } from "@tanstack/react-query";
import { getAllGateways } from "@/services/gateways";
import { Select as SearchSelect } from "@/components/select/select";

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
  disabled = false,
}: PaymentConfigFormProps) {
  const [gatewayQuery, setGatewayQuery] = useState("");
  // Obtener las pasarelas desde el backend
  const { data: gatewaysResponse, isLoading } = useQuery({
    queryKey: ["gateways"],
    queryFn: async () => {
      const response = await getAllGateways();
      if (response.error) {
        return [];
      }
      return response.data || [];
    },
  });

  const gateways = gatewaysResponse || [];

  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    const clampedValue = Math.max(1, Math.min(100, value));
    onPriorityChange(clampedValue);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Seleccionar Método de Pago</Label>
        <SearchSelect
          options={gateways}
          objectValueKey="id"
          objectKeyLabel="name"
          placeholder={
            isLoading ? "Cargando..." : "Selecciona un método de pago"
          }
          value={selectedPaymentMethod ? selectedPaymentMethod : undefined}
          onChange={(value) =>
            onPaymentMethodChange(value !== undefined ? String(value) : "")
          }
          disabled={disabled || isLoading}
          query={gatewayQuery}
          setQuery={setGatewayQuery}
          displayValue={(gateway: any) => `${gateway.name} (${gateway.code})`}
        />
      </div>

      {selectedPaymentMethod && (
        <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                Configuración del método de pago
              </h4>
              <div className="space-y-2">
                <Label
                  htmlFor="priority"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
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
                  Mayor número = mayor prioridad. Este método aparecerá primero
                  si tiene mayor prioridad.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
