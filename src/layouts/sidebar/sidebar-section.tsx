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
    <>
      {!section.noSection && (
        <div className="p-2">
        <h2 className="-mx-4 mb-1 flex bg-blue-600 text-white rounded-xl items-center px-7 py-3 font-extrabold uppercase dark:bg-[#2563EB dark:text-textColor">
          <span>{section.label}</span>
        </h2>
        </div>
      )}

      {/* Always show items - sections are always expanded now */}
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
    </>
  );
};

export default SidebarSection;
