import React from "react";
import type { Promotion } from "@/types/promotions";
import Badge from "@/components/badge/badge";
import { useForm, FormProvider as RHFFormProvider, useWatch } from "react-hook-form";
import { RHFSwitch } from "@/components/react-hook-form";

export default function PromotionRow({ p, onToggle }: { p: Promotion; onToggle: (id: number, checked: boolean) => void }) {
  const methods = useForm<{ active: boolean }>({ defaultValues: { active: p.isActive } });
  const active = useWatch({ control: methods.control, name: "active" });

  // Solo sincroniza el form si el prop cambió respecto al valor actual
  React.useEffect(() => {
    const current = methods.getValues("active");
    if (current !== p.isActive) {
      methods.reset({ active: p.isActive });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.isActive]);

  // Llama al callback solo cuando el usuario realmente cambia el switch
  const prev = React.useRef<boolean | undefined>(methods.getValues("active"));
  React.useEffect(() => {
    if (typeof active !== "boolean") return;
    if (prev.current === active) return; // sin cambios reales
    prev.current = active;
    onToggle(p.id, active);
  }, [active, onToggle, p.id]);

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all select-none">
      <RHFFormProvider {...methods}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-900">{p.name}</h4>
            {p.isActive && <Badge variant="outline-primary" className="!text-[11px] !px-2 !py-0.5" rounded>Activa</Badge>}
            
          </div>
          {p.description && <p className="text-xs text-gray-500">{p.description}</p>}
          <div className="text-[11px] text-gray-500 mt-1">
            {p.code ? (<span className="font-medium">{p.code}</span>) : null}
            {p.startDate && p.endDate ? (
              <span className="ml-2">{p.startDate} - {p.endDate}</span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-indigo-600 font-semibold">
              {p.discountType === 0 ? `${p.discountValue}%` : `$${p.discountValue}`}
            </div>
            <div className="text-[11px] text-gray-500">{p.usedCount ?? 0} usos</div>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <RHFSwitch name="active" aria-label="Cambiar estado" checkedClassName="peer-checked:bg-gradient-to-r peer-checked:from-secondary peer-checked:to-indigo-600" />
          </div>
        </div>
      </div>
      </RHFFormProvider>
    </div>
  );
}
