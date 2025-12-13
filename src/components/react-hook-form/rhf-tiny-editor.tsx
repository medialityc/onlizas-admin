"use client";

import { useController, useFormContext } from "react-hook-form";
import { useRef, useState, useCallback } from "react";
import SimpleModal from "@/components/modal/modal";

interface RHFSimpleEditorProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  height?: number;
}

// Función para sanitizar URLs y prevenir XSS
function sanitizeUrl(url: string): string {
  if (!url || typeof url !== "string") {
    return "#";
  }

  // Remover espacios en blanco
  const trimmedUrl = url.trim();

  // Lista de esquemas permitidos
  const allowedSchemes = ["http:", "https:", "mailto:", "tel:"];

  try {
    // Intentar crear un objeto URL para validar
    const urlObj = new URL(trimmedUrl);

    // Verificar si el esquema está permitido
    if (allowedSchemes.includes(urlObj.protocol)) {
      return trimmedUrl;
    } else {
      // Esquema no permitido (javascript:, data:, etc.)
      return "#";
    }
  } catch {
    // Si no es una URL válida, verificar si es una URL relativa
    if (
      trimmedUrl.startsWith("/") ||
      trimmedUrl.startsWith("./") ||
      trimmedUrl.startsWith("../")
    ) {
      return trimmedUrl;
    }

    // Si no comienza con un protocolo, asumir https
    if (!trimmedUrl.includes("://")) {
      try {
        const urlWithProtocol = `https://${trimmedUrl}`;
        new URL(urlWithProtocol); // Validar que sea una URL válida
        return urlWithProtocol;
      } catch {
        return "#";
      }
    }

    return "#";
  }
}

// Función para sanitizar texto y prevenir XSS
function sanitizeText(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  // Escapar caracteres HTML peligrosos
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

export default function RHFSimpleEditor({
  name,
  label,
  required = false,
  placeholder = "Escribe aquí...",
  height = 200,
}: RHFSimpleEditorProps) {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: "",
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [currentSelection, setCurrentSelection] = useState<Range | null>(null);

  // Función para ejecutar comandos del editor
  const execCommand = useCallback(
    (command: string, value?: string) => {
      // Asegurar que el editor tenga foco
      if (editorRef.current) {
        editorRef.current.focus();
      }

      // Ejecutar el comando
      document.execCommand(command, false, value);

      // Actualizar contenido
      if (editorRef.current) {
        const content = editorRef.current.innerHTML;
        onChange(content);
      }
    },
    [onChange]
  );

  // Función para manejar cambios en el contenido
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  // Función para manejar pegado
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
      handleInput();
    },
    [handleInput]
  );

  // Función para abrir el modal de enlace
  const handleOpenLinkModal = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selection && selection.rangeCount > 0) {
      // Si hay texto seleccionado, guardarlo
      const range = selection.getRangeAt(0).cloneRange();
      setLinkText(selectedText);
      setCurrentSelection(range);
    } else {
      // Si no hay texto seleccionado, limpiar
      setLinkText("");
      setCurrentSelection(null);
    }

    setLinkUrl("");
    setShowLinkModal(true);
  }, []);

  // Función para crear el enlace
  const handleCreateLink = useCallback(() => {
    if (!linkUrl) return;

    // Sanitizar la URL antes de usarla
    const sanitizedUrl = sanitizeUrl(linkUrl);

    // Si la URL sanitizada es '#', mostrar error y no crear enlace
    if (sanitizedUrl === "#") {
      alert(
        "URL no válida o potencialmente peligrosa. Por favor, usa una URL que comience con http://, https://, mailto: o tel:"
      );
      return;
    }

    // Sanitizar el texto del enlace
    const sanitizedText = sanitizeText(linkText);

    if (!sanitizedText) {
      alert("Texto del enlace no puede estar vacío");
      return;
    }

    if (currentSelection && editorRef.current) {
      // Para texto seleccionado: usar innerHTML de manera segura
      editorRef.current.focus();

      try {
        // Crear HTML seguro usando template literal con valores sanitizados
        const safeHtml = `<a href="${sanitizedUrl}" target="_blank" style="color: #3b82f6; text-decoration: underline;">${sanitizedText}</a>`;

        // Reemplazar contenido seleccionado
        currentSelection.deleteContents();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = safeHtml;
        const linkElement = tempDiv.firstChild as HTMLElement;

        if (linkElement) {
          currentSelection.insertNode(linkElement);

          // Poner el cursor después del enlace
          const range = document.createRange();
          range.setStartAfter(linkElement);
          range.collapse(true);

          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }

        // Actualizar el contenido
        const content = editorRef.current.innerHTML;
        onChange(content);
      } catch (e) {
        console.warn("Error creando enlace:", e);
        // Fallback: usar insertHTML con valores sanitizados
        const safeHtml = `<a href="${sanitizedUrl}" target="_blank" style="color: #3b82f6; text-decoration: underline;">${sanitizedText}</a>&nbsp;`;
        document.execCommand("insertHTML", false, safeHtml);
        handleInput();
      }
    } else if (sanitizedText) {
      // Insertar nuevo enlace con texto personalizado
      if (editorRef.current) {
        editorRef.current.focus();
        const safeHtml = `<a href="${sanitizedUrl}" target="_blank" style="color: #3b82f6; text-decoration: underline;">${sanitizedText}</a>&nbsp;`;
        document.execCommand("insertHTML", false, safeHtml);
        handleInput();
      }
    }

    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
    setCurrentSelection(null);
  }, [linkUrl, linkText, currentSelection, onChange, handleInput]);

  // Función para cancelar el modal
  const handleCancelLink = useCallback(() => {
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
    setCurrentSelection(null);
  }, []);

  return (
    <>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Barra de herramientas */}
        <div className="border border-gray-300 dark:border-gray-600 rounded-t-md bg-gray-50 dark:bg-gray-700 p-2 flex flex-wrap gap-1">
          <button
            type="button"
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded font-bold"
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand("bold");
            }}
            title="Negrita"
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded italic"
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand("italic");
            }}
            title="Cursiva"
          >
            <em>I</em>
          </button>

          <button
            type="button"
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded underline"
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand("underline");
            }}
            title="Subrayado"
          >
            U
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

          <button
            type="button"
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand("insertUnorderedList");
            }}
            title="Lista con viñetas"
          >
            • Lista
          </button>

          <button
            type="button"
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand("insertOrderedList");
            }}
            title="Lista numerada"
          >
            1. Lista
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

          <button
            type="button"
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            onMouseDown={(e) => {
              e.preventDefault();
              handleOpenLinkModal();
            }}
            title="Crear enlace"
          >
            🔗 Link
          </button>
        </div>

        {/* Área de edición */}
        <div
          ref={editorRef}
          contentEditable
          className={`
            min-h-[200px] border-x border-b border-gray-300 dark:border-gray-600 rounded-b-md p-4 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${isFocused ? "ring-2 ring-blue-500" : ""}
          `}
          style={{
            minHeight: `${height}px`,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
            fontSize: "14px",
            lineHeight: "1.6",
          }}
          dangerouslySetInnerHTML={{ __html: value || "" }}
          onInput={handleInput}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          data-placeholder={placeholder}
        />

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {error.message}
          </p>
        )}

        <style jsx global>{`
          [contenteditable="true"]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
          }

          .dark [contenteditable="true"]:empty:before {
            color: #6b7280;
          }

          [contenteditable="true"] p {
            margin: 8px 0;
          }

          [contenteditable="true"] ul,
          [contenteditable="true"] ol {
            margin: 8px 0;
            padding-left: 24px;
            list-style-position: outside;
          }

          [contenteditable="true"] ul {
            list-style-type: disc;
          }

          [contenteditable="true"] ol {
            list-style-type: decimal;
          }

          [contenteditable="true"] li {
            margin: 2px 0;
          }

          [contenteditable="true"] a {
            color: #3b82f6;
            text-decoration: underline;
          }

          .dark [contenteditable="true"] a {
            color: #60a5fa;
          }
        `}</style>
      </div>

      {/* Modal para crear enlace usando SimpleModal */}
      <SimpleModal
        open={showLinkModal}
        onClose={handleCancelLink}
        title="Crear Enlace"
        className="max-w-md"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancelLink}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleCreateLink}
              disabled={!linkUrl || (!currentSelection && !linkText)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Crear Enlace
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL del enlace
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://ejemplo.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              autoFocus
            />
          </div>

          {!currentSelection && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Texto del enlace
              </label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Texto que aparecerá como enlace"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          )}

          {currentSelection && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Se creará un enlace con el texto seleccionado: "
              <strong>{linkText}</strong>"
            </p>
          )}
        </div>
      </SimpleModal>
    </>
  );
}
