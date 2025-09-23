"use client";
import { useMemo } from "react";
import SidebarSection from "./sidebar-section";
import { SidebarProps, SidebarSection as SidebarSectionType } from "./types";
import { useRecentRoutes } from "./use-recent-routes";

const SidebarContent = ({
  sections,
  expandedItems,
  onToggleItem,
  isActiveLink,
}: SidebarProps & { isActiveLink: (path: string) => boolean }) => {
  const { recentSection } = useRecentRoutes();

  // Insert recent section at the top if exists
  const fullSections: SidebarSectionType[] = useMemo(() => {
    if (!recentSection) return sections;
    return [recentSection, ...sections];
  }, [recentSection, sections]);

  return (
    <div className="relative flex-1 overflow-y-auto overflow-x-hidden ultra-thin-scrollbar">
      <ul className="relative space-y-1 p-4 font-semibold">
        {fullSections.map((section) => (
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
