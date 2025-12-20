"use client";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import SearchBar from "./search-bar";
import { sidebarSections } from "./sidebar-config";
// import { filterSectionsByPermissions } from "./sidebar-utils"; // Uncomment when integrating permissions
import SidebarContent from "./sidebar-content";
import SidebarHeader from "./sidebar-header";
import { useSidebar } from "./use-sidebar";

const Sidebar = () => {
  const { theme } = useTheme();
  const { expandedItems, isActiveLink, toggleItem } = useSidebar();
  const themeConfig = useSelector((state: RootState) => state.themeConfig);
  const [search, setSearch] = useState("");

  // Placeholder for future permission integration
  // const userPermissions = ["orders.view", "business.view", ...];
  // const permittedSections = useMemo(
  //   () => filterSectionsByPermissions(sidebarSections, userPermissions),
  //   [userPermissions]
  // );
  // const baseSections = permittedSections;
  const baseSections = sidebarSections;

  const normalize = (str: string) =>
    str
      .normalize("NFD")
      // Remove combining diacritical marks
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredSections = useMemo(() => {
    if (!search.trim()) return baseSections;
    const term = normalize(search);
    return baseSections
      .map((section) => {
        const matchedItems = section.items.filter((item) => {
          const baseMatch = normalize(item.label).includes(term);
          const subsectionMatch = item.subsections?.some((s) =>
            s.items.some((si) => normalize(si.label).includes(term))
          );
          return baseMatch || subsectionMatch;
        });
        if (!matchedItems.length) return null;
        const processedItems = matchedItems.map((mi) => {
          if (!mi.subsections) return mi;
          return {
            ...mi,
            subsections: mi.subsections
              .map((sub) => {
                const filteredSubItems = sub.items.filter((si) =>
                  normalize(si.label).includes(term)
                );
                if (!filteredSubItems.length) return null;
                return { ...sub, items: filteredSubItems };
              })
              .filter(Boolean) as typeof mi.subsections,
          };
        });
        return { ...section, items: processedItems };
      })
      .filter(Boolean) as typeof baseSections;
  }, [search, baseSections]);

  return (
    <div className={theme == "dark" ? "dark" : ""}>
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-65 shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${
          !themeConfig.sidebar
            ? "-translate-x-full lg:translate-x-0"
            : "translate-x-0"
        } ${theme == "dark" ? "text-white-dark" : ""}`}
      >
        <div className="h-full flex flex-col bg-white dark:bg-black">
          <div className="shrink-0">
            <SidebarHeader />
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <SidebarContent
            sections={filteredSections}
            expandedItems={expandedItems}
            onToggleItem={toggleItem}
            isActiveLink={isActiveLink}
          />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
