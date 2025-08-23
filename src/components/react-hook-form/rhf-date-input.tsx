"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CSSProperties } from "react";
import DateInput from "../input/date-input";

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

export default function RHFDateInput({
  name,
  disabled = false,
  label,
  placeholder,
  underLabel,
  width,
  required = false,
  showError = true,
  containerClassName,
  className,
  minDate,
  maxDate,
  locale,
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
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <DateInput
          id={name}
          value={value as any}
          onChange={(d) => onChange(d)}
          onBlur={onBlur}
          placeholder={placeholder}
          label={label}
          underLabel={underLabel}
          disabled={disabled}
          required={required}
          error={showError ? error : undefined}
          width={width}
          className={className}
          containerClassName={containerClassName}
          showError={showError}
          minDate={minDate}
          maxDate={maxDate}
          locale={locale}
        />
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
