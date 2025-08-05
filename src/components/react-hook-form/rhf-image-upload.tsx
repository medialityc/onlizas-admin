"use client";

import { useEffect, useRef, useState } from "react";
import { useController, UseControllerProps } from "react-hook-form";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface RHFImageUploadProps extends UseControllerProps {
  label?: string;
  defaultImage?: string;
  variant?: "square" | "rounded" | "circle";
  size?: "sm" | "md" | "lg" | "full";
  className?: string;
  disabled?: boolean;
}

export function RHFImageUpload({
  label,
  defaultImage,
  variant = "circle",
  size = "md",
  className,
  disabled = false,
  ...props
}: RHFImageUploadProps) {
  const { field, fieldState } = useController(props);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Limpiar preview anterior si no hay valor
    if (!field.value) {
      setPreview(defaultImage || null);
      return;
    }

    // Si el valor es un File, crear object URL
    if (field.value instanceof File) {
      const objectUrl = URL.createObjectURL(field.value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    // Si el valor es una string (URL), usarla directamente
    if (typeof field.value === "string") {
      setPreview(field.value);
      return;
    }

    // Caso por defecto
    setPreview(defaultImage || null);
  }, [field.value, defaultImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      field.onChange(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      field.onChange(null);
      setPreview(defaultImage || null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!disabled) {
      e.preventDefault();
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    if (!disabled) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!disabled) {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        field.onChange(file);
      }
    }
  };

  // Tamaños según la prop
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-40 h-40",
    full: "w-full h-40 min-h-40",
  };

  // Bordes según la variante
  const variantClasses = {
    square: "rounded-none",
    rounded: "rounded-lg",
    circle: "rounded-full",
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {label && <label className="font-medium text-sm">{label}</label>}

      <div
        className={cn(
          "relative border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden transition-all",
          sizeClasses[size],
          variantClasses[variant],
          isDragging && !disabled && "border-blue-500 bg-blue-50",
          fieldState.error && "border-red-500",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        )}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Profile preview"
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 transition-colors z-10"
                onClick={handleRemove}
              >
                <XMarkIcon className="text-gray-600 size-4" />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-3">
            <ArrowUpTrayIcon className="text-gray-400 mb-2 size-4" />
            <span className="text-xs text-gray-500 font-medium">
              {disabled ? "Cargando imagen..." : "Arrastra tu foto aquí"}
            </span>
            {!disabled && (
              <span className="text-xs text-gray-400 mt-1">
                o haz clic para seleccionar
              </span>
            )}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {fieldState.error && (
        <p className="text-xs text-red-500">{fieldState.error.message}</p>
      )}
    </div>
  );
}
