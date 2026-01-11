
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

  const setPageMeta = ({ title, subtitle }: Partial<PageMeta>) => {
    // Only update if changes are provided, merge with existing
    const newMeta = { ...meta };
    if (title) newMeta.title = title;
    if (subtitle) newMeta.subtitle = subtitle;
    
    setMeta(newMeta);

    // Update document title for browser tab
    if (title) document.title = `${APP_NAME} - ${title}`;
  };

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
