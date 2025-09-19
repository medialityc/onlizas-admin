import { ReactNode } from "react";

export interface SidebarMenuItem {
  id: string;
  label: string;
  path?: string;
  icon: ReactNode;
  badge?: {
    text: string;
    color?: "primary" | "success" | "warning" | "danger" | "info";
  };
  disabled?: boolean;
  subsections?: SidebarSubsection[];
  isCollapsible?: boolean;
  adminOnly?: boolean; // Solo para admin
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
}

export interface SidebarSection {
  id: string;
  label: string;
  items: SidebarMenuItem[];
  icon?: ReactNode;
  noSection?: boolean;
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
  isActive: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  isActiveLink: (path: string) => boolean;
}
