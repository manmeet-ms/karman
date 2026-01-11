
"use client";

import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDENAV_DASH } from "@/shared/appVariables.shared";

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <section className="fixed z-50 w-full bg-background border-t flex justify-evenly bottom-0 lg:hidden pb-safe">
      {SIDENAV_DASH.map(({ title, url, icon: Icon }) => {
        const isActive = pathname === url;
        // Logic from source: filter out specific items for the bottom nav
        if (title !== "Beta" && title !== "Analytics" && title !== "Urges" && title !== "Leaderboard") {
            return (
              <Link
                key={url}
                href={url}
                className={cn(
                  "py-2 gap-1 flex flex-col items-center justify-center px-2 text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
                <span>{title}</span>
              </Link>
            );
        }
        return null;
      })}
    </section>
  );
};
