"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { es } from "date-fns/locale";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/label/label";
import MaskInputWithLabel from "@/components/input/mask-input-with-label";
import { Calendar } from "./calendar";
import { IconButton } from "./icon-buton";
export const selectClassNames = {
  container: "w-full",
  input:
    "ring-offset-background dark:bg-dark flex h-10 w-full rounded-md border border-gray-200 bg-white py-2 text-sm transition-colors placeholder:text-gray-400 focus-visible:border-primary focus-visible:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-white pl-3 pr-3",
  menu: "dark:bg-dark absolute top-full right-0 left-0 z-20 mt-1 max-h-56 overflow-auto rounded-md border border-gray-200 bg-white shadow-md dark:border-gray-700",
  item: "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800",
};
function formatDate(date: Date | string | undefined) {
  if (!date) {
    return "";
  }

  let d: Date | undefined;

  if (date instanceof Date) {
    d = date;
  } else if (typeof date === "string") {
    // Try native parsing first (handles ISO and common formats)
    const nativeParsed = new Date(date);
    if (!isNaN(nativeParsed.getTime())) {
      d = nativeParsed;
    } else {
      // Fallback: parse dd/MM/yyyy with optional time HH:mm:ss
      const match = date.match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}):(\d{2}))?$/,
      );
      if (match) {
        const [, dd, mm, yyyy, hh = "0", min = "0", ss = "0"] = match;
        const parsed = new Date(
          Number(yyyy),
          Number(mm) - 1,
          Number(dd),
          Number(hh),
          Number(min),
          Number(ss),
        );
        if (!isNaN(parsed.getTime())) {
          d = parsed;
        }
      }
    }
  }

  if (!d) {
    // If we cannot parse, return the original string to avoid errors
    return typeof date === "string" ? date : "";
  }

  // Return in dd/mm/yyyy format
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  return `${dd}/${mm}/${yyyy}`;
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

// Parse user input into a Date without enforcing format while typing.
// Supports common formats: yyyy-MM-dd, dd/MM/yyyy, dd-MM-yyyy, compact numeric ddMMyyyy/dMyyyy, and native parse fallback.
function parseInputToDate(input: string): Date | undefined {
  const str = input.trim();
  if (!str) return undefined;

  // Compact numeric formats without separators
  // Examples:
  //   342020   -> 3/4/2020 (dMyyyy)
  //   03042020 -> 03/04/2020 (ddMMyyyy)
  const onlyDigits = str.replace(/\D/g, "");
  if (onlyDigits.length === str.length) {
    // ddMMyyyy (8 digits)
    if (onlyDigits.length === 8) {
      const dd = onlyDigits.slice(0, 2);
      const mm = onlyDigits.slice(2, 4);
      const yyyy = onlyDigits.slice(4);
      const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      if (isValidDate(parsed)) return parsed;
    }

    // dMyyyy (6 digits), e.g. 342020 -> 3/4/2020
    if (onlyDigits.length === 6) {
      const d = onlyDigits.slice(0, 1);
      const m = onlyDigits.slice(1, 2);
      const yyyy = onlyDigits.slice(2);
      const parsed = new Date(Number(yyyy), Number(m) - 1, Number(d));
      if (isValidDate(parsed)) return parsed;
    }
  }

  // ISO-like: yyyy-MM-dd
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, yyyy, mm, dd] = isoMatch;
    const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return isValidDate(parsed) ? parsed : undefined;
  }

  // Day-first with separators: dd/MM/yyyy or dd-MM-yyyy
  const dmMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmMatch) {
    const [, dd, mm, yyyy] = dmMatch;
    const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return isValidDate(parsed) ? parsed : undefined;
  }

  // Fallback to native parse (handles full month names and locales sometimes)
  const nativeParsed = new Date(str);
  return isValidDate(nativeParsed) ? nativeParsed : undefined;
}

export type DayPickerWithInputProps = {
  id?: string;
  label?: string;
  value?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  labelClassName?: string;
  onInputBlur?: () => void;
  onInputKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  required?: boolean;
};

export function DayPickerWithInput({
  id = "date",
  label = "Fecha de suscripción",
  value: controlledDate,
  onChange,
  placeholder = "01 de junio de 2025",
  labelClassName,
  onInputBlur,
  onInputKeyDown,
  required = false,
}: DayPickerWithInputProps) {
  const [open, setOpen] = React.useState(false);
  const isControlled = controlledDate !== undefined;
  const [date, setDate] = React.useState<Date | undefined>(controlledDate);
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));

  // // Sync internal state when controlled value changes
  React.useEffect(() => {
    if (controlledDate) {
      setDate(controlledDate);
      setMonth(controlledDate);
      setValue(formatDate(controlledDate));
    } else if (isControlled) {
      // If controlled and cleared, reset internal state as well
      setDate(undefined);
      setMonth(undefined);
      setValue("");
    }
  }, [controlledDate, isControlled]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className={labelClassName ?? "px-1"}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative flex gap-2">
        <MaskInputWithLabel
          className={selectClassNames.input}
          required={required}
          mask={[
            /[0-3]/,
            /[0-9]/,
            "/",
            /[0-1]/,
            /[1-9]/,
            "/",
            /[1-2]/,
            /[0-9]/,
            /[0-9]/,
            /[0-9]/,
          ]}
          placeholder={placeholder}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          value={value}
          id={id}
          type={"text"}
          onBlur={() => {
            // Parse and validate only when the user finishes (onBlur)
            const parsed = parseInputToDate(value);
            if (parsed) {
              setDate(parsed);
              setMonth(parsed);
              setValue(formatDate(parsed));
              onChange?.(parsed);
            } else {
              // If invalid, keep text as-is to allow correction.
              // If the field is empty, propagate undefined.
              if (!value) {
                setDate(undefined);
                setMonth(undefined);
                onChange?.(undefined);
              }
            }
            onInputBlur?.();
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <IconButton
              id={`${id}-picker`}
              variant="ghost"
              icon={<CalendarIcon className="size-3.5" />}
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <span className="sr-only">Select date</span>
            </IconButton>
          </PopoverTrigger>
          <PopoverContent
            alignOffset={40}
            sideOffset={-80}
            sticky="always"
            updatePositionStrategy="always"
            className="z-100 w-auto p-0"
            align="end"
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              locale={es}
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date);
                setValue(formatDate(date));
                onChange?.(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
