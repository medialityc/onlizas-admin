"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { getAduanaCategories } from "@/services/categories";

import { Label } from "@/components/label/label";
import { cn } from "@/lib/utils";
import { AduanaCategory } from "@/types/categories";
import { Loader2 } from "lucide-react"; // spinner icónico
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const SelectAduanalCategory: React.FC<Props> = ({
  name,
  label = "Categoría Aduanal",
  placeholder = "Selecciona una categoría",
  required = false,
  className,
}) => {
  const { control } = useFormContext();
  const [categories, setCategories] = useState<AduanaCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data } = await getAduanaCategories();
        if (data) {
          setCategories(data as any);
        }
      } catch (error) {
        console.error("Error cargando categorías aduanales:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value?.toString() || ""}
          >
            <SelectTrigger
              className={cn(
                "w-full px-3 py-2 text-sm rounded-lg border",
                "bg-white dark:bg-gray-900",
                "border-gray-300 dark:border-gray-700",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                "flex items-center justify-between"
              )}
            >
              <SelectValue
                placeholder={
                  loading ? (
                    <span className="flex items-center gap-2 text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cargando...
                    </span>
                  ) : (
                    placeholder
                  )
                }
              />
            </SelectTrigger>
            <SelectContent
              className={cn(
                "z-50 min-w-[var(--radix-select-trigger-width)]",
                "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
                "rounded-lg shadow-lg max-h-64 overflow-y-auto"
              )}
            >
              {loading && (
                <div className="flex items-center justify-center py-4 text-sm text-gray-500 dark:text-gray-400">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cargando categorías...
                </div>
              )}
              {!loading &&
                categories.map((cat) => (
                  <SelectItem
                    key={cat.guid}
                    value={cat.guid.toString()}
                    className={cn(
                      "px-3 py-2 text-sm cursor-pointer rounded-md",
                      "focus:bg-blue-50 dark:focus:bg-gray-800  dark:text-slate-300",
                      "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-slate-300",
                      "data-[state=checked]:bg-blue-100 dark:data-[state=checked]:bg-gray-700",
                      "data-[state=checked]:font-medium"
                    )}
                  >
                    {cat.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      />
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Selecciona la categoría aduanal que corresponde a tu producto según la
        clasificación arancelaria.
      </p>
    </div>
  );
};
