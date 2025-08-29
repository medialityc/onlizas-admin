"use client";

import React from "react";

interface Props {
  targetId?: string;
  className?: string;
  ariaLabel?: string;
  title?: string;
}

export default function FloatingApprovalButton({
  targetId = "approval-controls",
  className = "fixed bottom-6 right-6 z-50 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition",
  ariaLabel = "Ir a controles de aprobación",
  title = "Ir a controles de aprobación",
}: Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // optionally focus for accessibility
      (el as HTMLElement).focus?.();
    } else {
      // fallback: navigate to anchor
      window.location.hash = `#${targetId}`;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
      title={title}
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </button>
  );
}
