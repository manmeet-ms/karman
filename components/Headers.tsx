"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IconBolt, IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { IconCircleFilled, IconLogout, IconPercentage10, IconPlus, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import dayjs from "dayjs";
import { EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toogle";
import { ServiceWorkerRegister } from "./ServiceWorkerRegister";

interface Module {
  id: string;
  title: string;
  description: string;
  content: string;
  startDate?: string;
  createdAt: string;
}

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}
export function AppHeader() {

  const session = useSession()
  const [emblaRef, emblaApi] = useEmblaCarousel({ axis: 'y', loop: true }, [Autoplay()])
  const [stats, setStats] = useState<any>({ points: 0, rank: "Rookie" });

  // Module State
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewModule, setViewModule] = useState<Module | null>(null); // For viewing details
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", content: "", startDate: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/me");
      if (res.ok) {
        const data = await res.json();
        setStats((prev: any) => ({ ...prev, points: data.points }));
      }
    } catch (e) {
      console.error("Failed to fetch user data", e);
    }
  }

  const fetchModules = async () => {
    try {
      const res = await axios.get("/api/longterm-modules");
      setModules(res.data);
    } catch (error) {
      console.error("Failed to fetch modules", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchModules();
  }, []);

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/longterm-modules", formData);
      toast.success("Module created");
      setIsCreateOpen(false);
      setFormData({ title: "", description: "", content: "", startDate: "" });
      fetchModules();
    } catch {
      toast.error("Failed to create module");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!viewModule) return;
    setIsSubmitting(true);
    try {
      await axios.put(`/api/longterm-modules/${viewModule.id}`, formData);
      toast.success("Module updated");
      setIsEditMode(false);
      setViewModule(null); // Close dialog or maybe keep open with updated data? Let's close for simplicity
      setFormData({ title: "", description: "", content: "", startDate: "" });
      fetchModules();
    } catch {
      toast.error("Failed to update module");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/longterm-modules/${id}`);
      toast.success("Module deleted");
      setViewModule(null);
      fetchModules();
    } catch {
      toast.error("Failed to delete module");
    }
  };

  const openView = (m: Module) => {
    setViewModule(m);
    setIsEditMode(false); // Default to view mode
    setFormData({ title: m.title, description: m.description || "", content: m.content || "", startDate: m.startDate || "" });
  };

  const calculateDay = (startDate?: string) => {
    if (!startDate) return 0;
    return dayjs().diff(dayjs(startDate), "days");
  };

  const pointsLedgerFe: any[] = []

  return (
    <>
      <header className="p-4 sticky top-0 z-10  border-b  backdrop-blur-2xl ">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {" "}
            <Image src="/logo.svg" width={24} height={24} className="w-8 h-8 rounded" alt="logo" />
            <div className="flex flex-col">
              {" "}
              <span className="text-lg font-semibold tracking-tighter">Karman</span>
              <span className="text-[10px] uppercase tracking-widest text-secondary">
                formerly Jathedar
              </span>
            </div>
          </Link>

          <div className="hidden md:flex container max-w-[65%] overflow-x-scroll no-scrollbar p-1 border gap-2 rounded-full ">
            {modules.map((item) => (
              <div key={item.id} onClick={() => openView(item)} className="bg-primary/10 text-primary cursor-pointer backdrop-blur-2xl flex flex-nowrap items-center gap-2 rounded-full px-3 py-2 text-xs/4 whitespace-nowrap ring ring-gray-950/8 dark:ring-white/10 hover:bg-gray-950/2 hover:ring-gray-950/10 dark:hover:bg-white/5 dark:hover:ring-white/20">
                <IconPercentage10 className="text-primary size-4 " />
                <span className="font-medium">
                  {item.title} - <b>Day {calculateDay(item.startDate)}</b>{" "}
                </span>
              </div>
            ))}

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger render={<Button className="sticky right-0 rounded-full w-8 h-8 p-0" variant="ghost"><IconPlus size={16} /></Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Longterm Module</DialogTitle>
                  <DialogDescription>Track a new long-term goal.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Title</Label>
                    <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Master Python" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Date Started</Label>
                    <Input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreate} disabled={isSubmitting}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* View/Edit Dialog - Shared */}
            <Dialog open={!!viewModule} onOpenChange={(open) => !open && setViewModule(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isEditMode ? "Edit Module" : viewModule?.title}</DialogTitle>
                  {!isEditMode && <DialogDescription>{viewModule?.description}</DialogDescription>}
                </DialogHeader>

                {isEditMode ? (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Title</Label>
                      <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Date Started</Label>
                      <Input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      <Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Content</Label>
                      <Input value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm text-foreground/80">
                      <p className="mb-2"><strong>Started:</strong> {viewModule?.startDate ? dayjs(viewModule.startDate).format("MMM DD, YYYY") : "N/A"} (Day {calculateDay(viewModule?.startDate)})</p>
                      {viewModule?.content && <p className="whitespace-pre-wrap bg-muted p-2 rounded text-xs">{viewModule.content}</p>}
                    </div>
                  </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                  {isEditMode ? (
                    <>
                      <Button variant="ghost" onClick={() => setIsEditMode(false)}>Cancel</Button>
                      <Button onClick={handleUpdate} disabled={isSubmitting}>Save</Button>
                    </>
                  ) : (
                    <div className="flex w-full justify-between items-center">
                      <Button variant="destructive" size="sm" onClick={() => viewModule && handleDelete(viewModule.id)}><IconTrash size={16} className="mr-1" /> Delete</Button>
                      <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}><IconEdit size={16} className="mr-1" /> Edit</Button>
                    </div>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <section className="flex gap-2 justify-end items-center">
            <ModeToggle />
            {session?.status === 'authenticated' ? (
              <div className="flex gap-2 items-center">
                <ServiceWorkerRegister />

                <Sheet>
                  <SheetTrigger>
                    {" "}
                    <span className={cn("text-sm flex justify-center items-center px-3 gap-1.5 py-2 rounded-full bg-accent/50  ", (stats.points || 0) < 0 ? "text-red-600" : "")}>
                      <IconBolt size={16} />
                      {Number.parseFloat(stats.points ?? 0).toFixed(0)}
                    </span>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>
                        Points Ledger
                        <br />
                        <span className="font-normal text-xs text-secondary-foreground/40">
                          Total Entries till {dayjs(new Date()).format("DD MMM, YYYY")} - {pointsLedgerFe.length}
                        </span>
                      </SheetTitle>
                      <SheetDescription>
                        <ScrollArea className="h-screen ">
                          <ol className=" ">
                            {pointsLedgerFe
                              ? pointsLedgerFe.reverse().map((entry, idx) => (
                                <li key={idx} className="border-b py-2 flex items-center justify-between ">
                                  <div>
                                    <div className="flex gap-4 items-center justify-start">
                                      <span className="opacity-30">#{idx + 1}</span>
                                      <div>
                                        <Badge variant="outline" className="border-0 px-0 ">
                                          {entry.type.includes("credit")}

                                          {entry.type.includes("credit".toUpperCase()) ? <IconTrendingUp className="text-green-400" /> : <IconTrendingDown className="text-red-400" />}
                                          {entry.type.replace(/_/g, " ")}
                                          <IconCircleFilled className="inline mx-1 size-2" />
                                          <span className={cn("text-sm font-normal leading-none ", entry.balanceAfter - entry.points > 0 ? "text-green-400" : "text-red-400")}>{entry.balanceAfter - entry.points}</span>
                                        </Badge>{" "}
                                        <p className="text-xs pl-4 text-secondary-foreground/40">
                                          Balance{" "}
                                          <span className="text-secondary-foreground/40 font-medium">
                                            {entry?.points} → {entry?.balanceAfter}
                                          </span>
                                        </p>
                                      </div>{" "}
                                    </div>{" "}
                                  </div>
                                  <div className="flex flex-col items-end text-xs text-secondary-foreground/40">
                                    <span>{dayjs(entry.createdAt).format("DD MMM")}</span>
                                    <span>{dayjs(entry.createdAt).format("hh:mm a")}</span>
                                  </div>
                                </li>
                              ))
                              : null}
                          </ol>
                        </ScrollArea>
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src={session?.data?.user?.image || undefined} />
                      <AvatarFallback>{session?.data?.user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className=" ">
                        Logged in as {session?.data?.user?.name} <br />
                        <span className="relative top-1 text-muted-foreground/40 mt-1 ">{session?.data?.user?.email}
                        </span>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href={"/settings"}>Settings</Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({callbackUrl:"/login"})} className="flex items-center gap-2 ">
                      Logout <IconLogout size={16} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>) : (
              <Button onClick={() => signIn('google')} >Login</Button>
            )}
          </section>
        </nav>
      </header>
    </>
  );
}
export function AuthHeader() {

  const session = useSession()
   
  return (
    <>
      <header className="p-4 sticky top-0 z-10  border-b  backdrop-blur-2xl ">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {" "}
            <Image src="/logo.svg" width={24} height={24} className="w-8 h-8 rounded" alt="logo" />
            <div className="flex flex-col">
              {" "}
              <span className="text-lg font-semibold tracking-tighter">Karman</span>
              <span className="text-[10px] uppercase tracking-widest text-secondary">
                formerly Jathedar
              </span>
            </div>
          </Link>

        

          <section className="flex gap-2 justify-end items-center">
            <ModeToggle />
            {session?.status === 'authenticated' ? (
              <div className="flex gap-2 items-center">
                <ServiceWorkerRegister />
<div className="flex  items-center text-xs gap-2 border px-2 py-1 rounded-full">
  
               <div className="animate-pulse bg-green-500  w-2 h-2" ></div>
                authenticated
               
</div>

              </div>) : (
              <Button onClick={() => signIn('google')} >Login</Button>
            )}
          </section>
        </nav>
      </header>
    </>
  );
}

export function LandingHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="font-bold text-xl">Karman</div>
      <nav className="flex gap-4">
        <Link href="/"><Button variant="ghost">Dashboard</Button></Link>
        <Link href="/login"><Button>Login</Button></Link>
      </nav>
    </header>
  );
}