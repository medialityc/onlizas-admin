"use client";
import { paths } from "@/config/paths";
import { RootState } from "@/store";
import { toggleSidebar } from "@/store/themeConfigSlice";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sidebarSections } from "./sidebar-config";
import { flattenSidebarItems, matchItemByPath } from "./sidebar-utils";
import { useSidebarPreferences } from "./use-sidebar-preferences";

// Función para verificar si una sección tiene elementos activos
const sectionHasActiveItems = (
  sectionId: string,
  pathname: string
): boolean => {
  const section = sidebarSections.find((s) => s.id === sectionId);
  if (!section) return false;

  return section.items.some((item) => {
    if (item.path === paths.dashboard.root) {
      return pathname === item.path;
    }
    return item.path && pathname.startsWith(item.path);
  });
};

export const useSidebar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const themeConfig = useSelector((state: RootState) => state.themeConfig);

  // State for expanded items within sections
  // Combinamos estado inicial de secciones e items
  // Start everything collapsed by default
  const collapsedDefaults: Record<string, boolean> = {};
  sidebarSections.forEach((s) => (collapsedDefaults[s.id] = false));
  // groups collapsed
  sidebarSections.forEach((s) =>
    s.groups?.forEach((g) => (collapsedDefaults[`${s.id}:${g.id}`] = false))
  );
  const initialState = { ...collapsedDefaults };
  // We will maintain a single map that includes sections, items and groups (group ids will be namespaced as sectionId:groupId)
  const { expandedSections: expandedItems, toggleSection: toggleItem } =
    useSidebarPreferences(initialState);

  const flatItems = useMemo(() => flattenSidebarItems(sidebarSections), []);
  const activeItem = useMemo(
    () => matchItemByPath(pathname, flatItems),
    [pathname, flatItems]
  );

  const isActiveLink = (path: string) => activeItem?.path === path;

  const setActiveRoute = () => {
    const allLinks = document.querySelectorAll(".sidebar ul a.active");
    for (let i = 0; i < allLinks.length; i++) {
      const element = allLinks[i];
      element?.classList.remove("active");
    }
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    selector?.classList.add("active");
  };

  useEffect(() => {
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    if (selector) {
      selector.classList.add("active");
      const ul: any = selector.closest("ul.sub-menu");
      if (ul) {
        let ele: any =
          ul.closest("li.menu").querySelectorAll(".nav-link") || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    setActiveRoute();
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }

    // Expand the path (section -> group if any) for the active item
    if (activeItem) {
      // Find section containing this item
      sidebarSections.forEach((section) => {
        const inItems = section.items.some((i) => i.id === activeItem.id);
        const inGroup = section.groups?.some((g) =>
          g.items.some((i) => i.id === activeItem.id)
        );
        if (inItems || inGroup) {
          if (!expandedItems[section.id]) toggleItem(section.id);
          if (inGroup) {
            const group = section.groups!.find((g) =>
              g.items.some((i) => i.id === activeItem.id)
            );
            if (group) {
              const groupId = `${section.id}:${group.id}`;
              if (!expandedItems[groupId]) toggleItem(groupId);
            }
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, activeItem]);

  return {
    expandedItems,
    isActiveLink,
    toggleItem,
    sectionHasActiveItems: (sectionId: string) =>
      sectionHasActiveItems(sectionId, pathname),
    activeItem,
  };
};
