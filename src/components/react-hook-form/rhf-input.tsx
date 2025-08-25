import { Controller, useFormContext } from "react-hook-form";
import { CSSProperties, ChangeEvent, ReactNode, useState } from "react";
import InputWithLabel from "../input/input-with-label";
import { cn } from "@/lib/utils";
import TextArea from "../input/text-area";
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// ----------------------------------------------------------------------

interface Props
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "onBlur" | "value" | "size"
  > {
  name: string;
  type?: string;
  disabled?: boolean;
  size?: "small" | "medium";
  label?: ReactNode |  string;
  placeholder?: string;
  underLabel?: string;
  width?: CSSProperties["width"];
  required?: boolean;
  dataTest?: string;
  autoComplete?: string;
  isNotAccountant?: boolean;
  minMax?: { min: number; max: number };
  showError?: boolean;
  containerClassname?: string;
  rows?: number;
}

export default function RHFInputWithLabel({
  name,
  type = "text",
  disabled,
  size,
  label,
  placeholder,
  underLabel,
  width,
  required,
  dataTest,
  autoComplete,
  isNotAccountant,
  minMax,
  showError = true,
  containerClassname,
  rows = 3,
  ...rest
}: Props) {
  const { control } = useFormContext();

  // Estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  const handleChange =
    (onChange: (...event: any) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      if (type === "number") {
        if (isNotAccountant) {
          onChange(+event.target.value);
        } else {
          handleNumberChange(event?.target.value, onChange);
        }
      } else {
        onChange(event?.target.value);
      }
    };

  const handleNumberChange = (value: string, onChange: any) => {
    if (value === "") {
      onChange("");
      return;
    }

    // Permitir números decimales válidos
    if (/^\d*\.?\d*$/.test(value)) {
      // Si termina con punto, mantener como string para permitir escribir el decimal
      if (value.endsWith(".")) {
        onChange(value);
      } else {
        const numericValue = parseFloat(value);
        onChange(isNaN(numericValue) ? 0 : numericValue);
      }
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onBlur, onChange, value },
        fieldState: { error },
      }) =>
        type === "textarea" ? (
          <div
            className={cn("flex flex-col gap-1", containerClassname)}
            style={{ width }}
          >
            {label && (
              <label
                htmlFor={name}
                className="text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                {label}
                {required && " *"}
              </label>
            )}
            <TextArea
              id={name}
              placeholder={placeholder}
              rows={rows}
              onChange={(e) => onChange(e)}
              onBlur={onBlur}
              value={value}
              disabled={disabled}
            />
            {underLabel && (
              <small className="text-sm text-gray-500">{underLabel}</small>
            )}
            {showError && error && (
              <span className="text-sm text-red-600">{error.message}</span>
            )}
          </div>
        ) : type === "tel" ? (
          <div
            className={cn(
              "w-full flex flex-col gap-1 relative",
              containerClassname
            )}
            style={{ width }}
          >
            <div className={cn("flex flex-col", label && "gap-1")}>
              <div className="flex flex-col gap-1">
                {label && (
                  <label
                    htmlFor={name}
                    className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    {label}
                    {required && "*"}
                  </label>
                )}
                {underLabel && (
                  <p className="font-normal text-xs text-gray-600">
                    {underLabel}
                  </p>
                )}
              </div>
              <div className="relative">
                {/** Normalize initial value to E.164 (strip spaces/dashes). If it's not international, try parsing with default country. */}
                {(() => {
                  const toE164OrUndefined = (raw?: string) => {
                    if (!raw) return undefined;
                    const trimmed = String(raw).trim();
                    if (!trimmed) return undefined;
                    if (trimmed.startsWith("+")) {
                      const digits = trimmed.replace(/[^0-9]/g, "");
                      return digits ? `+${digits}` : undefined;
                    }
                    // Attempt parse using the same default country as the input
                    const parsed = parsePhoneNumberFromString(trimmed, "US");
                    return parsed?.number as string | undefined;
                  };
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const _ = toE164OrUndefined; // keep function for below use
                  return null;
                })()}
                <PhoneInput
                  id={name}
                  value={(() => {
                    const raw = (value as string) ?? undefined;
                    if (!raw) return undefined;
                    const trimmed = String(raw).trim();
                    if (!trimmed) return undefined;
                    if (trimmed.startsWith("+")) {
                      const digits = trimmed.replace(/[^0-9]/g, "");
                      return digits ? `+${digits}` : undefined;
                    }
                    const parsed = parsePhoneNumberFromString(trimmed, "US");
                    return parsed?.number as string | undefined;
                  })()}
                  onChange={(val) => onChange(val)}
                  onBlur={onBlur as any}
                  defaultCountry="US"
                  disabled={disabled}
                  placeholder={placeholder}
                  className="w-full"
                  numberInputProps={{
                    id: name,
                    name,
                    autoComplete: autoComplete || "tel",
                    "data-test": dataTest,
                    className: cn(
                      "form-input", // base style to match InputWithLabel
                      size === "small" ? "form-input-sm" : "form-input",
                      showError &&
                        error &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500",
                      disabled && "cursor-not-allowed opacity-50"
                    ),
                    style: { width },
                  }}
                />

                {/* Nota: El componente agrega su propio selector de país a la izquierda */}
              </div>
            </div>
            {showError && error && (
              <p className="text-xs ml-3 text-red-500">{error.message}</p>
            )}
          </div>
        ) : (
          <InputWithLabel
            required={required}
            placeholder={placeholder}
            underLabel={underLabel}
            label={label}
            onBlur={onBlur}
            onChange={handleChange(onChange)}
            value={value}
            id={name}
            error={showError ? error : undefined}
            disabled={disabled}
            type={type === "password" && !showPassword ? "password" : "text"}
            size={size}
            width={width}
            dataTest={dataTest}
            autoComplete={autoComplete}
            minMax={minMax}
            togglePasswordVisibility={() => setShowPassword(!showPassword)}
            showPassword={showPassword}
            isPassword={type === "password"}
            containerClassname={containerClassname}
            {...rest}
          />
        )
      }
    />
  );
}
