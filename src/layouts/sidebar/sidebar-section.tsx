"use client";
import {
  Boxes,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Globe2,
  LayoutDashboard,
  PackageSearch,
  Shield,
  Store,
} from "lucide-react";
import AnimateHeight from "react-animate-height";
import SidebarItem from "./sidebar-item";
import { SidebarSectionProps } from "./types";

const SidebarSection = ({
  section,
  isActiveLink,
  expandedItems,
  onToggleItem,
}: SidebarSectionProps) => {
  const sectionExpanded = expandedItems[section.id] ?? true; // fallback abierto

  const sectionIcon = (() => {
    switch (section.id) {
      case "orders":
        return <PackageSearch className="h-4 w-4" />;
      case "business":
        return <Store className="h-4 w-4" />;
      case "warehouse":
        return <Boxes className="h-4 w-4" />;
      case "containers":
        return <Globe2 className="h-4 w-4" />;
      case "billing":
        return <DollarSign className="h-4 w-4" />;
      case "reports":
        return <LayoutDashboard className="h-4 w-4" />;
      case "nomenclators":
        return <PackageSearch className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      default:
        return <LayoutDashboard className="h-4 w-4" />;
    }
  })();

  // Determine if any item (or group item) inside is active for path highlighting
  const sectionActive =
    section.items.some((i) => i.path && isActiveLink(i.path)) ||
    section.groups?.some((g) =>
      g.items.some((i) => i.path && isActiveLink(i.path))
    ) ||
    false;

  return (
    <li>
      <div className="mb-2">
        <button
          type="button"
          onClick={() => onToggleItem(section.id)}
          className={`w-full group flex items-center justify-between px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-wide rounded-md transition-colors border ${
            sectionActive
              ? "bg-primary/10 text-primary border-primary/40"
              : "bg-transparent text-muted-foreground hover:bg-primary/5"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-primary/70 group-hover:text-primary transition-colors">
              {sectionIcon}
            </span>
            <span className={sectionActive ? "text-primary" : ""}>
              {section.label}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              sectionExpanded ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>
      </div>

      <AnimateHeight
        height={sectionExpanded ? "auto" : 0}
        duration={260}
        animateOpacity
        easing="cubic-bezier(0.4, 0, 0.2, 1)"
      >
        <div className="space-y-4" aria-hidden={!sectionExpanded}>
          {section.items && section.items.length > 0 && (
            <ul className="space-y-1">
              {section.items.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  active={item.path ? isActiveLink(item.path) : false}
                  isExpanded={expandedItems[item.id]}
                  onToggle={() => onToggleItem(item.id)}
                  isActiveLink={isActiveLink}
                />
              ))}
            </ul>
          )}
          {section.groups && section.groups.length > 0 && (
            <div className="space-y-2">
              {section.groups.map((group) => {
                const groupId = `${section.id}:${group.id}`;
                const groupExpanded = expandedItems[groupId] ?? true;
                const collapsible = group.collapsible !== false;
                const groupActive = group.items.some(
                  (i) => i.path && isActiveLink(i.path)
                );
                return (
                  <div
                    key={group.id}
                    className={`rounded-md border overflow-hidden transition-colors ${
                      groupActive
                        ? "bg-primary/5 border-primary/40"
                        : "bg-transparent"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => collapsible && onToggleItem(groupId)}
                      className={`flex w-full items-center justify-between px-3 py-2 text-[11px] font-semibold tracking-wide uppercase transition-colors ${
                        groupActive
                          ? "text-primary"
                          : "text-muted-foreground hover:bg-primary/5"
                      } ${collapsible ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <span
                        className={`flex items-center gap-1 ${
                          groupActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        <ChevronRight
                          className={`h-3 w-3 ${
                            groupExpanded ? "opacity-70" : "opacity-50"
                          }`}
                        />
                        {group.label}
                      </span>
                      {collapsible && (
                        <ChevronDown
                          className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${
                            groupExpanded ? "rotate-0" : "-rotate-90"
                          }`}
                        />
                      )}
                    </button>
                    <AnimateHeight
                      height={groupExpanded ? "auto" : 0}
                      duration={220}
                      easing="cubic-bezier(0.4, 0, 0.2, 1)"
                      animateOpacity
                    >
                      <ul className="p-2 space-y-1">
                        {group.items.map((item) => (
                          <SidebarItem
                            key={item.id}
                            item={item}
                            active={item.path ? isActiveLink(item.path) : false}
                            isExpanded={expandedItems[item.id]}
                            onToggle={() => onToggleItem(item.id)}
                            isActiveLink={isActiveLink}
                          />
                        ))}
                      </ul>
                    </AnimateHeight>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AnimateHeight>
    </li>
  );
};

export default SidebarSection;
