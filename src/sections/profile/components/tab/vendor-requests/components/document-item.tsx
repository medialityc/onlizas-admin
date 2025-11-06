"use client";

import { Eye, FileText } from "lucide-react";
import { useState } from "react";

interface Document {
  id: string | number;
  fileName: string;
  content: string;
}

interface DocumentItemProps {
  document: Document;
  status: "approved" | "pending";
}

export function DocumentItem({ document, status }: DocumentItemProps) {
  const [previewHovered, setPreviewHovered] = useState(false);
  
  const colorClasses = {
    approved: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      hover: "hover:bg-green-100 dark:hover:bg-green-900/30",
      text: "text-green-700 dark:text-green-400",
      buttonHover: "hover:bg-green-200 dark:hover:bg-green-800",
    },
    pending: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      hover: "hover:bg-yellow-100 dark:hover:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-400",
      buttonHover: "hover:bg-yellow-200 dark:hover:bg-yellow-800",
    }
  };

  const colors = colorClasses[status];
  
  return (
    <div className={`flex items-center rounded-md border ${colors.border} ${colors.bg} transition-colors group`}>
      <div className="flex-grow py-1.5 px-2">
        <div className="flex items-center text-sm">
          <FileText className={`h-4 w-4 mr-2 ${colors.text}`} />
          <span className="truncate text-gray-700 dark:text-gray-300">
            {document.fileName}
          </span>
        </div>
      </div>
      <a
        href={document.content}
        target="_blank"
        rel="noopener noreferrer"
        className={`p-1.5 flex items-center justify-center rounded-r-md ${colors.text} ${colors.buttonHover} transition-colors`}
        onMouseEnter={() => setPreviewHovered(true)}
        onMouseLeave={() => setPreviewHovered(false)}
        aria-label="Ver documento"
      >
        <Eye className="h-4 w-4" />
        <span className={`ml-1 text-xs font-medium transition-opacity duration-200 ${previewHovered ? 'opacity-100' : 'opacity-0'}`}>
          Ver
        </span>
      </a>
    </div>
  );
}
