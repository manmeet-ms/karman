'use client';
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDENAV_DASH } from '@/shared/appVariables';
import { IconArrowUp } from '@tabler/icons-react';
const arr = ['Reminders', 'Advice', 'Agreement', 'Beta', 'Analytics', 'Urges', 'Leaderboard'];
export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <section className="bg-background pb-safe fixed bottom-0 z-50 flex w-full items-center justify-evenly overflow-x-scroll border-t px-2 lg:hidden">
      {SIDENAV_DASH.map(({ title, url, icon: Icon }) => {
        const isActive = pathname === url;
        // Logic from source: filter out specific items for the bottom nav
        if (!arr.includes(title)) {
          return (
            <Link
              key={url}
              href={url}
              className={cn(
                'flex flex-col items-center justify-center gap-2 px-2 py-2 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}>
              <Icon
                className={cn(
                  'h-8 w-14 rounded-full px-4.75',
                  isActive ? 'text-primary bg-primary/20' : '',
                )}
              />
              <span className="text-center">{title}</span>
            </Link>
          );
        }
        return null;
      })}
    </section>
  );
};
