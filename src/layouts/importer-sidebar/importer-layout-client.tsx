"use client";

import { useState, useEffect } from "react";
import ImporterSidebar from "./importer-sidebar";

interface ImporterLayoutClientProps {
  children: React.ReactNode;
  importerId: string;
  importerName?: string;
  expiresAt?: number;
}

function useSessionAutoRedirect(importerId: string, expiresAt?: number) {
  useEffect(() => {
    if (!expiresAt) return;
    const now = Date.now();
    const msToExpire = expiresAt - now;
    if (msToExpire <= 0) {
      window.location.href = `/importadora/${importerId}`;
      return;
    }
    const timeout = setTimeout(() => {
      window.location.href = `/importadora/${importerId}`;
    }, msToExpire);
    return () => clearTimeout(timeout);
  }, [importerId, expiresAt]);
}

export default function ImporterLayoutClient({
  children,
  importerId,
  importerName,
  expiresAt,
}: ImporterLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  useSessionAutoRedirect(importerId, expiresAt);

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
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
