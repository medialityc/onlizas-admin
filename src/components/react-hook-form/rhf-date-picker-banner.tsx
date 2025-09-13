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
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        // If value comes as an ISO string (from backend/defaults), convert to Date for the picker
        let valueDate: Date | undefined;
        if (value instanceof Date) {
          valueDate = value;
        } else if (typeof value === "string" && value) {
          const parsed = new Date(value);
          if (!isNaN(parsed.getTime())) valueDate = parsed;
        }

        return (
          <div className={containerClassName}>
            {label && (
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 block" htmlFor={name}>
                {label}
              </label>
            )}
            <DatePickerBanner
              date={valueDate??new Date()}
              handleSelectDate={onChange}
              minDate={minDate}
            />
            {error && (
              <span className="text-xs text-red-600 mt-1 block">{error.message}</span>
            )}
          </div>
        );
      }}
    />
  );
}
