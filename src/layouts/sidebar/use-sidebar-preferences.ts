"use client";
import { useEffect, useState } from "react";

const SIDEBAR_STORAGE_KEY = "sidebar-expanded-sections";

export const useSidebarPreferences = (defaultState: {
  [key: string]: boolean;
}) => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>(defaultState);

  // Cargar preferencias desde localStorage al montar el componente
  useEffect(() => {
    const savedPreferences = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setExpandedSections(parsed);
      } catch (error) {
        console.warn("Error parsing sidebar preferences:", error);
      }
    }
  }, []);

  // Guardar preferencias en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(expandedSections));
  }, [expandedSections]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const setSection = (sectionId: string, isExpanded: boolean) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: isExpanded,
    }));
  };

  const resetToDefault = () => {
    setExpandedSections(defaultState);
  };

  return {
    expandedSections,
    toggleSection,
    setSection,
    resetToDefault,
  };
};
