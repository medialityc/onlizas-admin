"use client";

import { useState } from "react";
import ImporterSidebar from "./importer-sidebar";

interface ImporterLayoutClientProps {
  children: React.ReactNode;
  importerId: string;
  importerName?: string;
  expiresAt?: number;
}

export default function ImporterLayoutClient({
  children,
  importerId,
  importerName,
  expiresAt,
}: ImporterLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="relative">
      <ImporterSidebar
        importerId={importerId}
        importerName={importerName}
        expiresAt={expiresAt}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div 
        className={`min-h-screen bg-gray-50 dark:bg-[#0e1726] transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0 pl-16'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
