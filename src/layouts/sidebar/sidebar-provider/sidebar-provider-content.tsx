"use client";
import { SidebarProps } from "../types";
import SidebarProviderSection from "./sidebar-prover-section";

const SidebarProviderContent = ({
  sections,
  expandedItems,
  onToggleItem,
  isActiveLink,
}: SidebarProps & { isActiveLink: (path: string) => boolean }) => {
  return (
    <div className="relative flex-1 overflow-y-auto overflow-x-hidden ultra-thin-scrollbar bg-white dark:bg-gray-900">
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
