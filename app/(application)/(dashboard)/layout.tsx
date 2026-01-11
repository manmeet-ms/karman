"use client"
import React from "react";
import { Button } from "@/components/ui/button"
import { Sidebar, MobileSidebar } from "@/components/layout/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import RitualInputForm from "@/components/Forms/RitualInputForm";
import UrgeInputForm from "@/components/Forms/UrgeInputForm";
import { IconBrandGoogle, IconBrandGoogleFilled } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import { AppHeader } from "@/components/Header/Headers";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>

      <AppHeader />
        <div className="flex min-h-screen w-full flex-col bg-muted/10 lg:flex-row">
    
      <Sidebar />
   
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 lg:pl-0 w-full">
         <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:hidden">
             {/* <MobileSidebar /> */}
             <div className="w-full flex-1">
                 <span className="font-semibold">Karman</span>
             </div>
         </header>
         
         <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1">
             <div className="flex items-center justify-between mb-4">
                 <div className="hidden lg:block">
                     <h1 className="text-xl font-semibold">Dashboard</h1>
                 </div>
                 <div className="flex gap-2">
                     <RitualInputForm />
                     <UrgeInputForm />
                 </div>
             </div>
             
             <ScrollArea className="h-[calc(100vh-120px)] w-full rounded-md border p-4 bg-background">
                {children}
             </ScrollArea>
         </main>
      </div>
    </div>
    </main>
  );
}
