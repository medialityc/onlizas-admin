"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { sidebarSections } from "./sidebar-config";
import { SidebarMenuItem, SidebarSection } from "./types";
import { flattenSidebarItems, matchItemByPath } from "./sidebar-utils";

const RECENT_ROUTES_KEY = "sidebar-recent-routes";
const MAX_RECENTS = 5;

interface RecentEntry {
  path: string;
}

export const useRecentRoutes = () => {
  const pathname = usePathname();
  const [recentPaths, setRecentPaths] = useState<string[]>([]);

  const flatItems = flattenSidebarItems(sidebarSections);

  // Load on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_ROUTES_KEY);
      if (raw) {
        const parsed: RecentEntry[] = JSON.parse(raw);
        setRecentPaths(parsed.map((p) => p.path));
      }
    } catch (e) {
      console.warn("Failed to load recent routes", e);
    }
  }, []);

  // Track navigation changes
  useEffect(() => {
    if (!pathname) return;
    const matched = matchItemByPath(pathname, flatItems);
    if (!matched || !matched.path) return;
    const matchedPath = matched.path;

    setRecentPaths((prev) => {
      const without = prev.filter((p) => p !== matchedPath);
      const next = [matchedPath, ...without].slice(0, MAX_RECENTS);
      try {
        localStorage.setItem(
          RECENT_ROUTES_KEY,
          JSON.stringify(next.map((p) => ({ path: p })))
        );
      } catch (e) {
        console.warn("Failed to persist recent routes", e);
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const recentItems: SidebarMenuItem[] = recentPaths
    .map((p) => flatItems.find((i) => i.path === p))
    .filter((i): i is SidebarMenuItem => Boolean(i));

  const recentSection: SidebarSection | null = recentItems.length
    ? {
        id: "recent",
        label: "Recientes",
        items: recentItems,
      }
    : null;

  return { recentSection, recentItems };
};
