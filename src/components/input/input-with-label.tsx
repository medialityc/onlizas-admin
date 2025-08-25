import { cn } from "@/lib/utils";
import { EyeIcon as EyeIconOutline } from "@heroicons/react/24/outline";
import { EyeIcon } from "@heroicons/react/24/solid";
import { CSSProperties, ChangeEvent, ReactNode, forwardRef } from "react";
import { FieldError } from "react-hook-form";

interface Props
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "onBlur" | "value" | "size" | "className"
  > {
  id: string;
  placeholder?: string;
  value: string | number;
  onChange: (_: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: FieldError;
  label?: ReactNode | string;
  underLabel?: string;
  disabled?: boolean;
  type?: string;
  maskValue?: string;
  size?: "small" | "medium" | "large";
  width?: CSSProperties["width"];
  required?: boolean;
  dataTest?: string;
  autoComplete?: string;
  minMax?: { min: number; max: number };
  className?: string;
  containerClassname?: string;
  // Nuevas props para manejar la contraseña
  togglePasswordVisibility?: () => void;
  showPassword?: boolean;
  isPassword?: boolean;
}

const sizes = {
  small: "form-input-sm",
  medium: "form-input",
  large: "form-input-lg",
};

const InputWithLabel = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      placeholder,
      value,
      containerClassname,
      onChange,
      onBlur,
      error: errorAlert,
      label,
      underLabel,
      disabled,
      type,
      required,
      size = "medium",
      width = "100%",
      dataTest,
      autoComplete,
      minMax,
      className,
      togglePasswordVisibility,
      showPassword = false,
      isPassword = false,
      maskValue,
      ...rest
    },
    ref
  ) => (
    <div
      className={cn("w-full flex flex-col gap-1 relative", containerClassname)}
      style={{ width }}
    >
      <div className={cn("flex flex-col", label && "gap-2")}>
        <div className="flex flex-col gap-1">
          {label && (
            <label
              htmlFor={id}
              className="text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              {label}
              {required && "*"}
            </label>
          )}
          {underLabel && (
            <p className="font-normal text-xs text-gray-600">{underLabel}</p>
          )}
        </div>
        <div className="relative">
          <div
            className={cn("relative", maskValue && "flex gap-2 items-center")}
          >
            {maskValue && (
              <div className="rounded-xl p-3 text-gray-800 border border-blue-500">
                {maskValue}
              </div>
            )}
            <input
              ref={ref}
              onFocus={(e) => {
                if (type === "number" && (value === 0 || value === "0")) {
                  e.target.select();
                }
              }}
              onKeyDown={(e) => {
                if (type === "number" && (value === 0 || value === "0")) {
                  // Si el usuario presiona un número, reemplazar el 0
                  if (e.key.match(/^[0-9]$/)) {
                    e.preventDefault();
                    onChange({
                      ...e,
                      target: {
                        ...e.target,
                        value: e.key,
                      },
                    } as unknown as ChangeEvent<HTMLInputElement>);
                  }
                }
              }}
              className={cn(
                "form-input",
                className,
                sizes[size],
                errorAlert &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500",
                disabled && "cursor-not-allowed opacity-50",
                // Añadir padding extra cuando hay ícono de ojo
                isPassword && "pr-10"
              )}
              autoComplete={autoComplete}
              required={required}
              type={type} // Ahora el tipo se controla desde el componente padre
              id={id}
              placeholder={placeholder}
              value={value}
              onChange={(e) => {
                if (type === "number" && (value === 0 || value === "0")) {
                  // Si el valor anterior era 0, reemplazarlo por el nuevo valor
                  if (
                    e.target.value.length === 2 &&
                    e.target.value.startsWith("0")
                  ) {
                    e.target.value = e.target.value.slice(1);
                  }
                }
                onChange(e as unknown as ChangeEvent<HTMLInputElement>);
              }}
              onBlur={onBlur}
              disabled={disabled}
              data-test={dataTest}
              style={{ width }}
              min={minMax?.min}
              max={minMax?.max}
              {...rest}
            />
          </div>

          {/* Botón para mostrar/ocultar contraseña */}
          {isPassword && (
            <span className="absolute end-4 top-1/2 -translate-y-1/2">
              <button
                type="button" // Importante para evitar submit accidental
                onClick={togglePasswordVisibility}
                className="text-gray-500 size-5 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeIconOutline /> : <EyeIcon />}
              </button>
            </span>
          )}
        </div>
      </div>

      {errorAlert && (
        <p className="text-xs ml-3 text-red-500">{errorAlert.message}</p>
      )}
    </div>
  )
);

InputWithLabel.displayName = "InputWithLabel";

export default InputWithLabel;
