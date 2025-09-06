import { useFormContext } from "react-hook-form";
import { useState } from "react";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { RadioGroup, RadioGroupItem } from "@/components/radio/radio-group";

type RequirementMode = "none" | "minAmount" | "minItems";

export default function PurchaseRequirements({ amountName = "minimumAmount", itemsName = "minimumItems" }: { amountName?: string; itemsName?: string }) {
  const { control, watch, setValue } = useFormContext();
  const [mode, setMode] = useState<RequirementMode>(() => {
    // Determinar el modo inicial basado en los valores existentes
    const amount = watch(amountName);
    const items = watch(itemsName);
    if (amount && amount > 0) return "minAmount";
    if (items && items > 0) return "minItems";
    return "none";
  });

  // Función para manejar cambio de modo y limpiar valores
  const handleModeChange = (newMode: RequirementMode) => {
    setMode(newMode);
    
    // Limpiar valores cuando se cambia de modo
    if (newMode !== "minAmount") {
      setValue(amountName, undefined);
    }
    if (newMode !== "minItems") {
      setValue(itemsName, undefined);
    }
  };

  return (
    <div className="space-y-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded border border-gray-200 dark:border-gray-700 p-4">
      <RadioGroup value={mode} onValueChange={(v: any) => handleModeChange(v)} className="text-gray-900 dark:text-gray-100" >
        <div className="py-1">
          <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
            <RadioGroupItem value="none" />
            <span className="text-sm">Ningún requisito</span>
          </div>
        </div>

        <div className="py-1">
          <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
            <RadioGroupItem value="minAmount" />
            <span className="text-sm">Cantidad mínima de compra</span>
          </div>
          {mode === "minAmount" && (
            <div className="mt-3 w-40">
              {/* RHFInputWithLabel already uses Controller internally, avoid wrapping it again */}
              <RHFInputWithLabel name={amountName} label="Monto mínimo" type="number" />
            </div>
          )}
        </div>

        <div className="py-1">
          <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
            <RadioGroupItem value="minItems" />
            <span className="text-sm">Mínimo de artículos totales en el pedido</span>
          </div>
          {mode === "minItems" && (
            <div className="mt-3 w-40">
              {/* Use native number input so RHFInputWithLabel parses to number */}
              <RHFInputWithLabel name={itemsName} label="Cantidad mínima" type="number" />
            </div>
          )}
        </div>
      </RadioGroup>
    </div>
  );
}
