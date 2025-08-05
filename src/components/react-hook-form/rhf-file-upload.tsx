"use client";

import { useController, UseControllerProps } from "react-hook-form";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

interface RHFFileUploadProps extends UseControllerProps {
  label?: string;
  accept?: string;
  maxSize?: number; // en bytes
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function RHFFileUpload({
  label,
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB por defecto
  placeholder = "Seleccionar archivo",
  className,
  disabled = false,
  ...props
}: RHFFileUploadProps) {
  const { field, fieldState } = useController(props);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize) {
      alert(
        `El archivo es demasiado grande. Tamaño máximo: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`
      );
      return;
    }
    field.onChange(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    field.onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const selectedFile = field.value as File | null;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      {!selectedFile ? (
        <div
          onClick={openFileDialog}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
            disabled && "cursor-not-allowed opacity-50",
            fieldState.error && "border-red-500"
          )}
        >
          <ArrowUpTrayIcon className="size-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {placeholder}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Arrastra y suelta o haz clic para seleccionar
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
            Tamaño máximo: {(maxSize / (1024 * 1024)).toFixed(1)}MB
          </p>
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DocumentIcon className="size-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              disabled={disabled}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        disabled={disabled}
        className="hidden"
      />

      {fieldState.error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {fieldState.error.message}
        </p>
      )}
    </div>
  );
}
