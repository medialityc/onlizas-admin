"use client";

import * as React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import MaskedInput from "react-text-mask";
import { Calendar } from "../input/calendar";

interface DatePickerBannerProps {
  date: Date;
  handleSelectDate: (date?: Date) => void;
  containerClassname?: string;
  buttonClassname?: string;
  calendarClassname?: string;
  minDate?: Date;
}

export function DatePickerBanner({
  date,
  handleSelectDate,
  containerClassname,
  buttonClassname,
  calendarClassname,
  minDate,
}: DatePickerBannerProps) {
  const [open, setOpen] = React.useState(false);
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

  // Valida si la fecha es válida para banners (desde hoy hasta 10 años en el futuro)
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
    const minYear = minDate ? minDate.getFullYear() : currentYear;
    const maxYear = currentYear + 10; // Hasta 10 años en el futuro
    
    if (yyyy < minYear || yyyy > maxYear) {
      setError(`El año debe estar entre ${minYear} y ${maxYear}`);
      return false;
    }

    // Validar que no sea anterior a la fecha mínima si está especificada
    if (minDate) {
      const inputDate = new Date(yyyy, mm - 1, dd);
      if (inputDate < minDate) {
        setError("No se pueden seleccionar fechas anteriores al día actual");
        return false;
      }
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

  // Configurar rangos de fechas para banners
  const currentDate = new Date();
  const startMonth = minDate || currentDate;
  const endMonth = new Date(currentDate.getFullYear() + 10, 11); // 10 años en el futuro

  return (
    <div className={cn("flex flex-col gap-3", containerClassname)}>
      <div className="relative flex items-center">
        <MaskedInput
          mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
          className={cn(
            "w-full border rounded-md px-3 py-2 font-normal pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500",
            buttonClassname
          )}
          placeholder="dd/mm/aaaa"
          value={inputValue}
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
              startMonth={startMonth}
              endMonth={endMonth}
              month={currentMonth}
              onMonthChange={handleMonthChange}
              captionLayout="dropdown"
              disabled={(date) => minDate ? date < minDate : false}
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
