"use client";

import { createContext, useContext } from "react";
import { ImporterData } from "@/services/importer-portal";

interface ImporterDataContextType {
  importerData: ImporterData | null;
}

const ImporterDataContext = createContext<ImporterDataContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
  importerData: ImporterData | null;
}

export function ImporterDataProvider({ children, importerData }: Props) {
  return (
    <ImporterDataContext.Provider value={{ importerData }}>
      {children}
    </ImporterDataContext.Provider>
  );
}

export function useImporterData() {
  const context = useContext(ImporterDataContext);
  if (context === undefined) {
    throw new Error("useImporterData must be used within an ImporterDataProvider");
  }
  return context;
}
