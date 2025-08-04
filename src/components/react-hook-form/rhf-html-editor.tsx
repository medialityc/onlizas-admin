"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useState } from "react";
import {
  CodeBracketIcon as Code,
  EyeIcon as Eye,
} from "@heroicons/react/24/outline";
import CodeEditor from "../html-text-editor/code-editor";
import PreviewPanel from "../html-text-editor/preview-panel";
import EditorToolbar from "../html-text-editor/editor-toolbar";
import {
  modernTemplate,
  portfolioTemplate,
} from "../html-text-editor/templates";
import { toast } from "react-toastify";
import type { PreviewDevice, EditorStats } from "../html-text-editor/types";
import { cn } from "@/lib/utils";

interface RHFHTMLEditorProps {
  name: string;
  label?: string;
  helperText?: string;
  showToolbar?: boolean;
  showPreview?: boolean;
  defaultTab?: "editor" | "preview";
  disabled?: boolean;
}

export default function RHFHTMLEditor({
  name,
  label,
  helperText,
  showToolbar = true,
  showPreview = true,
  defaultTab = "editor",
  disabled = false,
}: RHFHTMLEditorProps) {
  const { control } = useFormContext();
  const [activeTab, setActiveTab] = useState(disabled ? "preview" : defaultTab);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");

  const getStats = (content: string): EditorStats => ({
    lineCount: content.split("\n").length,
    charCount: content.length,
    wordCount: content.trim().split(/\s+/).length,
  });

  const handleFileImport = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (
        file.type === "text/html" ||
        file.name.endsWith(".html") ||
        file.name.endsWith(".htm")
      ) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onChange(content);
          toast.success(
            `🎉 ¡Archivo importado! ${file.name} se ha cargado correctamente.`
          );
        };
        reader.readAsText(file);
      } else {
        toast.error(
          "❌ Tipo de archivo no válido. Por favor, selecciona un archivo HTML (.html o .htm)."
        );
      }
    }
  };

  const handleExport = (content: string) => {
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mi-documento.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(
      "📥 ¡Archivo exportado! Tu archivo HTML se ha descargado correctamente."
    );
  };

  const handleCopyCode = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(
        "📋 ¡Código copiado! El código HTML se ha copiado al portapapeles."
      );
    } catch {
      toast.error(
        "❌ Error al copiar. No se pudo copiar el código al portapapeles."
      );
    }
  };

  const handleClear = (onChange: (value: string) => void) => {
    onChange("");
    toast.success(
      "🧹 ¡Editor limpiado! El contenido del editor se ha eliminado."
    );
  };

  const insertTemplate = (
    template: string,
    name: string,
    onChange: (value: string) => void
  ) => {
    onChange(template);
    toast.success(
      `✨ ¡Plantilla insertada! Se ha cargado la plantilla: ${name}`
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value = "" }, fieldState: { error } }) => {
        const stats = getStats(value);

        return (
          <div className="flex flex-col space-y-4">
            {label && (
              <label
                htmlFor={name}
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {label}
              </label>
            )}

            <div className=" rounded-lg p-1">
              {showToolbar && (
                <div className="mb-4">
                  <EditorToolbar
                    onFileImport={(event) => handleFileImport(event, onChange)}
                    onExport={() => handleExport(value)}
                    onCopyCode={() => handleCopyCode(value)}
                    onClear={() => handleClear(onChange)}
                    onInsertTemplate={(template, name) =>
                      insertTemplate(template, name, onChange)
                    }
                    modernTemplate={modernTemplate}
                    portfolioTemplate={portfolioTemplate}
                    onlyPreview={disabled}
                  />
                </div>
              )}

              {/* Tabs */}
              {showPreview ? (
                <div className="w-full">
                  <div className="grid w-full grid-cols-2 bg-white/90 dark:bg-black backdrop-blur-sm p-1 h-14 rounded-lg mb-6">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => setActiveTab("editor")}
                      className={cn(
                        `flex items-center justify-center gap-2 text-lg font-medium rounded-md transition-all ${
                          activeTab === "editor"
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                            : "text-slate-600 hover:bg-primary hover:text-white"
                        }`,
                        disabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <Code className="h-5 w-5" />
                      Editor de Código
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`flex items-center justify-center gap-2 text-lg font-medium rounded-md transition-all ${
                        activeTab === "preview"
                          ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
                          : "text-slate-600 hover:bg-primary hover:text-white"
                      }`}
                    >
                      <Eye className="h-5 w-5" />
                      Vista Previa
                    </button>
                  </div>

                  {activeTab === "editor" && (
                    <CodeEditor
                      htmlContent={value}
                      onContentChange={onChange}
                      stats={stats}
                    />
                  )}

                  {activeTab === "preview" && (
                    <PreviewPanel
                      htmlContent={value}
                      previewDevice={previewDevice}
                      onDeviceChange={setPreviewDevice}
                    />
                  )}
                </div>
              ) : (
                <CodeEditor
                  htmlContent={value}
                  onContentChange={onChange}
                  stats={stats}
                />
              )}
            </div>

            {(error || helperText) && (
              <p className="text-xs text-red-500">
                {error?.message || helperText}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
