"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { usePageMeta } from "@/contexts/PageMetaContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IconInfoCircle, IconPencil, IconPlus, IconWashDryShade } from "@tabler/icons-react";
import { toast } from "sonner";

dayjs.extend(relativeTime);

// Header Actions Component
interface TimelineHeaderActionsProps {
    setIsCreateOpen: (open: boolean) => void;
}

interface MoodData {
    moodType: string;
    intensity: number;
    trigger: string;
    location: string;
    physicalState: string;
    notes: string;
}

interface CheckinEntry {
    id: string;
    note: string;
    tag: string;
    createdAt: string;
    entryDate: string;
    mood?: MoodData;
}

interface CheckinFormData {
    note: string;
    tag: string;
    mood: MoodData;
}

interface CheckinFormProps {
    formData: CheckinFormData;
    setFormData: (data: CheckinFormData) => void;
    tags: string[];
    moods: string[];
    onSubmit: () => void;
    submitLabel: string;
}

function TimelineHeaderActions({ setIsCreateOpen }: TimelineHeaderActionsProps) {
    return (
        <Button onClick={() => setIsCreateOpen(true)}>
            <IconPlus size={20} className="mr-2" /> Check-In
        </Button>
    );
}

export default function TimelinePage() {
    const { setPageMeta } = usePageMeta();
    const [checkins, setCheckins] = useState<CheckinEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingCheckin, setEditingCheckin] = useState<CheckinEntry | null>(null);

    // Form State
    const [formData, setFormData] = useState<CheckinFormData>({
        note: "",
        tag: "",
        mood: {
            moodType: "",
            intensity: 5,
            trigger: "",
            location: "",
            physicalState: "",
            notes: ""
        }
    });

    const tags = ["Work", "Study", "Social", "Exercise", "Rest"];
    const moods = ["Happy", "Anxious", "Angry", "Stressed", "Sad", "Neutral", "Excited"];

    const fetchCheckins = async () => {
        try {
            const res = await axios.get("/api/timeline");
            setCheckins(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch timeline");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPageMeta({ 
            title: "Timeline", 
            subtitle: "Chronological timeline tracking for the day.",
            headerActions: <TimelineHeaderActions setIsCreateOpen={setIsCreateOpen} />
        });
        fetchCheckins();
    }, [setPageMeta]);

    const resetForm = () => {
        setFormData({
            note: "",
            tag: "",
            mood: {
                moodType: "",
                intensity: 5,
                trigger: "",
                location: "",
                physicalState: "",
                notes: ""
            }
        });
    }

    const handleCreate = async () => {
        try {
            if (!formData.note) {
                toast.error("Please enter a note");
                return;
            }
            await axios.post("/api/timeline", {
                note: formData.note,
                tag: formData.tag || "Rest",
                entryDate: dayjs().format("YYYY-MM-DD"),
                mood: formData.mood.moodType ? formData.mood : undefined
            });
            toast.success("Check-in logged!");
            setIsCreateOpen(false);
            resetForm();
            fetchCheckins();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create check-in");
        }
    };

    const handleUpdate = async () => {
        if (!editingCheckin) return;
        try {
            await axios.put(`/api/timeline/${editingCheckin.id}`, {
                note: formData.note,
                tag: formData.tag,
                entryDate: editingCheckin.entryDate,
                mood: formData.mood.moodType ? formData.mood : undefined
            });
            toast.success("Check-in updated!");
            setIsEditOpen(false);
            setEditingCheckin(null);
            resetForm();
            fetchCheckins();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update check-in");
        }
    };

    const openEdit = (checkin: CheckinEntry) => {
        setEditingCheckin(checkin);
        setFormData({
            note: checkin.note,
            tag: checkin.tag,
            mood: checkin.mood ? {
                moodType: checkin.mood.moodType,
                intensity: checkin.mood.intensity,
                trigger: checkin.mood.trigger || "",
                location: checkin.mood.location || "",
                physicalState: checkin.mood.physicalState || "",
                notes: checkin.mood.notes || ""
            } : {
                moodType: "",
                intensity: 5,
                trigger: "",
                location: "",
                physicalState: "",
                notes: ""
            }
        });
        setIsEditOpen(true);
    };

    return (
        <section className="p-4 max-w-4xl mx-auto">
            {/* <div className="mb-4 border-b flex flex-col gap-0 pb-4">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                    Timeline
                    <Badge variant="outline" className="gap-1">
                        <IconWashDryShade size={14} />
                        Entries {checkins.length}
                    </Badge>
                </h2>
                <span className="text-muted-foreground text-xs">Chronological timeline tracking for the day.</span>
            </div> */}

            <div className="space-y-0">
                {checkins.map((checkin) => (
                    <div key={checkin.id} className="flex gap-x-3 group">
                        <div className="min-w-14 text-end">
                            <span className="text-xs text-muted-foreground">{dayjs(checkin.createdAt).format("hh:mm a")}</span>
                        </div>

                        <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-border">
                            <div className="relative size-7 flex justify-center items-center">
                                <div className="size-2 rounded-full bg-muted-foreground"></div>
                            </div>
                        </div>

                        <div className="grow pt-0.5 pb-8">
                            <div className="flex justify-between items-start">
                                <h3 className="flex gap-x-1.5 font-semibold text-foreground text-sm">{checkin.note}</h3>
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mt-1" onClick={() => openEdit(checkin)}>
                                    <IconPencil size={12} />
                                </Button>
                            </div>
                            
                            <div className="mt-1 text-sm text-muted-foreground flex flex-wrap gap-1 items-center">
                                <Badge variant="secondary" className="text-[10px] h-5">{checkin.tag}</Badge>
                                {checkin.mood && (
                                    <Dialog>
                                        <DialogTrigger>
                                            <Badge variant="outline" className="mx-0.5 bg-accent/50 text-primary cursor-pointer hover:bg-accent text-[10px] h-5 gap-1">
                                                <IconInfoCircle size={10} /> {checkin.mood.moodType} | {checkin.mood.intensity}
                                            </Badge>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Mood Tracker Details</DialogTitle>
                                                <DialogDescription>Recorded at {dayjs(checkin.createdAt).format("hh:mm a")}</DialogDescription>
                                            </DialogHeader>
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Trigger</TableCell>
                                                        <TableCell>{checkin.mood.trigger || "-"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Location</TableCell>
                                                        <TableCell>{checkin.mood.location || "-"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Physical State</TableCell>
                                                        <TableCell>{checkin.mood.physicalState || "-"}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Notes</TableCell>
                                                        <TableCell>{checkin.mood.notes || "-"}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {checkins.length === 0 && !loading && (
                    <div className="text-center text-muted-foreground py-12">No check-ins yet today.</div>
                )}
            </div>

            
           

             {/* Create Dialog */}
             <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Hourly Check-in</DialogTitle>
                        <DialogDescription>What are you doing right now?</DialogDescription>
                    </DialogHeader>
                    {/* Reusing Form Logic could be a component, but keeping inline for simplicity in this context */}
                    <CheckinForm formData={formData} setFormData={setFormData} tags={tags} moods={moods} onSubmit={handleCreate} submitLabel="Submit Check-in" />
                </DialogContent>
            </Dialog>

             {/* Edit Dialog */}
             <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit check-in</DialogTitle>
                    </DialogHeader>
                    <CheckinForm formData={formData} setFormData={setFormData} tags={tags} moods={moods} onSubmit={handleUpdate} submitLabel="Update Check-in" />
                </DialogContent>
            </Dialog>
        </section>
    );
}

// Helper Component for the Form to avoid duplication
function CheckinForm({ formData, setFormData, tags, moods, onSubmit, submitLabel }: CheckinFormProps) {
    return (
        <div className="flex flex-col gap-4 py-2">
            <div className="grid gap-2">
                <Label>Activity Note</Label>
                <Textarea
                    placeholder="What did you do this hour?"
                    className="h-24"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                />
            </div>
            <div className="grid gap-2">
                <Label>Category</Label>
                <Select
                    value={formData.tag}
                    onValueChange={(val) => {
                        if (val) setFormData({ ...formData, tag: val })
                    }}
                >
                    <SelectTrigger>
                        <SelectValue 
                        // placeholder="Select category" 
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {tags.map((tag: string) => (
                            <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2 border-t pt-4">
                <Label className="text-muted-foreground font-semibold">Mood Tracking (Optional)</Label>
            </div>

            <div className="grid gap-2">
                <Label>Mood</Label>
                <Select
                    value={formData.mood.moodType}
                    onValueChange={(val) => {
                        if (val) setFormData({ ...formData, mood: { ...formData.mood, moodType: val } })
                    }}
                >
                    <SelectTrigger>
                        <SelectValue 
                        // placeholder="Select mood" 
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {moods.map((m: string) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {formData.mood.moodType && (
                <>
                    <div className="grid gap-2">
                        <Label>Intensity (1-10)</Label>
                        <RadioGroup
                            value={formData.mood.intensity.toString()}
                            onValueChange={(val) => setFormData({ ...formData, mood: { ...formData.mood, intensity: parseInt(val as string) } })}
                            className="flex flex-wrap gap-2"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                                <div key={val} className="flex items-center space-x-1">
                                    <RadioGroupItem value={val.toString()} id={`r-${val}`} />
                                    <Label htmlFor={`r-${val}`} className="font-normal text-xs">{val}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label>Trigger</Label>
                            <Input
                                value={formData.mood.trigger}
                                onChange={(e) => setFormData({ ...formData, mood: { ...formData.mood, trigger: e.target.value } })}
                                placeholder="e.g. Work"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Location</Label>
                            <Input
                                value={formData.mood.location}
                                onChange={(e) => setFormData({ ...formData, mood: { ...formData.mood, location: e.target.value } })}
                                placeholder="e.g. Home"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label>Physical State</Label>
                        <Input
                            value={formData.mood.physicalState}
                            onChange={(e) => setFormData({ ...formData, mood: { ...formData.mood, physicalState: e.target.value } })}
                            placeholder="e.g. Tired"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>Mood Notes</Label>
                        <Textarea
                            value={formData.mood.notes}
                            onChange={(e) => setFormData({ ...formData, mood: { ...formData.mood, notes: e.target.value } })}
                            placeholder="Additional context..."
                            className="h-16"
                        />
                    </div>
                </>
            )}
             <DialogFooter>
                {/* Cancel is handled by parent dialog close usually, but we can add a close button if passed */}
                <Button onClick={onSubmit}>{submitLabel}</Button>
            </DialogFooter>
        </div>
    );
}
