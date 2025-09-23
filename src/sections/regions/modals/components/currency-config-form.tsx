"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllCurrencies } from "@/services/currencies";
import { Label } from "@/components/label/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/cards/card";

interface CurrencyConfigFormProps {
  selectedCurrency: string;
  onCurrencyChange: (value: string) => void;
  isPrimary: boolean;
  onPrimaryChange: (value: boolean) => void;
  disabled?: boolean;
}

export function CurrencyConfigForm({
  selectedCurrency,
  onCurrencyChange,
  isPrimary,
  onPrimaryChange,
  disabled = false
}: CurrencyConfigFormProps) {
  // Fetch currencies
  const { data: currenciesResp } = useQuery({
    queryKey: ['currencies'],
    queryFn: () => getAllCurrencies({ page: 1, limit: 200 }),
  });

  const currencies = currenciesResp?.data?.data || [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Seleccionar Moneda</Label>
        <Select value={selectedCurrency} onValueChange={onCurrencyChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una moneda" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency: any) => (
              <SelectItem key={currency.id} value={String(currency.id)}>
                {currency.codIso} - {currency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedCurrency && (
        <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                Configuración de la moneda
              </h4>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={isPrimary}
                  onChange={(e) => onPrimaryChange(e.target.checked)}
                  disabled={disabled}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <Label htmlFor="isPrimary" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Moneda primaria de la región
                </Label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                La moneda primaria será la predeterminada para transacciones en esta región
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}