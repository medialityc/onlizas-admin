"use client";

import { cn } from "@/lib/utils";
import {
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowUpTrayIcon,
  DocumentIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

interface RHFDocumentUploadProps<T extends FieldValues>
  extends UseControllerProps<T> {
  label?: string;
  className?: string;
}

export function RHFDocumentUpload<T extends FieldValues>({
  label,
  className,
  ...props
}: RHFDocumentUploadProps<T>) {
  const { field, fieldState } = useController(props);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreviewFile(field.value);
  }, [field.value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      field.onChange(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    field.onChange(null);
    setPreviewFile(null);
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
    if (file) {
      field.onChange(file);
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const getIconByMimeType = (type?: string) => {
    if (!type) return <DocumentTextIcon className="h-6 w-6 text-gray-500" />;
    if (type.includes("pdf"))
      return <ArrowDownTrayIcon className="h-6 w-6 text-red-500" />;
    if (type.includes("word"))
      return <ClipboardDocumentIcon className="h-6 w-6 text-blue-500" />;
    if (type.includes("excel"))
      return <ClipboardDocumentIcon className="h-6 w-6 text-green-500" />;
    return <DocumentIcon className="h-6 w-6 text-gray-500" />;
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="font-medium text-sm">{label}</label>}

      <div
        className={cn(
          "relative cursor-pointer border-2 border-dashed border-gray-300 p-4 rounded-lg transition-all text-center",
          isDragging && "border-blue-500 bg-blue-50",
          fieldState.error && "border-red-500"
        )}
        onClick={handleContainerClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewFile ? (
          <div className="flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              {getIconByMimeType(previewFile.type)}
              <div>
                <p className="text-sm font-medium truncate">
                  {previewFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {previewFile.type || "Tipo desconocido"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center text-sm text-gray-500">
            <ArrowUpTrayIcon className="h-5 w-5 mb-1 text-gray-400" />
            <p className="text-xs">Arrastra el documento aquí</p>
            <p className="text-xs text-gray-400">o haz clic para seleccionar</p>
          </div>
        )}

        <input
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
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
