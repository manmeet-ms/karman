
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import dayjs from "dayjs";
import { APP_NAME } from "@/shared/appVariables.shared";

interface PageMeta {
  title: string;
  subtitle: string;
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
  });

  const setPageMeta = React.useCallback(({ title, subtitle }: Partial<PageMeta>) => {
    setMeta((prev) => {
      // If values haven't changed, return previous state to avoid re-render
      if (
        (title === undefined || title === prev.title) &&
        (subtitle === undefined || subtitle === prev.subtitle)
      ) {
        return prev;
      }

      const newMeta = { ...prev };
      if (title) {
        newMeta.title = title;
        document.title = `${APP_NAME} - ${title}`;
      }
      if (subtitle) newMeta.subtitle = subtitle;
      
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
