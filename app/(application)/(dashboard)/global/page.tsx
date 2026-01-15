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
import { AdviceTag } from "@/generated/prisma/enums";
import { ComingSoon } from "@/components/ComingSoon";

dayjs.extend(relativeTime);

interface Advice {
    id: string;
    content: string;
    tags: AdviceTag[];
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
    setIsCreateOpen: (open: boolean) => void;
}

function AdviceHeaderActions({
    activeTab,
    setActiveTab,
    setIsCreateOpen,
}: AdviceHeaderActionsProps) {
    return (
        <div className="flex md:flex-row justify-between items-start md:items-center gap-2">
            <div className="flex items-center gap-2 w-full md:w-auto">
                {/* <Select
                    value={activeTab === "MINE" ? "" : activeTab}
                    onValueChange={(val) => setActiveTab(val || "ALL")}
                >
                    <SelectTrigger className="w-[180px] bg-background">
                        <SelectValue>
                            {activeTab === "MINE" ? "My Advice" : undefined}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Topics</SelectItem>
                        <SelectItem value="CORPORATE">Corporate</SelectItem>
                        <SelectItem value="PERSONAL">Personal</SelectItem>
                        <SelectItem value="PSYCHOLOGICAL">Psychological</SelectItem>
                        <SelectItem value="MANIPULATIVE">Manipulative</SelectItem>
                    </SelectContent>
                </Select> */}

                <Button
                    variant={activeTab === "MINE" ? "default" : "outline"}
                    onClick={() => setActiveTab("MINE")}
                    className="gap-2"
                >
                    <IconUser size={16} />
                    My Advice
                </Button>
            </div>

            <Button className="gap-2 shrink-0" onClick={() => setIsCreateOpen(true)}>
                <IconPlus size={16} /> Share Wisdom
            </Button>
            <Button className="gap-2 shrink-0" onClick={() => setIsCreateOpen(true)}>
                <IconPlus size={16} /> Share Quote
            </Button>
            <Button className="gap-2 shrink-0" onClick={() => setIsCreateOpen(true)}>
                <IconPlus size={16} /> Share Achievement
            </Button>
            <Button className="gap-2 shrink-0" onClick={() => setIsCreateOpen(true)}>
                <IconPlus size={16} /> Share Technique
            </Button>
        </div>
    );
}

export default function AdvicePage() {
    const { setPageMeta } = usePageMeta();
    const [adviceList, setAdviceList] = useState<Advice[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ALL");

    // Create/Edit State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formContent, setFormContent] = useState("");
    const [formTags, setFormTags] = useState<AdviceTag[]>([]);
    const [editId, setEditId] = useState<string | null>(null);

    // Minimal session checking
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        // Fetch current user details for permissions
        axios.get("/api/me").then(res => setCurrentUserId(res.data.id)).catch(() => { });

        setPageMeta({
            title: "Global Advice",
            subtitle: "Wisdom from the community.",
            headerActions: <AdviceHeaderActions
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsCreateOpen={setIsCreateOpen}
            />
        });
    }, [setPageMeta, activeTab]);

    const fetchAdvice = React.useCallback(async () => {
        setLoading(true);
        try {
            let url = "/api/advice";
            if (activeTab === "MINE") {
                url += "?mine=true";
            } else if (activeTab !== "ALL") {
                url += `?tag=${activeTab}`;
            }

            const res = await axios.get(url);
            setAdviceList(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load advice");
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    const handleCreate = React.useCallback(async () => {
        if (!formContent) return toast.error("Content is required");
        setIsSubmitting(true);
        try {
            if (editId) {
                await axios.put(`/api/advice/${editId}`, { content: formContent, tags: formTags });
                toast.success("Advice updated");
            } else {
                await axios.post("/api/advice", { content: formContent, tags: formTags });
                toast.success("Advice shared");
            }
            setFormContent("");
            setFormTags([]);
            setEditId(null);
            setIsCreateOpen(false);
            fetchAdvice();
        } catch {
            toast.error(editId ? "Failed to update" : "Failed to create");
        } finally {
            setIsSubmitting(false);
        }
    }, [formContent, formTags, editId, fetchAdvice]);

    const toggleTag = React.useCallback((tag: AdviceTag) => {
        if (formTags.includes(tag)) {
            setFormTags(prev => prev.filter(t => t !== tag));
        } else {
            setFormTags(prev => [...prev, tag]);
        }
    }, [formTags]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/advice/${id}`);
            toast.success("Deleted successfully");
            setAdviceList(prev => prev.filter(a => a.id !== id));
        } catch {
            toast.error("Failed to delete");
        }
    };

    const openEdit = (advice: Advice) => {
        setFormContent(advice.content);
        setFormTags(advice.tags);
        setEditId(advice.id);
        setIsCreateOpen(true);
    };

    useEffect(() => {
        fetchAdvice();
    }, [fetchAdvice]);

    return (
        <div className="flex flex-col gap-6 w-full mx-auto pb-24">
            <div className="flex flex-col gap-4 px-4 md:px-0">
                <Dialog open={isCreateOpen} onOpenChange={(open) => {
                    if (!open) {
                        setEditId(null);
                        setFormContent("");
                        setFormTags([]);
                    }
                    setIsCreateOpen(open);
                }}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editId ? "Edit Advice" : "Share Advice"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Content</Label>
                                <Textarea
                                    value={formContent}
                                    onChange={e => setFormContent(e.target.value)}
                                    // placeholder="Share your insight..."
                                    className="min-h-[150px]"
                                />
                            </div>
                            {/* <div className="grid gap-2">
                                <Label>Tags</Label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(AdviceTag).map(tag => (
                                        <div key={tag} className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-muted" onClick={() => toggleTag(tag)}>
                                            <Checkbox checked={formTags.includes(tag)} id={`tag-${tag}`} />
                                            <label htmlFor={`tag-${tag}`} className="text-xs font-medium cursor-pointer">{tag}</label>
                                        </div>
                                    ))}
                                </div>
                            </div> */}
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate} disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : (editId ? "Save Changes" : "Post")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <section className={cn("")}>
                    <div className="container w-full mx-auto">
                        {/* <div className="mb-24 flex flex-col items-center gap-6">
                    <h1 className="text-center text-3xl font-medium lg:max-w-3xl lg:text-5xl">
                        {title}
                    </h1>
                    <p className="text-center text-lg font-medium text-muted-foreground md:max-w-4xl lg:text-xl">
                        {description}
                    </p>
                </div> */}
                        <div className="relative flex justify-center">
                            <div className="border-muted rounded-xl relative flex w-full flex-col border md:w-1/2 lg:w-full">
                                <div className="relative flex flex-col lg:flex-row">
                                    <div className="border-muted flex flex-col justify-between border-b border-solid p-6 lg:w-3/5 lg:border-r lg:border-b-0">
                                        <h2 className="text-xl font-medium">{"Advices"}</h2>
                                        <p className="text-muted-foreground/60 mb-4 text-sm">{"Advices from the community."}</p>
                                        <div className="flex flex-wrap">
                                            <div className="space-y-4">
                                                {loading ? (
                                                    <div className="text-center py-10 text-muted-foreground">Loading...</div>
                                                ) : adviceList.length === 0 ? (
                                                    <div className="text-center py-4 text-muted-foreground">No advice found in this category. Be the first to share!</div>
                                                ) : (
                                                    <ComingSoon/> // <ScrollArea className="cursor-all-scroll h-full max-h-[225px]  container w-full ">
                                                    //     <div className="flex flex-wrap gap-4">
                                                    //         {adviceList.map((advice) => (
                                                    //             <Sheet key={advice.id}>
                                                    //                 <SheetTrigger>
                                                    //                     <Card className="flex flex-col h-full hover:shadow-md transition-shadow">

                                                    //                         <CardContent className="flex-1  ">
                                                    //                             <p className=" line-clamp-2 w-content max-w-64 leading-relaxed whitespace-pre-wrap text-foreground/90 font-medium">
                                                    //                                 {advice.content}
                                                    //                             </p>
                                                    //                         </CardContent>

                                                    //                     </Card>

                                                    //                 </SheetTrigger>
                                                    //                 <SheetContent>
                                                    //                     <SheetHeader>
                                                    //                         <SheetTitle> <IconQuote className="text-primary/20 shrink-0" size={32} />
                                                    //                             <div className="flex flex-wrap gap-1  ">
                                                    //                                 {advice.tags.map((tag, idx) => (
                                                    //                                     <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                                                    //                                 ))}
                                                    //                             </div></SheetTitle>
                                                    //                         <SheetDescription className="pt-0 flex justify-between items-center border-t   ">

                                                    //                             <div className="flex items-center gap-2">
                                                    //                                 <Avatar className="h-6 w-6">
                                                    //                                     <AvatarImage src={advice.user.image || ""} />
                                                    //                                     <AvatarFallback>{advice.user.name?.[0] || "?"}</AvatarFallback>
                                                    //                                 </Avatar>
                                                    //                                 <div className="flex flex-col">
                                                    //                                     <span className="text-xs font-medium">{advice.user.name || "Anonymous"}</span>
                                                    //                                     <span className="text-[10px] text-muted-foreground">{dayjs(advice.createdAt).fromNow()}</span>
                                                    //                                 </div>
                                                    //                             </div>

                                                    //                             {(currentUserId && advice.userId === currentUserId) && (
                                                    //                                 <div className="flex gap-1">
                                                    //                                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(advice)}>
                                                    //                                         <IconEdit size={14} />
                                                    //                                     </Button>
                                                    //                                     <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(advice.id)}>
                                                    //                                         <IconTrash size={14} />
                                                    //                                     </Button>
                                                    //                                 </div>
                                                    //                             )}

                                                    //                         </SheetDescription>
                                                    //                     </SheetHeader>
                                                    //                 </SheetContent>
                                                    //             </Sheet>

                                                    //         ))}
                                                    //     </div>
                                                    // </ScrollArea>
                                                )}
                                            </div>
                                        </div>
                                        {/* <img
                                    src={"feature1.image"}
                                    alt={"feature1.title"}
                                    className="mt-8 aspect-[1.5] h-full w-full object-cover lg:aspect-[2.4]"
                                /> */}
                                    </div>
                                    <div className="flex flex-col justify-between p-6 lg:w-2/5">
                                        <h2 className="text-xl font-medium">{"Quotes"}</h2>
                                        <p className="text-muted-foreground/60 mb-4 text-sm">{"Quotes from our community"}</p>
                                        <div className="flex flex-wrap container">
                                            <div className="space-y-4">
                                                {loading ? (
                                                    <div className="text-center py-10 text-muted-foreground">Loading...</div>
                                                ) : adviceList.length === 0 ? (
                                                    <div className="text-center py-4 text-muted-foreground">No advice found in this category. Be the first to share!</div>
                                                ) : (
                                                    <ComingSoon/> // <ScrollArea className="cursor-all-scroll h-full max-h-[225px]     ">
                                                    //     <div className="flex flex-col gap-4">
                                                    //         {adviceList.map((advice) => (
                                                    //             <Sheet key={advice.id}>
                                                    //                 <SheetTrigger>
                                                    //                     <Card


                                                    //                         className="  p-3 transition-colors hover:bg-muted/70"
                                                    //                     >
                                                    //                         <div >
                                                    //                             <p className="mb-1 line-clamp-2 font-semibold text-foreground">
                                                    //                                 {"feature feature feature feature feature  feature  feature.title"}
                                                    //                             </p>
                                                    //                             <p className="text-sm  line-clamp-2 text-muted-foreground">
                                                    //                                 {"feature feature feature feature feature  feature  feature.description"}
                                                    //                             </p>
                                                    //                         </div>
                                                    //                     </Card>
                                                    //                 </SheetTrigger>
                                                    //                 <SheetContent>
                                                    //                     <SheetHeader>
                                                    //                         <SheetTitle> <IconQuote className="text-primary/20 shrink-0" size={32} />
                                                    //                             <div className="flex flex-wrap gap-1  ">
                                                    //                                 {advice.tags.map((tag, idx) => (
                                                    //                                     <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                                                    //                                 ))}
                                                    //                             </div></SheetTitle>
                                                    //                         <SheetDescription className="pt-0 flex justify-between items-center border-t   ">

                                                    //                             <div className="flex items-center gap-2">
                                                    //                                 <Avatar className="h-6 w-6">
                                                    //                                     <AvatarImage src={advice.user.image || ""} />
                                                    //                                     <AvatarFallback>{advice.user.name?.[0] || "?"}</AvatarFallback>
                                                    //                                 </Avatar>
                                                    //                                 <div className="flex flex-col">
                                                    //                                     <span className="text-xs font-medium">{advice.user.name || "Anonymous"}</span>
                                                    //                                     <span className="text-[10px] text-muted-foreground">{dayjs(advice.createdAt).fromNow()}</span>
                                                    //                                 </div>
                                                    //                             </div>

                                                    //                             {(currentUserId && advice.userId === currentUserId) && (
                                                    //                                 <div className="flex gap-1">
                                                    //                                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(advice)}>
                                                    //                                         <IconEdit size={14} />
                                                    //                                     </Button>
                                                    //                                     <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(advice.id)}>
                                                    //                                         <IconTrash size={14} />
                                                    //                                     </Button>
                                                    //                                 </div>
                                                    //                             )}

                                                    //                         </SheetDescription>
                                                    //                     </SheetHeader>
                                                    //                 </SheetContent>
                                                    //             </Sheet>

                                                    //         ))}
                                                    //     </div>
                                                    // </ScrollArea>
                                                )}
                                            </div>
                                        </div>
                                        {/* <img
                                    src={"feature2.image"}
                                    alt={"feature2.title"}
                                    className="mt-8 aspect-[1.45] h-full w-full object-cover"
                                /> */}
                                    </div>
                                </div>
                                <div className="border-muted relative flex flex-col border-t border-solid lg:flex-row">
                                    <div className="border-muted flex flex-col justify-between border-b border-solid p-6 lg:w-2/5 lg:border-r lg:border-b-0">
                                        <h2 className="text-xl font-medium">{"Achievements"}</h2>
                                        <p className="text-muted-foreground/60 mb-4 text-sm">{"Grateful moments to get you driving."}</p>
                                        <div className="flex flex-wrap">
                                            <div className="space-y-4">
                                                {loading ? (
                                                    <div className="text-center py-10 text-muted-foreground">Loading...</div>
                                                ) : adviceList.length === 0 ? (
                                                    <div className="text-center py-4 text-muted-foreground">No advice found in this category. Be the first to share!</div>
                                                ) : (
                                                    <ComingSoon/> // <ScrollArea className="cursor-all-scroll h-full max-h-[225px]  container w-full ">
                                                    //     <div className="flex flex-wrap gap-4">
                                                    //         {adviceList.map((advice) => (
                                                    //             <Sheet key={advice.id}>
                                                    //                 <SheetTrigger>
                                                    //                     <Card className="flex flex-col h-full hover:shadow-md transition-shadow">

                                                    //                         <CardContent className="flex-1  ">
                                                    //                             <p className=" line-clamp-2 w-content max-w-64 leading-relaxed whitespace-pre-wrap text-foreground/90 font-medium">
                                                    //                                 {advice.content}
                                                    //                             </p>
                                                    //                         </CardContent>

                                                    //                     </Card>

                                                    //                 </SheetTrigger>
                                                    //                 <SheetContent>
                                                    //                     <SheetHeader>
                                                    //                         <SheetTitle> <IconQuote className="text-primary/20 shrink-0" size={32} />
                                                    //                             <div className="flex flex-wrap gap-1  ">
                                                    //                                 {advice.tags.map((tag, idx) => (
                                                    //                                     <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                                                    //                                 ))}
                                                    //                             </div></SheetTitle>
                                                    //                         <SheetDescription className="pt-0 flex justify-between items-center border-t   ">

                                                    //                             <div className="flex items-center gap-2">
                                                    //                                 <Avatar className="h-6 w-6">
                                                    //                                     <AvatarImage src={advice.user.image || ""} />
                                                    //                                     <AvatarFallback>{advice.user.name?.[0] || "?"}</AvatarFallback>
                                                    //                                 </Avatar>
                                                    //                                 <div className="flex flex-col">
                                                    //                                     <span className="text-xs font-medium">{advice.user.name || "Anonymous"}</span>
                                                    //                                     <span className="text-[10px] text-muted-foreground">{dayjs(advice.createdAt).fromNow()}</span>
                                                    //                                 </div>
                                                    //                             </div>

                                                    //                             {(currentUserId && advice.userId === currentUserId) && (
                                                    //                                 <div className="flex gap-1">
                                                    //                                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(advice)}>
                                                    //                                         <IconEdit size={14} />
                                                    //                                     </Button>
                                                    //                                     <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(advice.id)}>
                                                    //                                         <IconTrash size={14} />
                                                    //                                     </Button>
                                                    //                                 </div>
                                                    //                             )}

                                                    //                         </SheetDescription>
                                                    //                     </SheetHeader>
                                                    //                 </SheetContent>
                                                    //             </Sheet>

                                                    //         ))}
                                                    //     </div>
                                                    // </ScrollArea>
                                                )}
                                            </div>
                                        </div>
                                        {/* <img
                                    src={"feature3.image"}
                                    alt={"feature3.title"}
                                    className="mt-8 aspect-[1.45] h-full w-full object-cover"
                                /> */}
                                    </div>
                                    <div className="flex flex-col justify-between p-6 lg:w-3/5">
                                        <h2 className="text-xl font-medium">{"Techniques"}</h2>
                                        <p className="text-muted-foreground/60 mb-4 text-sm">{"Techniques from the community."}</p>
                                        <div className="flex flex-wrap">
                                            <div className="space-y-4">
                                                {loading ? (
                                                    <div className="text-center py-10 text-muted-foreground">Loading...</div>
                                                ) : adviceList.length === 0 ? (
                                                    <div className="text-center py-4 text-muted-foreground">No advice found in this category. Be the first to share!</div>
                                                ) : (
                                                    <ComingSoon/> // <ScrollArea className="cursor-all-scroll h-full max-h-[225px]  container w-full ">
                                                    //     <div className="flex flex-wrap gap-4">
                                                    //         {adviceList.map((advice) => (
                                                    //             <Sheet key={advice.id}>
                                                    //                 <SheetTrigger>
                                                    //                     <Card className="flex flex-col h-full hover:shadow-md transition-shadow">

                                                    //                         <CardContent className="flex-1  ">
                                                    //                             <p className=" line-clamp-2 w-content max-w-64 leading-relaxed whitespace-pre-wrap text-foreground/90 font-medium">
                                                    //                                 {advice.content}
                                                    //                             </p>
                                                    //                         </CardContent>

                                                    //                     </Card>

                                                    //                 </SheetTrigger>
                                                    //                 <SheetContent>
                                                    //                     <SheetHeader>
                                                    //                         <SheetTitle> <IconQuote className="text-primary/20 shrink-0" size={32} />
                                                    //                             <div className="flex flex-wrap gap-1  ">
                                                    //                                 {advice.tags.map((tag, idx) => (
                                                    //                                     <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                                                    //                                 ))}
                                                    //                             </div></SheetTitle>
                                                    //                         <SheetDescription className="pt-0 flex justify-between items-center border-t   ">

                                                    //                             <div className="flex items-center gap-2">
                                                    //                                 <Avatar className="h-6 w-6">
                                                    //                                     <AvatarImage src={advice.user.image || ""} />
                                                    //                                     <AvatarFallback>{advice.user.name?.[0] || "?"}</AvatarFallback>
                                                    //                                 </Avatar>
                                                    //                                 <div className="flex flex-col">
                                                    //                                     <span className="text-xs font-medium">{advice.user.name || "Anonymous"}</span>
                                                    //                                     <span className="text-[10px] text-muted-foreground">{dayjs(advice.createdAt).fromNow()}</span>
                                                    //                                 </div>
                                                    //                             </div>

                                                    //                             {(currentUserId && advice.userId === currentUserId) && (
                                                    //                                 <div className="flex gap-1">
                                                    //                                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(advice)}>
                                                    //                                         <IconEdit size={14} />
                                                    //                                     </Button>
                                                    //                                     <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(advice.id)}>
                                                    //                                         <IconTrash size={14} />
                                                    //                                     </Button>
                                                    //                                 </div>
                                                    //                             )}

                                                    //                         </SheetDescription>
                                                    //                     </SheetHeader>
                                                    //                 </SheetContent>
                                                    //             </Sheet>

                                                    //         ))}
                                                    //     </div>
                                                    // </ScrollArea>
                                                )}
                                            </div>
                                        </div>
                                        {/* <img
                                    src={"feature4.image"}
                                    alt={"feature4.title"}
                                    className="mt-8 aspect-[1.5] h-full w-full object-cover lg:aspect-[2.4]"
                                /> */}
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
