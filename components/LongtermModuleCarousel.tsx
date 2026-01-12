"use client";

import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPlus, IconTrash, IconEdit, IconLoader } from "@tabler/icons-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Module {
    id: string;
    title: string;
    description: string;
    content: string;
    startDate?: string;
    createdAt: string;
}

export function LongtermModuleCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false, dragFree: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: true })
    ]);
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);

    // CRUD State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editModule, setEditModule] = useState<Module | null>(null);
    const [formData, setFormData] = useState({ title: "", description: "", content: "", startDate: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchModules = useCallback(async () => {
        try {
            const res = await axios.get("/api/longterm-modules");
            setModules(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch modules");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

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
        if (!editModule) return;
        setIsSubmitting(true);
        try {
            await axios.put(`/api/longterm-modules/${editModule.id}`, formData);
            toast.success("Module updated");
            setEditModule(null);
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
            fetchModules();
        } catch {
            toast.error("Failed to delete module");
        }
    };

    // Open Edit Dialog
    const openEdit = (m: Module) => {
        setEditModule(m);
        setFormData({ title: m.title, description: m.description || "", content: m.content || "", startDate: m.startDate || "" });
    };

    return (
        <div className="w-full relative group">
             <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    Longterm Modules <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px]">{modules.length}</span>
                </h3>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                            <IconPlus size={12} /> Add Module
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Longterm Module</DialogTitle>
                            <DialogDescription>Track major learning goals or projects.</DialogDescription>
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
                            <Button onClick={handleCreate} disabled={isSubmitting}>create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-hidden p-1 -m-1" ref={emblaRef}>
                <div className="flex gap-4 touch-pan-y touch-pinch-zoom">
                    {loading ? (
                        <div className="flex items-center justify-center w-full h-24 text-muted-foreground text-xs"><IconLoader className="animate-spin mr-2" size={16}/> Loading...</div>
                    ) : modules.length === 0 ? (
                         <div className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33%]">
                             <Card className="h-full border-dashed flex items-center justify-center p-6 text-muted-foreground text-sm cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setIsCreateOpen(true)}>
                                 <div className="flex flex-col items-center gap-2">
                                     <IconPlus size={24} />
                                     <span>Create your first module</span>
                                 </div>
                             </Card>
                         </div>
                    ) : (
                        modules.map(mod => (
                            <div className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] select-none pl-1" key={mod.id}>
                                <Card className="h-full flex flex-col justify-between hover:border-primary/50 transition-colors group/card relative">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base truncate" title={mod.title}>{mod.title}</CardTitle>
                                        <CardDescription className="line-clamp-2 text-xs">{mod.description || "No description"}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-xs text-muted-foreground line-clamp-3 pb-2 flex-grow">
                                        {mod.content}
                                    </CardContent>
                                    <CardFooter className="pt-0 flex justify-between items-center text-[10px] text-muted-foreground">
                                        <span>{dayjs(mod.createdAt).fromNow()}</span>
                                        <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon-sm" className="h-6 w-6" onClick={() => openEdit(mod)}><IconEdit size={12} /></Button>
                                            
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon-sm" className="h-6 w-6 text-destructive hover:text-destructive"><IconTrash size={12} /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Module?</AlertDialogTitle>
                                                        <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(mod.id)} className="bg-destructive">Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editModule} onOpenChange={(open) => !open && setEditModule(null)}>
                <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Module</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Date Started</Label>
                                <Input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleUpdate} disabled={isSubmitting}>Update</Button>
                        </DialogFooter>
                    </DialogContent>
            </Dialog>
        </div>
    );
}
