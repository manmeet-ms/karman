
import React from "react";
import { Hero3 } from "@/components/hero3";
import { AppHeader } from "@/components/Header/Headers";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="px-4">
        <Hero3 />
      </main>
    </div>
  );
}
