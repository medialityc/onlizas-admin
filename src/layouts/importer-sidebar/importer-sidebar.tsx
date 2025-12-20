"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { getImporterSidebarSections } from "./importer-sidebar-config";
import ImporterSidebarHeader from "./importer-sidebar-header";
import ImporterSidebarFooter from "./importer-sidebar-footer";

interface ImporterSidebarProps {
  importerId: string;
  importerName?: string;
  expiresAt?: number;
  isOpen: boolean;
  onToggle: () => void;
}

const ImporterSidebar = ({ importerId, importerName, expiresAt, isOpen, onToggle }: ImporterSidebarProps) => {
  const pathname = usePathname();

  const sections = useMemo(
    () => getImporterSidebarSections(importerId),
    [importerId]
  );

  const isActiveLink = (path: string) => pathname === path;

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <nav 
        className={`fixed bottom-0 top-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header con botón de toggle */}
          <div className="shrink-0 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-4">
              <ImporterSidebarHeader />
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                onClick={onToggle}
                aria-label="Toggle Sidebar"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <div key={section.id}>
                  {section.items.map((item) => {
                    const active = item.path ? isActiveLink(item.path) : false;
                    return (
                      <Link 
                        key={item.id} 
                        href={item.path || '#'}
                        className={`block px-4 py-3 rounded-lg transition-colors ${
                          active
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && (
                            <div className="w-5 h-5">
                              {item.icon}
                            </div>
                          )}
                          <span className="font-medium">{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-gray-200 dark:border-gray-700">
            <ImporterSidebarFooter
              importerId={importerId}
              importerName={importerName}
              expiresAt={expiresAt}
            />
          </div>
        </div>
      </nav>

      {/* Botón para abrir sidebar cuando está cerrado */}
      {!isOpen && (
        <button
          type="button"
          className="fixed top-4 left-4 z-40 flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={onToggle}
          aria-label="Open Sidebar"
        >
          <ChevronLeftIcon className="w-5 h-5 rotate-180 text-gray-700 dark:text-gray-300" />
        </button>
      )}
    </>
  );
};

export default ImporterSidebar;
