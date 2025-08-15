"use client";
import { SidebarProps } from "../types";
import SidebarProviderSection from "./sidebar-prover-section";
import SidebarSection from "./sidebar-prover-section";

const SidebarProviderContent = ({
  sections,
  expandedItems,
  onToggleItem,
  isActiveLink,
}: SidebarProps & { isActiveLink: (path: string) => boolean }) => {
  return (
    <div className="relative max-h-[calc(100vh-80px)] overflow-auto ultra-thin-scrollbar bg-white dark:bg-gray-900">
      {/* Contenido de navegación */}
      <div className="px-2 py-4">
        <ul className="space-y-2">
          {sections.map((section) => (
            <SidebarProviderSection
              key={section.id}
              section={section}
              expandedItems={expandedItems}
              onToggleItem={onToggleItem}
              isActiveLink={isActiveLink}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarProviderContent;
