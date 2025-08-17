"use client";
import React, { useMemo, useState } from "react";
import {
  ClipboardIcon,
  CheckIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  Bars3BottomLeftIcon,
} from "@heroicons/react/24/outline";

type Props = {
  text: string | null | undefined;
  label?: string;
  className?: string;
};

function tryFormatJson(input: string | null | undefined): {
  isJson: boolean;
  pretty: string;
} {
  if (!input) return { isJson: false, pretty: "-" };
  try {
    const parsed = JSON.parse(input);
    return { isJson: true, pretty: JSON.stringify(parsed, null, 2) };
  } catch {
    return { isJson: false, pretty: input };
  }
}

export default function DescriptionViewer({
  text,
  label = "Descripción",
  className = "",
}: Props) {
  const { isJson, pretty } = useMemo(() => tryFormatJson(text), [text]);
  const [copied, setCopied] = useState(false);
  const [wrap, setWrap] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const renderWithLinks = (value: string) => {
    const urlRegex = /(https?:\/\/[^\s"'>)]+)|(www\.[^\s"'>)]+)/gi;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    const textVal = value ?? "";
    // Use exec in a loop to get indexes
    // eslint-disable-next-line no-cond-assign
    while ((match = urlRegex.exec(textVal)) !== null) {
      const start = match.index;
      const url = match[0];
      if (start > lastIndex) {
        nodes.push(textVal.slice(lastIndex, start));
      }
      const href = url.startsWith("http") ? url : `https://${url}`;
      nodes.push(
        <a
          key={`lnk-${start}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline break-words"
          title={url}
        >
          {url}
        </a>
      );
      lastIndex = start + url.length;
    }
    if (lastIndex < textVal.length) {
      nodes.push(textVal.slice(lastIndex));
    }
    return nodes.length > 0 ? nodes : [textVal];
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pretty);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setWrap((v) => !v)}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-700 px-2 py-1 text-xs hover:border-primary/60"
            title={
              wrap ? "Desactivar salto de línea" : "Activar salto de línea"
            }
          >
            <Bars3BottomLeftIcon className="h-3.5 w-3.5" />
            {wrap ? "Wrap" : "No wrap"}
          </button>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-700 px-2 py-1 text-xs hover:border-primary/60"
            title={expanded ? "Colapsar" : "Expandir"}
          >
            {expanded ? (
              <ArrowsPointingInIcon className="h-3.5 w-3.5" />
            ) : (
              <ArrowsPointingOutIcon className="h-3.5 w-3.5" />
            )}
            {expanded ? "Colapsar" : "Expandir"}
          </button>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-700 px-2 py-1 text-xs hover:border-primary/60"
            title="Copiar"
          >
            {copied ? (
              <CheckIcon className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <ClipboardIcon className="h-3.5 w-3.5" />
            )}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>

      <div
        className={`rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 ${
          expanded ? "max-h-[70vh]" : "max-h-64"
        } overflow-auto`}
      >
        <pre
          className={`text-xs leading-relaxed p-3 text-gray-800 dark:text-gray-200 ${
            wrap ? "whitespace-pre-wrap" : "whitespace-pre"
          } font-mono`}
        >
          <code>{renderWithLinks(pretty)}</code>
        </pre>
      </div>
      {isJson && (
        <div className="text-[10px] text-gray-400">
          Detectado JSON válido, mostrado con formato.
        </div>
      )}
    </div>
  );
}
