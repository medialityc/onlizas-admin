"use client";
import SidebarSection from "./sidebar-section";
import { SidebarProps } from "./types";

const SidebarContent = ({
  sections,
  expandedItems,
  onToggleItem,
  isActiveLink,
}: SidebarProps & { isActiveLink: (path: string) => boolean }) => {
  return (
    <div className="relative max-h-[calc(100vh-80px)] overflow-auto ultra-thin-scrollbar">
      <ul className="relative space-y-1 p-4 py-0  font-semibold">
        {sections.map((section) => (
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
  );
};

export default SidebarContent;
