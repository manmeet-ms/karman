
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { IconTrash, IconPlus, IconClock } from "@tabler/icons-react";
import { usePageMeta } from "@/contexts/PageMetaContext";

interface Reminder {
    id: string;
    title: string;
    type: string;
    interval: number;
    enabled: boolean;
}

// Header Actions Component
interface RemindersHeaderActionsProps {
    setOpen: (open: boolean) => void;
}

function RemindersHeaderActions({ setOpen }: RemindersHeaderActionsProps) {
    return (
        <Button className="gap-2" onClick={() => setOpen(true)}>
            <IconPlus size={16} /> New Reminder
        </Button>
    );
}

export default function RemindersPage() {
    const { setPageMeta } = usePageMeta();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);

    // New Reminder State
    const [open, setOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newInterval, setNewInterval] = useState(60);

    // Edit State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editInterval, setEditInterval] = useState(0);

    const fetchReminders = async () => {
        try {
            const res = await axios.get("/api/reminders");
            setReminders(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load reminders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPageMeta({
            title: "Reminders",
            subtitle: "Manage your automated notifications and checks.",
            headerActions: <RemindersHeaderActions setOpen={setOpen} />
        });
        fetchReminders();
    }, [setPageMeta]);

    const handleToggle = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !currentStatus } : r));
        
        try {
            await axios.put(`/api/reminders/${id}`, { enabled: !currentStatus });
        } catch {
            toast.error("Failed to update status");
            // Revert
            setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: currentStatus } : r));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this reminder?")) return;
        
        try {
            await axios.delete(`/api/reminders/${id}`);
            setReminders(prev => prev.filter(r => r.id !== id));
            toast.success("Reminder deleted");
        } catch {
            toast.error("Failed to delete reminder");
        }
    };

    const handleSaveNew = async () => {
        if (!newTitle || newInterval < 1) {
            toast.error("Invalid input");
            return;
        }
        
        try {
            await axios.post("/api/reminders", {
                title: newTitle,
                interval: newInterval
            });
            toast.success("Reminder created");
            setOpen(false);
            setNewTitle("");
            setNewInterval(60);
            fetchReminders();
        } catch {
            toast.error("Failed to create reminder");
        }
    };

    const startEditing = (r: Reminder) => {
        setEditingId(r.id);
        setEditInterval(r.interval);
    }

    const saveEdit = async (id: string) => {
        try {
            await axios.put(`/api/reminders/${id}`, { interval: editInterval });
            setReminders(prev => prev.map(r => r.id === id ? { ...r, interval: editInterval } : r));
            setEditingId(null);
            toast.success("Interval updated");
        } catch {
            toast.error("Failed to update interval");
        }
    }

    if (loading) return <div className="p-8">Loading reminders...</div>;

    return (
        <div className="flex flex-col gap-4 w-full  ">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Custom Reminder</DialogTitle>
                        <DialogDescription>Add a new recurring reminder.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Title</Label>
                            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Stretch" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Interval (minutes)</Label>
                            <Input 
                                type="number" 
                                min={1} 
                                value={newInterval} 
                                onChange={(e) => setNewInterval(parseInt(e.target.value))} 
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveNew}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            

            <div className="grid grid-cols-3 gap-4">
                {reminders.map((r) => (
                    <Card key={r.id}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-lg">{r.title}</span>
                                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase">{r.type}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <IconClock size={14} />
                                    {editingId === r.id ? (
                                        <div className="flex items-center gap-2">
                                            <Input 
                                                className="h-6 w-20" 
                                                type="number" 
                                                value={editInterval} 
                                                onChange={(e) => setEditInterval(parseInt(e.target.value))} 
                                            />
                                            <Button size="sm" variant="ghost" className="h-6" onClick={() => saveEdit(r.id)}>Save</Button>
                                            <Button size="sm" variant="ghost" className="h-6" onClick={() => setEditingId(null)}>Cancel</Button>
                                        </div>
                                    ) : (
                                        <span onClick={() => startEditing(r)} className="cursor-pointer hover:underline underline-offset-4 decoration-dashed" title="Click to edit interval">
                                            Every {r.interval} minutes
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor={`switch-${r.id}`} className="text-sm text-muted-foreground">
                                        {r.enabled ? "On" : "Off"}
                                    </Label>
                                    <Switch 
                                        id={`switch-${r.id}`}
                                        checked={r.enabled}
                                        onCheckedChange={(c) => handleToggle(r.id, r.enabled)}
                                    />
                                </div>
                                <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(r.id)}>
                                    <IconTrash size={18} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
