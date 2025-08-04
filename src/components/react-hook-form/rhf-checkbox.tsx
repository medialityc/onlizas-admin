// components/rhf/rhf-checkbox.tsx
"use client";

import { Controller, useFormContext } from "react-hook-form";
import React from "react";
import Checkbox from "../checkbox/checkbox";

interface RHFCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  name: string;
  label?: string;
  underLabel?: string;
  required?: boolean;
  showError?: boolean;
}

export default function RHFCheckbox({
  name,
  label = "",
  underLabel,
  required = false,
  disabled = false,
  showError = true,
  ...rest
}: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({
        field: { onChange, onBlur, value = false, ref },
        fieldState: { error },
      }) => (
        <div className="mb-2">
          <label className="flex items-center cursor-pointer gap-2">
            <Checkbox
              ref={ref}
              checked={value}
              disabled={disabled}
              onCheckedChange={(checked) => onChange(checked)}
              onBlur={onBlur}
              label={label}
              {...rest}
            />
          </label>

          {underLabel && (
            <p
              className={`ml-6 text-sm text-white-dark ${disabled ? "opacity-50" : ""}`}
            >
              {underLabel}
            </p>
          )}

          {showError && error && (
            <p className="ml-6 text-sm text-red-500 mt-1">
              {error.message || "Este campo es requerido"}
            </p>
          )}
        </div>
      )}
    />
  );
}
