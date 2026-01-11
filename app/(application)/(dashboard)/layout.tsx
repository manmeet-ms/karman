"use client"
import React from "react";
import { Button } from "@/components/ui/button"
import { Sidebar, MobileSidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import RitualInputForm from "@/components/Forms/RitualInputForm";
import UrgeInputForm from "@/components/Forms/UrgeInputForm";
import { IconBrandGoogle, IconBrandGoogleFilled } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import { AppHeader } from "@/components/Header/Headers";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="overflow-hidden max-h-screen" >

      <AppHeader />
        <div className="flex  w-full flex-col   lg:flex-row">
    
      <Sidebar />
     <ScrollArea className="container w-full h-[calc(100vh-120px)]     ">
                 
             
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 lg:pl-0 w-full pb-16 lg:pb-0">
         <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b   px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:hidden">
             <MobileSidebar />
             <div className="w-full flex-1">
                 <span className="font-semibold">Karman</span>
             </div>
         </header>
         
         <main className="grid flex-1  items-start gap-4     md:gap-8 lg:grid-cols-1">
             <div className="flex border-b pb-4 px-4  items-center justify-between">
                 <div className="hidden lg:block">
                     <h1 className="text-xl font-semibold">Dashboard</h1>
                 </div>
                 <div className="flex gap-2">
                     <RitualInputForm />
                     <UrgeInputForm />
                 </div>
             </div>
             
             <ScrollArea className="h-[calc(100vh-120px)]  px-4  rounded-md     bg-background">
                {children}  
             </ScrollArea>
         </main>
      </div></ScrollArea>
      <BottomNav />
    </div>
    </main>
  );
}
