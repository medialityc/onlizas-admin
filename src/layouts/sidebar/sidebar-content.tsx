"use client";
import { useFilteredSidebar } from "./sidebar-filter";
import SidebarSection from "./sidebar-section";
import { SidebarProps } from "./types";


const SidebarContent = ({
  sections,
  expandedItems,
  onToggleItem,
  isActiveLink,
}: SidebarProps & { isActiveLink: (path: string) => boolean }) => {
  // Filtrar secciones basado en permisos del usuario
  const filteredSections = useFilteredSidebar(sections);

  return (
    <div className="relative max-h-[calc(100vh-80px)] overflow-auto ultra-thin-scrollbar bg-white dark:bg-gray-900">
      {/* Contenido de navegación */}
      <div className="px-2 py-4">
        <ul className="space-y-2">
          {filteredSections.map((section) => (
            <SidebarSection
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

export default SidebarContent;
