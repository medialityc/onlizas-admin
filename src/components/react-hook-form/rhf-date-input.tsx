"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CSSProperties } from "react";
import { Label } from "@/components/label/label";

// ----------------------------------------------------------------------

interface Props {
  name: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  underLabel?: string;
  width?: CSSProperties["width"];
  required?: boolean;
  showError?: boolean;
  containerClassName?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  validate?: (value?: Date) => boolean | string;
}

function toInputValue(val: Date | string | null | undefined): string {
  if (!val) return "";
  const d = val instanceof Date ? val : new Date(val);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10); // yyyy-MM-dd
}

function toDate(val: string): Date | undefined {
  if (!val) return undefined;
  const d = new Date(val);
  return isNaN(d.getTime()) ? undefined : d;
}

export default function RHFDateInput({
  name,
  disabled = false,
  label,
  underLabel,
  required = false,
  showError = true,
  containerClassName,
  className,
  minDate,
  maxDate,
  validate,
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? "Este campo es requerido" : false,
        validate,
      }}
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
      }) => (
        <div
          className={`flex flex-col w-full gap-1.5 ${containerClassName ?? ""}`}
        >
          {label && (
            <Label htmlFor={name} className="px-1">
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
          )}
          <input
            ref={ref}
            id={name}
            type="date"
            disabled={disabled}
            required={required}
            min={minDate ? toInputValue(minDate) : undefined}
            max={maxDate ? toInputValue(maxDate) : undefined}
            value={toInputValue(value)}
            onBlur={onBlur}
            onChange={(e) => onChange(toDate(e.target.value))}
            className={`block h-10 w-full rounded-md border px-3 py-2 text-sm
              bg-white text-gray-900
              border-gray-200
              focus-visible:outline-none focus-visible:border-primary
              disabled:cursor-not-allowed disabled:opacity-50
              dark:bg-dark dark:text-white dark:border-gray-700
              [&::-webkit-date-and-time-value]:w-full [&::-webkit-date-and-time-value]:text-left
              ${error ? "border-red-500 focus-visible:border-red-500" : ""}
              ${className ?? ""}`}
          />
          {underLabel && (
            <p className="px-1 text-xs text-gray-500 dark:text-gray-400">
              {underLabel}
            </p>
          )}
          {showError && error && (
            <p className="px-1 text-xs text-red-500">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}

/*
Ejemplo de uso:

import { useForm, FormProvider } from "react-hook-form"
import RHFDateInput from "./rhf-date-input"

interface FormData {
  birthDate: Date
  eventDate: Date
  appointmentDate: Date
}

function MyForm() {
  const methods = useForm<FormData>()
  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  const today = new Date()
  const nextWeek = new Date()
  nextWeek.setDate(today.getDate() + 7)

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <RHFDateInput
          name="birthDate"
          label="Fecha de nacimiento"
          placeholder="Selecciona tu fecha de nacimiento"
          required
          maxDate={today} // No puede ser una fecha futura
        />
        
        <RHFDateInput
          name="eventDate"
          label="Fecha del evento"
          underLabel="La fecha debe ser posterior a hoy"
          minDate={today} // No puede ser una fecha pasada
        />

        <RHFDateInput
          name="appointmentDate"
          label="Fecha de cita"
          placeholder="Selecciona una fecha disponible"
          minDate={today}
          maxDate={nextWeek}
          locale="en-US" // Formato en inglés
        />
        
        <button type="submit">Enviar</button>
      </form>
    </FormProvider>
  )
}
*/
