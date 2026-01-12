
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SIDENAV_DASH } from "@/shared/appVariables.shared";
import {
  IconInfoCircle,
  IconMilitaryAward,
  IconLayoutSidebarLeftCollapse,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

const currentRank = { name: "Novice", minPoints: 0, emoji: "🌱" };
const nextRank = { name: "Acolyte", minPoints: 500 };

export function Sidebar() {
  const pathname = usePathname();
  const points = 120; // Placeholder

  const progressValue = React.useMemo(() => {
    if (points && nextRank?.minPoints) {
      return Math.floor((points / nextRank.minPoints) * 100);
    }
    return 0;
  }, [points]);

  return (
    <nav className="flex flex-col min-w-48 max-h-screen space-y-4 p-4 border-r hidden lg:flex h-screen">
      <div className="flex flex-col gap-1">
          {SIDENAV_DASH.map(({ title, url, icon: Icon }) => {
            const isActive = pathname === url;
            return (
              <Link
                key={url}
                href={url}
                className={cn(
                  "my-0.5 rounded-full py-2 px-4 text-sm font-medium transition-colors flex items-center",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/40"
                )}
              >
                <Icon className="mr-2 size-4" />
                <span>{title}</span>
              </Link>
            );
          })}
      </div>

      <div className="flex flex-col gap-4">
          {/* Rank Card */}
          <div className="bg-card flex gap-4 border rounded-lg p-2 items-center">
             <IconMilitaryAward className="bg-accent/60 p-2 size-10 rounded-full text-primary" />
             <div className="flex flex-col w-full">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="flex items-center text-sm font-semibold">
                            {currentRank.name} <IconInfoCircle size={14} className="ml-1 text-muted-foreground"/>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span className="text-xs">
                                {Math.abs(nextRank.minPoints - points)} points to {nextRank.name}
                            </span>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <div className="flex items-center gap-2 w-full mt-1">
                     <Progress value={progressValue} className="h-1 flex-1" />
                     <span className="text-[10px] text-muted-foreground">{progressValue}%</span>
                </div>
             </div>
          </div>

          {/* NPC Card */}
          <div className="relative flex flex-col justify-end overflow-hidden rounded-2xl px-6 pb-6   border">
               {/* <Image width={12} height={12} src="https://placehold.co/1084x1284" alt=""/> */}
               <h3 className="z-10 mt-3 text-xl font-medium text-white">Don&apos;t be an NPC</h3>
               <div className="z-10 text-xs text-gray-300">It&apos;s fatal, take back control</div>
          </div>
      </div>
    </nav>
  );
}

export function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <IconLayoutSidebarLeftCollapse className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
                <SheetHeader>
                    <SheetTitle>Karman</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <nav className="grid gap-6 text-lg font-medium">
                     {SIDENAV_DASH.map(({ title, url, icon: Icon }) => (
                        <Link
                            key={url}
                            href={url}
                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <Icon className="h-5 w-5" />
                            {title}
                        </Link>
                     ))}
                </nav>
            </SheetContent>
        </Sheet>
    )
}
