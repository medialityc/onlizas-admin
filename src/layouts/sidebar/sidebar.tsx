"use client";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import SearchBar from "./search-bar";
import { sidebarSections } from "./sidebar-config";
import SidebarContent from "./sidebar-content";
import SidebarHeader from "./sidebar-header";
import { filterSectionsByPermissions } from "./sidebar-utils";
import { useSidebar } from "./use-sidebar";
import { usePermissions } from "@/hooks/use-permissions";

const Sidebar = () => {
  const { theme } = useTheme();
  const { expandedItems, isActiveLink, toggleItem } = useSidebar();
  const [search, setSearch] = useState("");
  const { permissions, isLoading: permissionsLoading } = usePermissions();
  const baseSections = sidebarSections;

  const permissionFilteredSections = useMemo(() => {
    if (permissionsLoading) return baseSections;
    return filterSectionsByPermissions(baseSections, permissions);
  }, [baseSections, permissions, permissionsLoading]);

  const normalize = (str: string) =>
    str
      .normalize("NFD")
      // Remove combining diacritical marks
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredSections = useMemo(() => {
    if (!search.trim()) return permissionFilteredSections;
    const term = normalize(search);
    return permissionFilteredSections
      .map((section) => {
        // Filter regular items
        const matchedItems = section.items.filter((item) => {
          const baseMatch = normalize(item.label).includes(term);
          const subsectionMatch = item.subsections?.some((s) =>
            s.items.some((si) => normalize(si.label).includes(term)),
          );
          return baseMatch || subsectionMatch;
        });

        // Filter groups (e.g., nomencladores)
        const matchedGroups = section.groups
          ?.map((group) => {
            const groupItems = group.items.filter((item) => {
              const baseMatch = normalize(item.label).includes(term);
              const subsectionMatch = item.subsections?.some((s) =>
                s.items.some((si) => normalize(si.label).includes(term)),
              );
              return baseMatch || subsectionMatch;
            });
            if (!groupItems.length) return null;
            return { ...group, items: groupItems };
          })
          .filter(Boolean) as typeof section.groups;

        // Skip section if no matches found
        if (!matchedItems.length && (!matchedGroups || !matchedGroups.length)) {
          return null;
        }

        const processedItems = matchedItems.map((mi) => {
          if (!mi.subsections) return mi;
          return {
            ...mi,
            subsections: mi.subsections
              .map((sub) => {
                const filteredSubItems = sub.items.filter((si) =>
                  normalize(si.label).includes(term),
                );
                if (!filteredSubItems.length) return null;
                return { ...sub, items: filteredSubItems };
              })
              .filter(Boolean) as typeof mi.subsections,
          };
        });

        return {
          ...section,
          items: processedItems,
          groups: matchedGroups,
        };
      })
      .filter(Boolean) as typeof permissionFilteredSections;
  }, [search, permissionFilteredSections]);

  const hasActiveSearch = !!search.trim();
  return (
    <div className={theme == "dark" ? "dark" : ""}>
      <nav
        className={`sidebar fixed top-0 bottom-0 z-51 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[width,background,box-shadow] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${
          theme == "dark" ? "text-white-dark" : ""
        }`}
      >
        <div className="h-full bg-white dark:bg-black">
          <SidebarHeader />
          <SearchBar value={search} onChange={setSearch} />
          <SidebarContent
            sections={filteredSections}
            expandedItems={expandedItems}
            onToggleItem={toggleItem}
            isActiveLink={isActiveLink}
            hasActiveSearch={hasActiveSearch}
          />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
