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
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RHFImageUpload({
  label,
  defaultImage,
  variant = "circle",
  size = "md",
  className,
  ...props
}: RHFImageUploadProps) {
  const { field, fieldState } = useController(props);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (field.value instanceof File) {
      const objectUrl = URL.createObjectURL(field.value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [field.value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      field.onChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    field.onChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      field.onChange(file);
    }
  };

  // Tamaños según la prop
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-40 h-40",
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
          "relative cursor-pointer border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden transition-all",
          sizeClasses[size],
          variantClasses[variant],
          isDragging && "border-blue-500 bg-blue-50",
          fieldState.error && "border-red-500"
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
              fill
              className="object-cover"
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 transition-colors"
              onClick={handleRemove}
            >
              <XMarkIcon className="text-gray-600 size-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-3">
            <ArrowUpTrayIcon className="text-gray-400 mb-2 size-4" />
            <span className="text-xs text-gray-500 font-medium">
              Arrastra tu foto aquí
            </span>
            <span className="text-xs text-gray-400 mt-1">
              o haz clic para seleccionar
            </span>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>

      {fieldState.error && (
        <p className="text-xs text-red-500">{fieldState.error.message}</p>
      )}
    </div>
  );
}
