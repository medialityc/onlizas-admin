"use client";
import { useTheme } from "next-themes";
import { sidebarSections } from "./sidebar-config";
import SidebarContent from "./sidebar-content";
import SidebarHeader from "./sidebar-header";
import { useSidebar } from "./use-sidebar";

const Sidebar = () => {
  const { theme } = useTheme();
  const { expandedItems, isActiveLink, toggleItem } = useSidebar();

  return (
    <div className={theme == "dark" ? "dark" : ""}>
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${theme == "dark" ? "text-white-dark" : ""}`}
      >
        <div className="h-full bg-white dark:bg-black">
          <SidebarHeader />
          <SidebarContent
            sections={sidebarSections}
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
