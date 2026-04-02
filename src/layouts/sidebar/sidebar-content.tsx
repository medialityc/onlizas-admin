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
  hasActiveSearch = false,
}: SidebarProps & {
  isActiveLink: (path: string) => boolean;
  hasActiveSearch?: boolean;
}) => {
  const { recentSection } = useRecentRoutes();

  // Insert recent section at the top if exists
  const fullSections: SidebarSectionType[] = useMemo(() => {
    if (!recentSection) return sections;
    return [recentSection, ...sections];
  }, [recentSection, sections]);

  return (
    <div className="ultra-thin-scrollbar relative max-h-[calc(100vh-80px)] overflow-auto">
      <ul className="relative space-y-1 p-4 pb-36 font-semibold">
        {fullSections.map((section) => (
          <SidebarSection
            key={section.id}
            section={section}
            expandedItems={expandedItems}
            onToggleItem={onToggleItem}
            isActiveLink={isActiveLink}
            hasActiveSearch={hasActiveSearch}
          />
        ))}
      </ul>
    </div>
  );
};

export default SidebarContent;
