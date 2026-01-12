
"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    IconAlertTriangle, 
    IconPoint, 
    IconInfoCircle, 
    IconEdit, 
    IconPlus 
} from "@tabler/icons-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";

// Constants for Categories
const CATEGORIES = {
    AGREEMENT: "AGREEMENT",
    WARNINGS: "WARNINGS",
    UNDERSTANDING: "UNDERSTANDING",
    MANAGING: "MANAGING"
};

interface AgreementItem {
    id: string;
    content: string;
    category: string;
}

const SECTION_CONFIG = {
    [CATEGORIES.AGREEMENT]: {
        title: "Agreement before proceeding",
        subtitle: (
            <span className="text-muted-foreground block font-normal text-base mt-1">
                Check the reality tasks, then go forward. Why you must go towards perseverance.{" "}
            </span>
        ),
        icon: null,
        renderItem: (item: AgreementItem, idx: number) => (
            <div key={item.id || idx} className="my-1 flex items-center justify-start space-x-2">
                <Checkbox id={`task-${idx}`}     />
                <label htmlFor={`task-${idx}`} className="text-sm">{item.content}</label>
            </div>
        )
    },
    [CATEGORIES.WARNINGS]: {
        title: "Warnings and Reality",
        subtitle: null,
        icon: null,
        renderItem: (item: AgreementItem, idx: number) => (
            <div key={item.id || idx} className="my-1 items-center space-x-2 flex">
                <IconAlertTriangle className="mr-2 text-red-600 animate-pulse shrink-0" size={16} />
                <span className="text-sm">{item.content}</span>
            </div>
        )
    },
    [CATEGORIES.UNDERSTANDING]: {
        title: "Samajh me aa rhi hain?",
        subtitle: <span className="text-muted-foreground block font-normal text-base">Major life tasks</span>,
        icon: null,
        renderItem: (item: AgreementItem, idx: number) => (
            <div key={item.id || idx} className="my-0.5 flex items-center">
                <IconPoint className="inline-flex mr-1 shrink-0" size={14} strokeWidth={2} /> 
                <span className="text-sm">{item.content}</span>
            </div>
        )
    },
    [CATEGORIES.MANAGING]: {
        title: "Things I am Managing",
        subtitle: <span className="text-muted-foreground block text-sm font-normal">Check these, if you still think you&apos;ve got time</span>,
        icon: null,
        renderItem: (item: AgreementItem, idx: number) => (
            <div key={item.id || idx} className="my-1 flex items-center space-x-2 px-0.5">
                <IconInfoCircle className="text-primary mr-2 shrink-0" size={14} />
                <span className="text-sm">{item.content}</span>
            </div>
        )
    }
}

function AgreementSection({ category, items, onUpdate }: { category: string, items: AgreementItem[], onUpdate: () => void }) {
    const config = SECTION_CONFIG[category];
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setText(items.map(i => i.content).join("\n"));
        }
    }, [open, items]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await axios.post("/api/agreement", {
                category,
                bulkText: text
            });
            if (res.status === 200) {
                toast.success("Updated successfully");
                onUpdate();
                setOpen(false);
            }
        } catch {
            toast.error("Failed to update");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-lg border p-4 h-full relative group bg-card">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger render={
                         <Button variant="outline"  >
                            <IconEdit size={16} /> Edit 
                        </Button>
                    } />
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Edit {config.title}</DialogTitle>
                            <DialogDescription>
                                Add items one per line.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-2">
                            <Textarea 
                                value={text} 
                                onChange={(e) => setText(e.target.value)} 
                                className="min-h-[300px] font-mono text-sm leading-relaxed"
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <h1 className="text-foreground mb-3 text-xl font-medium">
                {config.title}
                {config.subtitle}
            </h1>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
                    <p className="text-sm mb-2">No items yet</p>
                    <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                        <IconPlus size={14} className="mr-1" /> Add Items
                    </Button>
                </div>
            ) : (
                <div className="space-y-1">
                    {items.map((item, idx) => config.renderItem(item, idx))}
                </div>
            )}
        </div>
    );
}

function Masonry({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">{children}</div>;
}

export default function AgreementPage() {
    const { setPageMeta } = usePageMeta();
    const [items, setItems] = useState<AgreementItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await axios.get("/api/agreement");
            if (res.status === 200) {
                setItems(res.data);
            }
        } catch (e) {
            console.error("Failed to fetch agreements", e);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        setPageMeta({ title: "Agreement", subtitle: "Terms and Conditions" });
        fetchData();
    }, [setPageMeta]);

    const getItemsByCategory = (cat: string) => items.filter(i => i.category === cat);

    if (loading) return null; // Or a spinner

    return (
        <section className="flex h-full flex-wrap overflow-hidden rounded-lg   w-full">
             <Masonry>
                <AgreementSection 
                    category={CATEGORIES.AGREEMENT} 
                    items={getItemsByCategory(CATEGORIES.AGREEMENT)} 
                    onUpdate={fetchData} 
                />
                <AgreementSection 
                    category={CATEGORIES.WARNINGS} 
                    items={getItemsByCategory(CATEGORIES.WARNINGS)} 
                    onUpdate={fetchData} 
                />
                <AgreementSection 
                    category={CATEGORIES.UNDERSTANDING} 
                    items={getItemsByCategory(CATEGORIES.UNDERSTANDING)} 
                    onUpdate={fetchData} 
                />
                <AgreementSection 
                    category={CATEGORIES.MANAGING} 
                    items={getItemsByCategory(CATEGORIES.MANAGING)} 
                    onUpdate={fetchData} 
                />
            </Masonry>
        </section>
    );
}
