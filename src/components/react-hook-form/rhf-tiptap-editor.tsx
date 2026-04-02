"use client";

import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Label } from "@/components/label/label";
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  Heading2Icon,
  Heading3Icon,
  UndoIcon,
  RedoIcon,
  RemoveFormattingIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  showError?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  minHeight?: string;
}

// ---------------------------------------------------------------------------

function TiptapEditor({
  value,
  onChange,
  disabled,
  placeholder,
  minHeight = "120px",
}: {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  placeholder?: string;
  minHeight?: string;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value ?? "",
    immediatelyRender: false,
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          "outline-none px-3 py-2 prose prose-sm max-w-none dark:prose-invert",
        style: `min-height: ${minHeight}`,
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      // Treat empty paragraphs as empty string for RHF
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // Sync external value changes (e.g. reset())
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = value ?? "";
    if (current !== incoming && !(current === "<p></p>" && incoming === "")) {
      editor.commands.setContent(incoming);
    }
  }, [value, editor]);

  if (!editor) return null;

  const btnBase =
    "p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white transition-colors disabled:opacity-40";
  const btnActive =
    "bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-white";

  return (
    <div
      className={`rounded-md border border-gray-200 bg-white dark:bg-dark dark:border-gray-700 overflow-hidden focus-within:border-primary transition-colors ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          type="button"
          title="Negrita"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={`${btnBase} ${editor.isActive("bold") ? btnActive : ""}`}
        >
          <BoldIcon className="size-3.5" />
        </button>
        <button
          type="button"
          title="Cursiva"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={`${btnBase} ${editor.isActive("italic") ? btnActive : ""}`}
        >
          <ItalicIcon className="size-3.5" />
        </button>

        <span className="w-px h-4 bg-gray-200 dark:bg-gray-600 mx-0.5" />

        <button
          type="button"
          title="Título 2"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={disabled}
          className={`${btnBase} ${editor.isActive("heading", { level: 2 }) ? btnActive : ""}`}
        >
          <Heading2Icon className="size-3.5" />
        </button>
        <button
          type="button"
          title="Título 3"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          disabled={disabled}
          className={`${btnBase} ${editor.isActive("heading", { level: 3 }) ? btnActive : ""}`}
        >
          <Heading3Icon className="size-3.5" />
        </button>

        <span className="w-px h-4 bg-gray-200 dark:bg-gray-600 mx-0.5" />

        <button
          type="button"
          title="Lista con viñetas"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={`${btnBase} ${editor.isActive("bulletList") ? btnActive : ""}`}
        >
          <ListIcon className="size-3.5" />
        </button>
        <button
          type="button"
          title="Lista numerada"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={`${btnBase} ${editor.isActive("orderedList") ? btnActive : ""}`}
        >
          <ListOrderedIcon className="size-3.5" />
        </button>

        <span className="w-px h-4 bg-gray-200 dark:bg-gray-600 mx-0.5" />

        <button
          type="button"
          title="Deshacer"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
          className={btnBase}
        >
          <UndoIcon className="size-3.5" />
        </button>
        <button
          type="button"
          title="Rehacer"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
          className={btnBase}
        >
          <RedoIcon className="size-3.5" />
        </button>

        <span className="w-px h-4 bg-gray-200 dark:bg-gray-600 mx-0.5" />

        <button
          type="button"
          title="Limpiar formato"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          disabled={disabled}
          className={btnBase}
        >
          <RemoveFormattingIcon className="size-3.5" />
        </button>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function RHFTiptapEditor({
  name,
  label,
  placeholder,
  required = false,
  showError = true,
  disabled = false,
  containerClassName,
  minHeight,
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "Este campo es requerido" : false }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className={`flex flex-col gap-1.5 ${containerClassName ?? ""}`}>
          {label && (
            <Label htmlFor={name} className="px-1">
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
          )}
          <TiptapEditor
            value={value ?? ""}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            minHeight={minHeight}
          />
          {showError && error && (
            <p className="px-1 text-xs text-red-500">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}
