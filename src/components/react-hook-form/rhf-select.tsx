import { Controller, useFormContext } from "react-hook-form";
import { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// ----------------------------------------------------------------------

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface Props
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "onChange" | "onBlur" | "value" | "size"
  > {
  name: string;
  disabled?: boolean;
  size?: "small" | "medium";
  label?: string;
  placeholder?: string;
  underLabel?: string;
  width?: CSSProperties["width"];
  required?: boolean;
  dataTest?: string;
  showError?: boolean;
  containerClassname?: string;
  options: SelectOption[];
  emptyOption?: string; // Texto para la opción vacía
  multiple?: boolean;
}

export default function RHFSelectWithLabel({
  name,
  disabled,
  size = "medium",
  label,
  placeholder = "Seleccionar...",
  underLabel,
  width,
  required,
  dataTest,
  showError = true,
  containerClassname,
  options = [],
  emptyOption,
  multiple = false,
  ...rest
}: Props) {
  const { control } = useFormContext();

  const handleChange =
    (onChange: (...event: any) => void) =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (multiple) {
        // Para múltiples opciones, convertir HTMLCollection a array de valores
        const selectedValues = Array.from(event.target.selectedOptions).map(
          (option) => option.value
        );
        onChange(selectedValues);
      } else {
        // Para una sola opción
        onChange(event.target.value);
      }
    };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "px-3 py-2 text-sm";
      case "medium":
      default:
        return "px-4 py-3 text-base";
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onBlur, onChange, value },
        fieldState: { error },
      }) => (
        <div
          className={cn("flex flex-col gap-1", containerClassname)}
          style={{ width }}
        >
          {label && (
            <label
              className={cn(
                "text-sm font-medium text-gray-700 dark:text-gray-300",
                required && "after:content-['*'] after:text-red-500 after:ml-1"
              )}
              htmlFor={name}
            >
              {label}
            </label>
          )}

          <div className="relative">
            <select
              id={name}
              onBlur={onBlur}
              onChange={handleChange(onChange)}
              value={
                multiple ? (Array.isArray(value) ? value : []) : value || ""
              }
              disabled={disabled}
              multiple={multiple}
              data-test={dataTest}
              className={cn(
                // Base styles
                "w-full rounded-lg border border-gray-300 dark:border-gray-600",
                "bg-white dark:bg-gray-800",
                "text-gray-900 dark:text-white",
                "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                "disabled:bg-gray-100 dark:disabled:bg-gray-700",
                "disabled:text-gray-500 dark:disabled:text-gray-400",
                "disabled:cursor-not-allowed",
                "transition-colors duration-200",
                // Size classes
                getSizeClasses(),
                // Error styles
                error &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500",
                // Multiple select specific
                multiple && "min-h-[120px]",
                // Single select specific - add padding for chevron
                !multiple && "pr-10 appearance-none"
              )}
              {...rest}
            >
              {/* Opción vacía para select simple */}
              {!multiple && (
                <option value="" disabled={required}>
                  {emptyOption || placeholder}
                </option>
              )}

              {/* Opciones dinámicas */}
              {options.map((option, index) => (
                <option
                  key={`${option.value}-${index}`}
                  value={option.value}
                  disabled={option.disabled}
                  className="text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                >
                  {option.label}
                </option>
              ))}
            </select>

            {/* Chevron icon para select simple */}
            {!multiple && (
              <ChevronDownIcon
                className={cn(
                  "absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5",
                  "text-gray-400 dark:text-gray-500 pointer-events-none",
                  disabled && "text-gray-300 dark:text-gray-600"
                )}
              />
            )}
          </div>

          {underLabel && (
            <small className="text-sm text-gray-500 dark:text-gray-400">
              {underLabel}
            </small>
          )}

          {showError && error && (
            <span className="text-sm text-red-600 dark:text-red-400">
              {error.message}
            </span>
          )}
        </div>
      )}
    />
  );
}
