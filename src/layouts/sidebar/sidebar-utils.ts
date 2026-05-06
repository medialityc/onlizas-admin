import { SidebarMenuItem, SidebarSection } from "./types";

// Flatten all menu items that have a direct path (ignores subsections for now)
export const flattenSidebarItems = (
  sections: SidebarSection[]
): SidebarMenuItem[] => {
  const items: SidebarMenuItem[] = [];
  sections.forEach((section) => {
    section.items.forEach((item) => {
      if (item.path) {
        items.push(item);
      }
      if (item.subsections) {
        item.subsections.forEach((sub) => {
          sub.items.forEach((subItem) => {
            // We "promote" subsection items to a pseudo menu item shape to allow searching & recent tracking
            items.push({
              id: subItem.id,
              label: subItem.label,
              path: subItem.path,
              icon: item.icon, // inherit parent icon for visual context
            });
          });
        });
      }
    });
  });
  return items;
};

export const matchItemByPath = (
  pathname: string,
  items: SidebarMenuItem[]
): SidebarMenuItem | undefined => {
  // Find the longest item.path that is a prefix of current pathname
  const candidates = items.filter((i) => i.path && pathname.startsWith(i.path));
  if (!candidates.length) return undefined;
  return candidates.sort((a, b) => b.path!.length - a.path!.length)[0];
};

// Future permission-based filtering (pure function; non-destructive)
export const filterSectionsByPermissions = (
  sections: SidebarSection[],
  granted: string[]
): SidebarSection[] => {
  const has = (perm?: string) => !perm || granted.includes(perm);
  const hasAny = (perms?: string[]) =>
    !perms || perms.length === 0 || perms.some((p) => granted.includes(p));
  const itemAllowed = (i: { permission?: string; permissions?: string[] }) =>
    has(i.permission) && hasAny(i.permissions);

  return sections
    .map((section) => {
      // clone shallow
      const newSection: SidebarSection = { ...section };

      // Filter section-level permissions
      if (!itemAllowed(section)) {
        return null;
      }

      if (section.items) {
        newSection.items = section.items.filter(itemAllowed);
      }
      if (section.groups) {
        newSection.groups = section.groups
          .map((g) => ({
            ...g,
            items: g.items.filter(itemAllowed),
          }))
          .filter((g) => g.items.length > 0);
      }
      const hasContent =
        (newSection.items && newSection.items.length > 0) ||
        (newSection.groups && newSection.groups.length > 0);
      return hasContent ? newSection : null;
    })
    .filter(Boolean) as SidebarSection[];
};
