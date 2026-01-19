"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "next-themes";

interface RHFTinyMCEEditorProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  height?: number;
}

export default function RHFTinyMCEEditor({
  name,
  label,
  placeholder,
  required = false,
  className = "",
  height = 700,
}: RHFTinyMCEEditorProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  const { resolvedTheme, theme } = useTheme();
  const isDark = (resolvedTheme || theme) === "dark";

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Editor
            key={isDark ? "tinymce-dark" : "tinymce-light"}
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={field.value || ""}
            onEditorChange={(content) => {
              field.onChange(content);
            }}
            init={{
              height,
              min_height: height,
              max_height: height + 200,
              width: "100%",
              menubar: false,
              skin: isDark ? "oxide-dark" : "oxide",
              content_css: isDark ? "dark" : "default",
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "charmap",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "insertdatetime",
                "media",
                "table",
                "preview",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "link | removeformat",
              content_style: `body { font-family: "Inter", Arial, sans-serif; font-size:14px; line-height: 1.6; padding: 10px; }
                body { background: ${isDark ? "#0f172a" : "#ffffff"}; color: ${isDark ? "#e5e7eb" : "#0f172a"}; }
                a { color: ${isDark ? "#60a5fa" : "#2563eb"}; }
                table { border-color: ${isDark ? "#374151" : "#e5e7eb"}; }`,
              placeholder,
              branding: false,
              resize: "both",
              statusbar: true,
              setup: (editor: any) => {
                editor.on("init", () => {
                  if (placeholder && !field.value) {
                    editor
                      .getBody()
                      .setAttribute("data-placeholder", placeholder);
                  }
                });
              },
            }}
            onBlur={field.onBlur}
          />
        )}
      />

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
