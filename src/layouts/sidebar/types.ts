import { ReactNode } from "react";

export interface SidebarMenuItem {
  id: string;
  label: string;
  path?: string;
  icon: ReactNode;
  /** Optional permission code required to show this item */
  permission?: string;
  badge?: {
    text: string;
    color?: "primary" | "success" | "warning" | "danger" | "info";
  };
  disabled?: boolean;
  subsections?: SidebarSubsection[];
  isCollapsible?: boolean;
  permissions?: string[]; // Permisos requeridos para mostrar este item
}

export interface SidebarSubsection {
  id: string;
  label: string;
  items: SidebarSubItem[];
  adminOnly?: boolean;
}

export interface SidebarSubItem {
  id: string;
  label: string;
  path: string;
  disabled?: boolean;
  adminOnly?: boolean;
  permissions?: string[]; // Permisos requeridos para mostrar este subitem
  permission?: string;
}

export interface SidebarSection {
  id: string;
  label: string;
  items: SidebarMenuItem[];
  icon?: ReactNode;
  noSection?: boolean;
  /** Optional grouped subsections inside a section (alternative to flat items) */
  groups?: SidebarSectionGroup[];
}

export interface SidebarSectionGroup {
  id: string; // unique inside the section
  label: string;
  items: SidebarMenuItem[]; // regular menu items
  /** If true, group is collapsible (default true) */
  collapsible?: boolean;
  adminOnly?: boolean; // Solo para admin
}

export interface SidebarProps {
  sections: SidebarSection[];
  expandedItems: { [key: string]: boolean };
  onToggleItem: (itemId: string) => void;
}

export interface SidebarSectionProps {
  section: SidebarSection;
  isActiveLink: (path: string) => boolean;
  expandedItems: { [key: string]: boolean };
  onToggleItem: (itemId: string) => void;
}

export interface SidebarItemProps {
  item: SidebarMenuItem;
  active: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  isActiveLink: (path: string) => boolean;
}
