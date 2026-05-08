"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { IconTrash, IconEdit, IconPlus, IconQuote, IconUser } from "@tabler/icons-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { usePageMeta } from "@/contexts/PageMetaContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { GlobalPostType } from "@/generated/prisma/enums";

dayjs.extend(relativeTime);

interface GlobalPost {
    id: string;
    content: string;
    type: GlobalPostType;
    userId: string;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

interface AdviceHeaderActionsProps {
    activeTab: string;
    setActiveTab: (val: string) => void;
    setCreateType: (type: GlobalPostType) => void;
}

function AdviceHeaderActions({
    activeTab,
    setActiveTab,
    setCreateType,
}: AdviceHeaderActionsProps) {
    return (
        <div className="flex md:flex-row justify-between items-start md:items-center gap-2">
            <div className="flex items-center gap-2 w-full md:w-auto">
                <Button
                    variant={activeTab === "MINE" ? "default" : "outline"}
                    onClick={() => setActiveTab("MINE")}
                    className="gap-2"
                >
                    <IconUser size={16} />
                    My Advice
                </Button>
            </div>

            <Button className="gap-2 shrink-0" onClick={() => setCreateType("ADVICE")}>
                <IconPlus size={16} /> Share Wisdom
            </Button>
            <Button className="gap-2 shrink-0" onClick={() => setCreateType("QUOTE")}>
                <IconPlus size={16} /> Share Quote
            </Button>
            <Button className="gap-2 shrink-0" onClick={() => setCreateType("ACHIEVEMENT")}>
                <IconPlus size={16} /> Share Achievement
            </Button>
            <Button className="gap-2 shrink-0" onClick={() => setCreateType("TECHNIQUE")}>
                <IconPlus size={16} /> Share Technique
            </Button>
        </div>
    );
}

export default function AdvicePage() {
    const { setPageMeta } = usePageMeta();
    const [globalPosts, setGlobalPosts] = useState<GlobalPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ALL");

    // Create/Edit State
    const [createType, setCreateType] = useState<GlobalPostType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formContent, setFormContent] = useState("");
    const [editId, setEditId] = useState<string | null>(null);

    // Minimal session checking
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        // Fetch current user details for permissions
        axios.get("/api/me").then(res => setCurrentUserId(res.data.id)).catch(() => { });

        setPageMeta({
            title: "Global Community",
            subtitle: "Wisdom, quotes, achievements & techniques from the community.",
            headerActions: <AdviceHeaderActions
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setCreateType={setCreateType}
            />
        });
    }, [setPageMeta, activeTab]);

    const fetchPosts = React.useCallback(async () => {
        setLoading(true);
        try {
            let url = "/api/global";
            if (activeTab === "MINE") {
                url += "?mine=true";
            }

            const res = await axios.get(url);
            setGlobalPosts(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load posts");
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    const handleCreate = React.useCallback(async () => {
        if (!formContent) return toast.error("Content is required");
        setIsSubmitting(true);
        try {
            if (editId) {
                await axios.put(`/api/global/${editId}`, { content: formContent });
                toast.success("Post updated");
            } else {
                await axios.post("/api/global", { content: formContent, type: createType });
                toast.success("Shared successfully");
            }
            setFormContent("");
            setEditId(null);
            setCreateType(null);
            fetchPosts();
        } catch {
            toast.error(editId ? "Failed to update" : "Failed to create");
        } finally {
            setIsSubmitting(false);
        }
    }, [formContent, createType, editId, fetchPosts]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/global/${id}`);
            toast.success("Deleted successfully");
            setGlobalPosts(prev => prev.filter(a => a.id !== id));
        } catch {
            toast.error("Failed to delete");
        }
    };

    const openEdit = (post: GlobalPost) => {
        setFormContent(post.content);
        setCreateType(post.type);
        setEditId(post.id);
    };

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const renderList = (type: GlobalPostType) => {
        const list = globalPosts.filter((p) => p.type === type);
        if (loading) return <div className="text-center py-10 text-muted-foreground">Loading...</div>;
        if (list.length === 0) return <div className="text-center py-4 text-muted-foreground">No posts found. Be the first to share!</div>;
        return (
            <ScrollArea className="cursor-all-scroll h-full max-h-[225px] container w-full">
                <div className="flex flex-wrap gap-4">
                    {list.map((post) => (
                        <Sheet key={post.id}>
                            <SheetTrigger asChild>
                                <Card className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer p-3">
                                    <div className="flex-1">
                                        <p className="line-clamp-2 w-content max-w-64 leading-relaxed whitespace-pre-wrap text-foreground/90 font-medium text-sm">
                                            {post.content}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Avatar className="h-4 w-4">
                                            <AvatarImage src={post.user.image || ""} />
                                            <AvatarFallback>{post.user.name?.[0] || "?"}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-[10px] text-muted-foreground">{post.user.name || "Anonymous"}</span>
                                    </div>
                                </Card>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>
                                        <IconQuote className="text-primary/20 shrink-0 mb-2" size={32} />
                                        <div className="flex flex-wrap gap-1">
                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{post.type}</Badge>
                                        </div>
                                    </SheetTitle>
                                    <div className="pt-4 pb-4">
                                        <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
                                    </div>
                                    <SheetDescription className="pt-4 flex justify-between items-center border-t">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={post.user.image || ""} />
                                                <AvatarFallback>{post.user.name?.[0] || "?"}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium">{post.user.name || "Anonymous"}</span>
                                                <span className="text-[10px] text-muted-foreground">{dayjs(post.createdAt).fromNow()}</span>
                                            </div>
                                        </div>
                                        {(currentUserId && post.userId === currentUserId) && (
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(post)}>
                                                    <IconEdit size={14} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(post.id)}>
                                                    <IconTrash size={14} />
                                                </Button>
                                            </div>
                                        )}
                                    </SheetDescription>
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>
                    ))}
                </div>
            </ScrollArea>
        );
    };

    return (
        <div className="flex flex-col gap-6 w-full mx-auto pb-24">
            <div className="flex flex-col gap-4 px-4 md:px-0">
                <Dialog open={!!createType} onOpenChange={(open) => {
                    if (!open) {
                        setEditId(null);
                        setFormContent("");
                        setCreateType(null);
                    }
                }}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editId ? "Edit Post" : `Share ${createType}`}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Content</Label>
                                <Textarea
                                    value={formContent}
                                    onChange={e => setFormContent(e.target.value)}
                                    className="min-h-[150px]"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate} disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : (editId ? "Save Changes" : "Post")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <section>
                    <div className="container w-full mx-auto">
                        <div className="relative flex justify-center">
                            <div className="border-muted rounded-xl relative flex w-full flex-col border md:w-1/2 lg:w-full">
                                <div className="relative flex flex-col lg:flex-row">
                                    <div className="border-muted flex flex-col justify-between border-b border-solid p-6 lg:w-3/5 lg:border-r lg:border-b-0">
                                        <h2 className="text-xl font-medium">Advices</h2>
                                        <p className="text-muted-foreground/60 mb-4 text-sm">Advices from the community.</p>
                                        <div className="flex flex-wrap">
                                            <div className="space-y-4 w-full">
                                                {renderList("ADVICE")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between p-6 lg:w-2/5">
                                        <h2 className="text-xl font-medium">Quotes</h2>
                                        <p className="text-muted-foreground/60 mb-4 text-sm">Quotes from our community</p>
                                        <div className="flex flex-wrap container px-0">
                                            <div className="space-y-4 w-full">
                                                {renderList("QUOTE")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-muted relative flex flex-col border-t border-solid lg:flex-row">
                                    <div className="border-muted flex flex-col justify-between border-b border-solid p-6 lg:w-2/5 lg:border-r lg:border-b-0">
                                        <h2 className="text-xl font-medium">Achievements</h2>
                                        <p className="text-muted-foreground/60 mb-4 text-sm">Grateful moments to get you driving.</p>
                                        <div className="flex flex-wrap w-full">
                                            <div className="space-y-4 w-full">
                                                {renderList("ACHIEVEMENT")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between p-6 lg:w-3/5">
                                        <h2 className="text-xl font-medium">Techniques</h2>
                                        <p className="text-muted-foreground/60 mb-4 text-sm">Techniques from the community.</p>
                                        <div className="flex flex-wrap w-full">
                                            <div className="space-y-4 w-full">
                                                {renderList("TECHNIQUE")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}