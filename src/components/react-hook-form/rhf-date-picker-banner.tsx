"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { DatePickerBanner } from "@/components/ui/date-picker-banner";

interface Props {
  name: string;
  label?: string;
  containerClassName?: string;
  minDate?: Date;
}

export default function RHFDatePickerBanner({ name, label, containerClassName, minDate }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className={containerClassName}>
          {label && (
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 block" htmlFor={name}>
              {label}
            </label>
          )}
          <DatePickerBanner 
            date={value as Date} 
            handleSelectDate={onChange} 
            minDate={minDate}
          />
          {error && (
            <span className="text-xs text-red-600 mt-1 block">{error.message}</span>
          )}
        </div>
      )}
    />
  );
}
