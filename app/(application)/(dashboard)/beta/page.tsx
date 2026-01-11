"use client"
import React, { useEffect } from 'react';
import { usePageMeta } from "@/contexts/PageMetaContext";

export default function BetaPage() { 
  const { setPageMeta } = usePageMeta();
  useEffect(() => {
      setPageMeta({ title: "Beta", subtitle: "Experimental Features" });
  }, []);
  return <div className="p-4"><h1 className="text-2xl font-bold">Beta Features</h1></div>; }
