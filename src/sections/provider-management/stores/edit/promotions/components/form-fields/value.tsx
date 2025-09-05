import { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";

type ValueType = 0 | 1 | 2 | 3; // 0=percent, 1=amount, 2=free, 3=freedelivery

interface Props {
  /** RHF field name for the selected type */
  typeName?: string;
  /** RHF field name for the numeric value */
  valueName?: string;
  /** Which options to show */
  showPercent?: boolean;
  showAmount?: boolean;
  showFree?: boolean;
  showFreeDelivery?: boolean;
  /** Default selected type */
  defaultType?: ValueType;
  /** Labels */
  percentLabel?: string;
  amountLabel?: string;
  freeLabel?: string;
  freeDeliveryLabel?: string;
}

export default function ValueSelector({
  typeName = "valueType",
  valueName = "value",
  showPercent = true,
  showAmount = true,
  showFree = true,
  showFreeDelivery = false,
  defaultType,
  percentLabel = "%",
  amountLabel = "Monto",
  freeLabel = "Free",
  freeDeliveryLabel = "Entrega Gratuita",
}: Props) {
  const { watch, setValue, register, control, formState } = useFormContext();
  // Watch raw value (could be number or string coming from backend/defaults)
  const rawType = watch(typeName);

  // Compute an effective numeric type. If the form already has a value, coerce to Number.
  // Otherwise fall back to defaultType or available options.
  const fallbackType: ValueType = (defaultType as ValueType) ?? (showPercent ? 0 : showAmount ? 1 : showFree ? 2 : showFreeDelivery ? 3 : 0);
  const currentType: ValueType | null = rawType === undefined || rawType === null ? null : (Number(rawType) as ValueType);

  useEffect(() => {
    // Initialize the form field only if it's truly undefined (don't override provided defaults)
    if (rawType === undefined || rawType === null) {
      setValue(typeName, fallbackType, { shouldDirty: false, shouldValidate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawType, fallbackType, setValue, typeName]);

  const selectType = (t: ValueType) => {
    setValue(typeName, t, { shouldDirty: true, shouldValidate: true });
    // For free types ensure a numeric 0 value is set (schemas may expect a number)
    if (t === 2 || t === 3) setValue(valueName, 0, { shouldDirty: true, shouldValidate: false });
  };

  const pillClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-sm font-medium transition ${
      active ? "bg-violet-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row md:items-start md:gap-4">
        <div className="flex gap-2 items-center flex-wrap">
          {showPercent && (
            <button type="button" onClick={() => selectType(0)} className={pillClass(currentType === 0)}>
              Porcentaje
            </button>
          )}

          {showAmount && (
            <button type="button" onClick={() => selectType(1)} className={pillClass(currentType === 1)}>
              Cantidad Fija
            </button>
          )}

          {showFree && (
            <button type="button" onClick={() => selectType(2)} className={pillClass(currentType === 2)}>
              {freeLabel}
            </button>
          )}

          {showFreeDelivery && (
            <button type="button" onClick={() => selectType(3)} className={pillClass(currentType === 3)}>
              {freeDeliveryLabel}
            </button>
          )}
        </div>

        {/* Value input: show only for percent/amount - placed to the right on md+ */}
  {((currentType !== null ? currentType : fallbackType) !== 2) && ((currentType !== null ? currentType : fallbackType) !== 3) && (
          <div className="mt-3 md:mt-0 md:flex-shrink-0 md:w-64">
            {/* Local input that looks like the shared input but includes the symbol inside the field */}
            <Controller
              control={control}
              name={valueName}
              render={({ field, fieldState }) => {
    const effective = currentType !== null ? currentType : fallbackType;
    const symbol = effective === 0 ? "%" : "$";

                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                  const v = e.target.value;
                  if (v === "") {
                    field.onChange("");
                    return;
                  }
                  // allow decimals
                  if (/^\d*\.?\d*$/.test(v)) {
                    if (v.endsWith(".")) {
                      field.onChange(v);
                    } else {
                      const numeric = parseFloat(v);
                      field.onChange(isNaN(numeric) ? 0 : numeric);
                    }
                  }
                };

                return (
                  <>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">{symbol}</span>
                      <input
                        {...field}
                        type="text"
                        onChange={handleChange}
                        placeholder={effective === 0 ? "0" : "0.00"}
                        className="form-input pl-10 w-full"
                      />
                    </div>
                    {fieldState.error && (fieldState.isTouched || fieldState.isDirty || formState.isSubmitted) && (
                      <p className="text-xs text-red-600 mt-1">{fieldState.error.message}</p>
                    )}
                  </>
                );
              }}
            />
          </div>
        )}
      </div>

  {/* Hidden input to keep type in form (register ensures the field exists for watch/setValue) */}
  <input {...register(typeName)} type="hidden" />
    </div>
  );
}
