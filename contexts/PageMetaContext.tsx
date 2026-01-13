
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import dayjs from "dayjs";
import { APP_NAME } from "@/shared/appVariables";

interface PageMeta {
  title: string;
  subtitle: string;
  headerActions?: ReactNode;
}

interface PageMetaContextType {
  meta: PageMeta;
  setPageMeta: (meta: Partial<PageMeta>) => void;
}

const PageMetaContext = createContext<PageMetaContextType | undefined>(undefined);

export function PageMetaProvider({ children }: { children: ReactNode }) {
  const [meta, setMeta] = useState<PageMeta>({
    title: "Karman - Home",
    subtitle: `${dayjs().format('DD MMM, YYYY HH:mm a')}`,
    headerActions: undefined,
  });

  const setPageMeta = React.useCallback((updates: Partial<PageMeta>) => {
    setMeta((prev) => {
      // If values haven't changed, return previous state to avoid re-render
      if (
        (updates.title === undefined || updates.title === prev.title) &&
        (updates.subtitle === undefined || updates.subtitle === prev.subtitle) &&
        (!('headerActions' in updates) || updates.headerActions === prev.headerActions)
      ) {
        return prev;
      }

      const newMeta = { ...prev };
      if (updates.title) {
        newMeta.title = updates.title;
        document.title = `${APP_NAME} - ${updates.title}`;
      }
      if (updates.subtitle) newMeta.subtitle = updates.subtitle;
      if ('headerActions' in updates) newMeta.headerActions = updates.headerActions;

      return newMeta;
    });
  }, []);

  return (
    <PageMetaContext.Provider value={{ meta, setPageMeta }}>
      {children}
    </PageMetaContext.Provider>
  );
}

export function usePageMeta() {
  const context = useContext(PageMetaContext);
  if (context === undefined) {
    throw new Error("usePageMeta must be used within a PageMetaProvider");
  }
  return context;
}
