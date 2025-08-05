"use client";
import SidebarItem from "./sidebar-item";
import { SidebarSectionProps } from "./types";

const SidebarSection = ({
  section,
  isActiveLink,
  expandedItems,
  onToggleItem,
}: SidebarSectionProps) => {
  return (
    <li className="mb-6">
      {!section.noSection && (
        <div className="mb-4">
          <div className="relative">
            <h2 className="px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-primary/5 border-l-4 border-primary border-r-4 rounded-lg shadow-sm backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <span>{section.label}</span>
              </div>
            </h2>
            {/* Línea decorativa */}
            <div className="absolute -bottom-1 left-4 right-4 h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          </div>
        </div>
      )}

      {/* Items de la sección */}
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
    </li>
  );
};

export default SidebarSection;
