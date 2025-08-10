"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import SidebarItem from "./sidebar-item";
import { SidebarSectionProps } from "./types";

const SidebarSection = ({
  section,
  isActiveLink,
  expandedItems,
  onToggleItem,
}: SidebarSectionProps) => {
  // Detecta si algún item de la sección está activo, para abrir por defecto
  const hasActiveItem = useMemo(
    () =>
      section.items.some((item) =>
        item.path ? isActiveLink(item.path) : false
      ),
    [section.items, isActiveLink]
  );

  // Estado local de apertura/cierre del acordeón
  const [isOpen, setIsOpen] = useState<boolean>(
    () => hasActiveItem || !!section.noSection
  );

  // Si cambia el item activo, autoexpande la sección
  useEffect(() => {
    if (hasActiveItem) setIsOpen(true);
  }, [hasActiveItem]);

  const handleToggleSection = () => setIsOpen((v) => !v);

  return (
    <li className="mb-6">
      {!section.noSection && (
        <div className="mb-2">
          <div className="relative">
            <button
              type="button"
              onClick={handleToggleSection}
              aria-expanded={isOpen}
              className="w-full px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-primary/5 border-l-4 border-primary border-r-4 rounded-lg shadow-sm backdrop-blur-sm flex items-center justify-between"
            >
              <span className="flex items-center space-x-2">
                <span>{section.label}</span>
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
              />
            </button>
            {/* Línea decorativa */}
            <div className="absolute -bottom-1 left-4 right-4 h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          </div>
        </div>
      )}

      {/* Items de la sección (acordeón) */}
      {(section.noSection || isOpen) && (
        <ul className="space-y-1">
          {section.items.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={item.path ? isActiveLink(item.path) : false}
              isExpanded={expandedItems[item.id]}
              onToggle={() => onToggleItem(item.id)}
              isActiveLink={isActiveLink}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarSection;
