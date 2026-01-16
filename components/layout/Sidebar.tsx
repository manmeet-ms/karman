
"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SIDENAV_DASH, USER_POINTS_RANK_TABLE } from "@/shared/appVariables";
import {
  IconInfoCircle,
  IconLayoutSidebarLeftCollapse,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const points = session?.user?.points || 0;

  const { currentRank, nextRank, progressValue } = React.useMemo(() => {
    const sorted = [...USER_POINTS_RANK_TABLE].sort((a, b) => a.minPoints - b.minPoints);
    console.log(session,sorted, points);
    
    let current = sorted[0];
    let next = sorted[1];

    for (let i = 0; i < sorted.length; i++) {
        if (points >= sorted[i].minPoints) {
            current = sorted[i];
            next = sorted[i + 1] || null;
        } else {
            break;
        }
    }

    let prog = 0;
    if (next) {
        const total = next.minPoints - current.minPoints;
        const gained = points - current.minPoints;
        prog = Math.min(100, Math.max(0, Math.floor((gained / total) * 100)));
    } else {
        prog = 100;
    }

    return { currentRank: current, nextRank: next, progressValue: prog };
  }, [points]);

  const RankIcon = currentRank.icon;

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
          <div className={cn("p-2 rounded-full", currentRank.color.split(' ').filter(c => c.startsWith('bg-')).join(' '))}>
             <RankIcon className={cn("size-6", currentRank.color.split(' ').filter(c => c.startsWith('text-')).join(' '))} />
          </div>
          <div className="flex flex-col w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center text-sm font-semibold">
                  {currentRank.name} <IconInfoCircle size={14} className="ml-1 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-xs">
                    {nextRank 
                        ? `${nextRank.minPoints - points} points to ${nextRank.name}` 
                        : "Max Rank Achieved"}
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
      <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden">
        <IconLayoutSidebarLeftCollapse className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>}>

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
