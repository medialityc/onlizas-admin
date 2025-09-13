"use client";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { paymentSections } from "../sidebar-config";
import { AppSidebarContent } from "./app-sidebar-content";
import { AppSidebarHeader } from "./app-sidebar-header";
import SidebarDropdown from "../sidebar-dropdown";

export const AppSidebar = () => {
  const { theme } = useTheme();

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
        <div className="h-full w-full bg-white dark:bg-black overflow-hidden">
          <AppSidebarHeader>
            <SidebarDropdown title="Onlizas" subtitle="Panel de Pasarelas" />
          </AppSidebarHeader>
          <AppSidebarContent sections={paymentSections} />
        </div>
      </nav>
    </div>
  );
};
