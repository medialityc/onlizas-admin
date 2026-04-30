"use client";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import RHFHTMLEditor from "@/components/react-hook-form/rhf-html-editor";
import LoaderButton from "@/components/loaders/loader-button";
import { Button } from "@/components/button/button";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { usePermissions } from "@/hooks/use-permissions";
import { StaticPageFormData } from "../schemas/static-page-schema";
import { useStaticPageForm } from "../hooks/use-static-page-form";

interface StaticPageFormProps {
  initValue?: StaticPageFormData;
}

const AI_PROMPT = `Genera una página HTML estática con las siguientes características:

- Solo incluye el contenido del <body>, sin etiqueta <html>, <head> ni <header>.
- Usa clases de Tailwind CSS para todos los estilos (no uses CSS inline ni <style>).
- El diseño debe ser limpio, profesional y legible, con fondo claro (bg-gray-50) y tipografía font-sans.
- Usa un contenedor centrado con ancho máximo (max-w-4xl mx-auto px-6 py-12).
- Estructura el contenido con secciones claramente separadas, cada una con:
  · Título numerado con badge de color (bg-blue-100 text-blue-700).
  · Párrafos con text-gray-600 leading-relaxed.
- Si hay datos tabulares, usa una tabla estilizada con bordes suaves y hover en filas.
- Al final incluye un footer simple con copyright centrado en gris claro.
- El idioma del contenido debe ser español.

Página a generar: [DESCRIBE AQUÍ el tipo de página, ej: "Términos y Condiciones para una tienda con proveedores y paquetería"].
Nombre/marca: [TU NOMBRE O MARCA].
Datos de contacto: [CORREO, TELÉFONO, HORARIO].`;

const PROMPT_TIPS = [
  {
    title: "Sé específico sobre el tipo de página",
    description:
      "Indica claramente si es Términos y Condiciones, Política de Privacidad, Sobre Nosotros, etc.",
  },
  {
    title: "Incluye información real de contacto",
    description:
      "Reemplaza los campos entre corchetes con datos reales: correo, teléfono y horario de atención.",
  },
  {
    title: "Define el tono del texto",
    description:
      'Puedes agregar: "El tono debe ser formal", "amigable", "técnico" o "corporativo" según tu marca.',
  },
  {
    title: "Menciona secciones obligatorias",
    description:
      'Si necesitas secciones específicas como "Devoluciones" o "Garantías", agrégalas explícitamente al prompt.',
  },
  {
    title: "Indica el público objetivo",
    description:
      'Ejemplo: "el contenido está dirigido a proveedores mayoristas" ayuda a adaptar el lenguaje.',
  },
];

const SECTION_OPTIONS = [
  { value: 0, label: "Ayuda" },
  { value: 1, label: "Sobre nosotros" },
  { value: 2, label: "Legal" },
  { value: 3, label: "Política de privacidad" },
];

export default function StaticPageForm({ initValue }: StaticPageFormProps) {
  const { form, isPending, onSubmit } = useStaticPageForm(initValue);
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const [copied, setCopied] = useState(false);

  const { push } = useRouter();
  const handleCancel = useCallback(
    () => push("/dashboard/content/static-pages"),
    [push],
  );

  const handleCopyPrompt = useCallback(async () => {
    await navigator.clipboard.writeText(AI_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const isEdit = !!initValue?.id;

  return (
    <section className="space-y-5">
      <FormProvider methods={form} onSubmit={onSubmit} id="static-page-form">
        <div className="space-y-5">
          {/* Card: Información básica */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#1a1c23]">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v1H7V5zm0 3h6v1H7V8zm0 3h4v1H7v-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Información básica
              </h2>
            </div>
            <div className="space-y-4">
              <RHFInputWithLabel
                name="title"
                label="Título de la Página"
                placeholder="Ej: Términos y Condiciones"
                autoFocus
                maxLength={200}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <RHFInputWithLabel
                  name="slug"
                  label="Slug (URL)"
                  placeholder="Ej: terminos-y-condiciones"
                  maxLength={120}
                  disabled={isEdit}
                  underLabel="El slug no puede modificarse luego de crear la página"
                />
                <RHFSelectWithLabel
                  name="section"
                  label="Sección"
                  placeholder="Selecciona una sección"
                  options={SECTION_OPTIONS}
                  required
                />
              </div>
            </div>
          </div>

          {/* Card: Contenido HTML */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#1a1c23]">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Contenido HTML
              </h2>
            </div>
            <RHFHTMLEditor name="content" label="" showToolbar showPreview />
          </div>

          {/* Card: SEO */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#1a1c23]">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">SEO</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RHFInputWithLabel
                name="metaDescription"
                type="textarea"
                label="Meta Descripción"
                placeholder="Descripción para buscadores"
                rows={4}
              />
              <RHFInputWithLabel
                name="metaKeywords"
                type="textarea"
                label="Meta Keywords"
                placeholder="Ej: términos, condiciones, legal"
                rows={4}
              />
            </div>
          </div>
        </div>
      </FormProvider>

      {/* Acciones */}
      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        {hasUpdatePermission && (
          <LoaderButton
            type="submit"
            form="static-page-form"
            loading={isPending}
            disabled={isPending}
            className="btn btn-primary"
          >
            Guardar
          </LoaderButton>
        )}
      </div>

      {/* Asistente de IA */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Prompt de IA */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/40 dark:bg-blue-950/30">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                Prompt de IA para generar contenido HTML
              </h3>
              <p className="mt-0.5 text-xs text-blue-600 dark:text-blue-400">
                Copia este prompt y úsalo en ChatGPT, Copilot u otro asistente
                de IA.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100 active:scale-95 dark:border-blue-800 dark:bg-[#1a1c23] dark:text-blue-300 dark:hover:bg-blue-900/40"
            >
              {copied ? (
                <>
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Copiado
                </>
              ) : (
                <>
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copiar prompt
                </>
              )}
            </button>
          </div>
          <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg bg-white p-4 text-xs leading-relaxed text-gray-700 shadow-inner dark:bg-[#121e32] dark:text-gray-300">
            {AI_PROMPT}
          </pre>
        </div>

        {/* Tips para mejorar el prompt */}
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
          <h3 className="mb-3 text-sm font-semibold text-amber-800 dark:text-amber-300">
            Tips para mejorar el prompt
          </h3>
          <ul className="space-y-2.5">
            {PROMPT_TIPS.map((tip, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                    {tip.title}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400">{tip.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
