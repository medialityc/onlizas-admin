"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";

interface Props {
  name: string;
  label?: string;
  containerClassName?: string;
}

export default function RHFDatePicker({ name, label, containerClassName }: Props) {
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
          <DatePicker date={value as Date} handleSelectDate={onChange} />
          {error && (
            <span className="text-xs text-red-600 mt-1 block">{error.message}</span>
          )}
        </div>
      )}
    />
  );
}
