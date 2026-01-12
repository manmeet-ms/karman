"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { IconPlus, IconTallymark1 } from "@tabler/icons-react";
import { toast } from "sonner";
import { ChartBarInteractive } from "@/components/chart-bar-interactive"; // Assuming this handles the props
import { Separator } from "@/components/ui/separator";

dayjs.extend(relativeTime);

export default function UrgesPage() {
    const { setPageMeta } = usePageMeta();
    const [urges, setUrges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        urgeIntensity: 5,
        urgeType: "OTHER",
        urgeTrigger: "BOREDOM",
        urgeLocation: "WORKSPACE",
        urgeNotes: "",
        urgeResolved: false
    });

    const urgeTypes = ["PROCRASTINATION", "DISTRACTION", "DOOMSCROLL", "BROWSING", "ADDICTION", "OTHER"];
    const urgeTriggers = ["BOREDOM", "STRESS", "ANXIETY", "HABITUAL_TIME", "SOCIAL_MEDIA_NOTIFICATION", "BEING_ALONE", "SEEING_OTHERS_ONLINE", "AVOIDING_HARD_TASK", "TIREDNESS", "MINDLESS_ROUTINE", "DOPAMINE_CRAVING", "OVERWHELMED", "NO_CLEAR_GOAL", "PEER_INFLUENCE", "SEEKING_COMFORT"];
    const urgeLocations = ["BEDROOM", "WORKSPACE", "LIBRARY", "COLLEGE", "COMMUTE", "LIVING_ROOM", "ALONE", "IN_PUBLIC"];

    const fetchUrges = async () => {
        try {
            const res = await axios.get("/api/urges");
            setUrges(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch urges");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPageMeta({ title: "Urges", subtitle: "Impulse recognition and control mechanisms" });
        fetchUrges();
    }, [setPageMeta]);

    const handleCreate = async () => {
        try {
            await axios.post("/api/urges", formData);
            toast.success("Urge logged.");
            setIsCreateOpen(false);
            setFormData({
                urgeIntensity: 5,
                urgeType: "OTHER",
                urgeTrigger: "BOREDOM",
                urgeLocation: "WORKSPACE",
                urgeNotes: "",
                urgeResolved: false
            });
            fetchUrges();
        } catch (error) {
            console.error(error);
            toast.error("Failed to log urge");
        }
    };

    const stats = useMemo(() => {
        if (!urges.length) return { avgIntensity: 0, count: 0 };
        const totalIntensity = urges.reduce((acc, curr) => acc + curr.urgeIntensity, 0);
        return {
            avgIntensity: (totalIntensity / urges.length).toFixed(1),
            count: urges.length
        };
    }, [urges]);

    return (
        <div className="flex flex-col gap-4 p-4">
             <div className="grid items-center justify-center gap-4 sm:grid-cols-1 lg:grid-cols-4">
                <div className="col-span-3">
                     <ChartBarInteractive urges={urges} />
                </div>
                <Card>
                    <CardHeader />
                    <CardContent>
                        <div className="flex flex-col gap-4">
                             <div className="flex flex-col gap-1">
                                <p className="text-4xl font-medium sm:text-5xl">{stats.count}</p>
                                <p className="text-muted-foreground">Total Urges</p>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <p className="text-4xl font-medium sm:text-5xl">{stats.avgIntensity}</p>
                                <p className="text-muted-foreground">Avg Intensity</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
             </div>

             <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
                {urges.map((u, index) => {
                     let pillBg = "bg-zinc-300/60 text-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300";
                     const type = u.urgeType.toLowerCase();
                     if (type === 'procrastination') pillBg = "bg-yellow-300/60 text-yellow-800 dark:bg-yellow-800/40 dark:text-yellow-300";
                     if (type === 'distraction') pillBg = "bg-blue-300/60 text-blue-800 dark:bg-blue-800/40 dark:text-blue-300";
                     if (type === 'doomscroll') pillBg = "bg-rose-300/60 text-rose-800 dark:bg-rose-800/40 dark:text-rose-300";
                     if (type === 'addiction') pillBg = "bg-red-300/60 text-red-800 dark:bg-red-800/40 dark:text-red-300";

                     return (
                        <Card key={u.id} className="break-inside-avoid mb-4">
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    {dayjs(u.urgeTimeStamp).format("DD/MM/YYYY HH:mm")}
                                </CardTitle>
                                <CardDescription className="text-xs capitalize flex items-center gap-1">
                                    {u.urgeTrigger?.toLowerCase().replace(/_/g, " ")}
                                    <span className="text-muted-foreground ml-auto">{dayjs(u.urgeTimeStamp).fromNow()}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm">
                                {u.urgeNotes && <p className="mb-2 line-clamp-3">{u.urgeNotes}</p>}
                                <div className="flex items-center justify-between text-xs mt-2">
                                     <span className={`${pillBg} px-2 py-0.5 rounded capitalize`}>{type}</span>
                                     <span className="font-bold">Intensity: {u.urgeIntensity}</span>
                                </div>
                            </CardContent>
                        </Card>
                     )
                })}
             </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                    <Button className="fixed bottom-12 right-12 z-50 shadow-lg rounded-full px-6" size="lg">
                        <IconPlus size={20} className="mr-2" /> Log Urge
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Log Urge</DialogTitle>
                        <DialogDescription>Track and analyze your impulses.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                         <div className="grid gap-2">
                            <Label>Intensity (1-10)</Label>
                            <RadioGroup
                                value={formData.urgeIntensity.toString()}
                                onValueChange={(val) => setFormData({ ...formData, urgeIntensity: parseInt(val) })}
                                className="flex flex-wrap gap-2"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                                    <div key={val} className="flex items-center space-x-1">
                                        <RadioGroupItem value={val.toString()} id={`u-${val}`} />
                                        <Label htmlFor={`u-${val}`} className="font-normal text-xs">{val}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Type</Label>
                                <Select
                                    value={formData.urgeType}
                                    onValueChange={(val) => setFormData({ ...formData, urgeType: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {urgeTypes.map(t => (
                                            <SelectItem key={t} value={t}>{t.toLowerCase()}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Resolved?</Label>
                                <div className="flex items-center space-x-2 pt-3">
                                    <Checkbox
                                        id="resolved"
                                        checked={formData.urgeResolved}
                                        onCheckedChange={(c) => setFormData({ ...formData, urgeResolved: !!c })}
                                    />
                                    <label htmlFor="resolved" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Yes, I resisted
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Trigger</Label>
                                <Select
                                    value={formData.urgeTrigger}
                                    onValueChange={(val) => setFormData({ ...formData, urgeTrigger: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Trigger" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {urgeTriggers.map(t => (
                                            <SelectItem key={t} value={t}>{t.toLowerCase().replace(/_/g, " ")}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Location</Label>
                                <Select
                                    value={formData.urgeLocation}
                                    onValueChange={(val) => setFormData({ ...formData, urgeLocation: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {urgeLocations.map(t => (
                                            <SelectItem key={t} value={t}>{t.toLowerCase().replace(/_/g, " ")}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Notes (Optional)</Label>
                            <Textarea
                                value={formData.urgeNotes}
                                onChange={(e) => setFormData({ ...formData, urgeNotes: e.target.value })}
                                placeholder="Describe the urge..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} variant="destructive">Log Urge</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
