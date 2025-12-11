"use client";

import * as React from "react";

// import { ShadCnButton as Button } from "@/components/button/shadcn-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "../input/calendar";

interface DatePickerProps {
  date: Date;
  handleSelectDate: (date?: Date) => void;
  containerClassname?: string;
  buttonClassname?: string;
  calendarClassname?: string;
}

export function DatePicker({
  date,
  handleSelectDate,
  containerClassname,
  buttonClassname,
  calendarClassname,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  // Estado para el mes actual mostrado en el calendario
  const isValidDate = (d: any) => d instanceof Date && !isNaN(d.getTime());
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    isValidDate(date) ? date : new Date()
  );
  const [inputValue, setInputValue] = React.useState<string>(
    isValidDate(date) ? format(date, "dd/MM/yyyy") : ""
  );
  const [error, setError] = React.useState<string>("");

  // Si cambia la fecha seleccionada desde fuera, actualiza el mes mostrado y el input
  React.useEffect(() => {
    if (isValidDate(date)) {
      setCurrentMonth(date);
      setInputValue(format(date, "dd/MM/yyyy"));
      setError("");
    } else {
      setInputValue("");
    }
  }, [date]);

  // Valida si la fecha es válida considerando días, meses y rango de años
  function isValidDateString(str: string): boolean {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      setError("Formato inválido (dd/mm/aaaa)");
      return false;
    }
    const [dd, mm, yyyy] = str.split("/").map(Number);
    if (mm < 1 || mm > 12) {
      setError("Mes inválido");
      return false;
    }
    if (dd < 1) {
      setError("Día inválido");
      return false;
    }
    const daysInMonth = new Date(yyyy, mm, 0).getDate();
    if (dd > daysInMonth) {
      setError("Día inválido para el mes");
      return false;
    }

    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 102;
    const maxYear = currentYear - 16;
    if (yyyy < minYear || yyyy > maxYear) {
      setError(`El año debe estar entre ${minYear} y ${maxYear}`);
      return false;
    }

    setError("");
    return true;
  }

  const handleDateChange = (selectedDate: Date | undefined) => {
    setOpen(false);
    if (handleSelectDate) {
      handleSelectDate(selectedDate);
    }
    if (selectedDate) {
      setCurrentMonth(selectedDate);
      setInputValue(format(selectedDate, "dd/MM/yyyy"));
      setError("");
    }
  };

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  // Maneja el cambio en el input con máscara
  const [touched, setTouched] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length === 10) {
      if (isValidDateString(value)) {
        const parsed = parse(value, "dd/MM/yyyy", new Date());
        if (!isNaN(parsed.getTime())) {
          handleSelectDate(parsed);
          setCurrentMonth(parsed);
          setError("");
        } else {
          setError("");
        }
      } else {
        setError("");
      }
    } else {
      setError("");
    }
  };

  const handleInputBlur = () => {
    setTouched(true);
    if (inputValue.length === 10) {
      if (isValidDateString(inputValue)) {
        const parsed = parse(inputValue, "dd/MM/yyyy", new Date());
        if (isNaN(parsed.getTime())) {
          setError("No existe esa fecha");
        } else {
          setError("");
        }
      }
    } else if (inputValue.length > 0) {
      setError("No existe esa fecha");
    } else {
      setError("");
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", containerClassname)}>
      <div className="relative flex items-center">
        <input
          className={cn(
            "w-full border rounded-md px-3 py-2 font-normal pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500",
            buttonClassname
          )}
          placeholder="dd/mm/aaaa"
          value={inputValue}
          type="text"
          inputMode="numeric"
          pattern="\\d{2}/\\d{2}/\\d{4}"
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-primary-500"
              tabIndex={-1}
              aria-label="Abrir calendario"
            >
              <CalendarDaysIcon className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className={cn("w-auto overflow-hidden p-0 z-[70] bg-white")}
            align="start"
          >
            <Calendar
              mode="single"
              locale={es}
              selected={date}
              onSelect={handleDateChange}
              className={cn("rounded-md border w-fit", calendarClassname)}
              startMonth={new Date(1930, 0)} // Enero 1930
              endMonth={new Date(2013, 11)} // Diciembre 2013
              month={currentMonth}
              onMonthChange={handleMonthChange}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      </div>
      {touched && error && (
        <span className="text-xs text-red-500 ml-1 -mt-1">{error}</span>
      )}
    </div>
  );
}
