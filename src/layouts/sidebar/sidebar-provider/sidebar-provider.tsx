"use client";
import { useTheme } from "next-themes";
import SidebarProviderHeader from "./sidebar-provider-header";
import SidebarProviderContent from "./sidebar-provider-content";
import { useSidebar } from "../use-sidebar";
import { sidebarProviderSections } from "./sidebar-provider-config";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const SidebarProvider = () => {
  const { theme } = useTheme();
  const { expandedItems, isActiveLink, toggleItem } = useSidebar();

  const themeConfig = useSelector((state: RootState) => state.themeConfig);

  return (
    <div className={theme == "dark" ? "dark" : ""}>
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${
          !themeConfig.sidebar
            ? "-translate-x-full lg:translate-x-0"
            : "translate-x-0"
        } ${theme == "dark" ? "text-white-dark" : ""}`}
      >
        <div className="h-full w-full flex flex-col bg-white dark:bg-black">
          <div className="shrink-0">
            <SidebarProviderHeader />
          </div>
          <SidebarProviderContent
            sections={sidebarProviderSections}
            expandedItems={expandedItems}
            onToggleItem={toggleItem}
            isActiveLink={isActiveLink}
          />
        </div>
      </nav>
    </div>
  );
};

export default SidebarProvider;
