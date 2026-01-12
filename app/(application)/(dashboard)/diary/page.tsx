"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { usePageMeta } from "@/contexts/PageMetaContext";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IconMessageCirclePlus, IconPencil, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import dayjs from "dayjs";

export default function DiaryPage() {
    const { setPageMeta } = usePageMeta();
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<any>(null);
    const [currentTab, setCurrentTab] = useState("diary");

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tags: [] as string[]
    });

    const categoryTags = ["Diary", "Positive", "Negative", "Thought", "Query"];

    const fetchEntries = async () => {
        try {
            const res = await axios.get("/api/diary");
            setEntries(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch diary entries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPageMeta({ title: "Diary", subtitle: "Personal Records of Thoughts and Reflections" });
        fetchEntries();
    }, [setPageMeta]);

    const handleCreate = async () => {
        try {
            const tags = formData.tags.length > 0 ? formData.tags : [currentTab.charAt(0).toUpperCase() + currentTab.slice(1)];
            await axios.post("/api/diary", { ...formData, tags });
            toast.success("Entry created");
            setIsCreateOpen(false);
            setFormData({ title: "", content: "", tags: [] });
            fetchEntries();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create entry");
        }
    };

    const handleUpdate = async () => {
        if (!editingEntry) return;
        try {
            await axios.put(`/api/diary/${editingEntry.id}`, formData);
            toast.success("Entry updated");
            setIsEditOpen(false);
            setEditingEntry(null);
            fetchEntries();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update entry");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/diary/${id}`);
            toast.success("Entry deleted");
            fetchEntries();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete entry");
        }
    };

    const openEdit = (entry: any) => {
        setEditingEntry(entry);
        setFormData({
            title: entry.title || "",
            content: entry.content,
            tags: entry.tags || []
        });
        setIsEditOpen(true);
    };

    const filteredEntries = useMemo(() => {
        if (currentTab === 'all') return entries;
        // Simple case-insensitive check if tag includes the tab name
        return entries.filter(e => 
            e.tags?.some((t: string) => t.toLowerCase() === currentTab.toLowerCase()) || 
            (currentTab === 'diary' && (!e.tags || e.tags.length === 0 || e.tags.includes('Diary'))) // Default to Diary if no tags?
        );
    }, [entries, currentTab]);

    return (
        <div className="flex flex-col gap-4 p-4 min-h-screen relative">
            <Tabs defaultValue="diary" onValueChange={setCurrentTab} className="w-full">
                <div className="sticky top-0 z-10 flex justify-center bg-background/80 backdrop-blur-sm py-2">
                    <TabsList className="rounded-full shadow-md">
                        {categoryTags.map(tag => (
                            <TabsTrigger key={tag} value={tag.toLowerCase()} className="rounded-full capitalize px-4">
                                {tag}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="mx-auto w-full max-w-6xl mt-4">
                    <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
                        {filteredEntries.map((entry) => {
                             let cardColor = "border-2 border-primary";
                             if (entry.tags.includes('Positive')) cardColor = "border-2 border-green-500";
                             if (entry.tags.includes('Negative')) cardColor = "border-2 border-red-500";
                             if (entry.tags.includes('Thought')) cardColor = "border-2 border-orange-500";

                             return (
                                <Card key={entry.id} className={`break-inside-avoid mb-4 group relative ${cardColor}`}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg capitalize">{entry.title || "Untitled"}</CardTitle>
                                        <CardDescription>{dayjs(entry.createdAt).format("MMM DD, YYYY • hh:mm a")}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-sm">
                                        <p className="whitespace-pre-wrap">{entry.content}</p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                                         <div className="flex gap-1 flex-wrap">
                                            {entry.tags.map((t: string) => (
                                                <span key={t} className="bg-secondary px-1.5 py-0.5 rounded text-[10px]">{t}</span>
                                            ))}
                                         </div>
                                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(entry)}>
                                                 <IconPencil size={14} />
                                             </Button>
                                             <AlertDialog>
                                                 <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive">
                                                        <IconTrash size={14} />
                                                    </Button>
                                                 </AlertDialogTrigger>
                                                 <AlertDialogContent>
                                                     <AlertDialogHeader>
                                                         <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                                                         <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                                                     </AlertDialogHeader>
                                                     <AlertDialogFooter>
                                                         <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                         <AlertDialogAction onClick={() => handleDelete(entry.id)}>Delete</AlertDialogAction>
                                                     </AlertDialogFooter>
                                                 </AlertDialogContent>
                                             </AlertDialog>
                                         </div>
                                    </CardFooter>
                                </Card>
                             );
                        })}
                    </div>
                </div>
            </Tabs>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                    <Button className="fixed bottom-12 right-12 z-50 shadow-lg rounded-full px-6" size="lg">
                        <IconMessageCirclePlus size={20} className="mr-2" /> Add {currentTab === 'diary' ? 'Entry' : currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Entry</DialogTitle>
                        <DialogDescription>Write down your thoughts.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Title (Optional)</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Brief title..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Content</Label>
                            <Textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="What's on your mind?"
                                className="h-32"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Category</Label>
                             <Select
                                value={formData.tags[0] || currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} // Default to current tab
                                onValueChange={(val) => setFormData({ ...formData, tags: [val] })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryTags.map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate}>Save Entry</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Entry</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Title (Optional)</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Content</Label>
                            <Textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="h-32"
                            />
                        </div>
                        <div className="grid gap-2">
                             <Label>Category</Label>
                             <Select
                                value={formData.tags[0] || "Diary"}
                                onValueChange={(val) => setFormData({ ...formData, tags: [val] })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryTags.map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                         <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate}>Update Entry</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
