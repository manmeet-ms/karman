
"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface UrgeInputFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function UrgeInputForm({ open, onOpenChange, onSuccess }: UrgeInputFormProps) {
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

    const handleCreate = async () => {
        try {
            await axios.post("/api/urges", formData);
            toast.success("Urge logged.");
            onOpenChange(false);
            setFormData({
                urgeIntensity: 5,
                urgeType: "OTHER",
                urgeTrigger: "BOREDOM",
                urgeLocation: "WORKSPACE",
                urgeNotes: "",
                urgeResolved: false
            });
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Failed to log urge");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                            onValueChange={(val) => setFormData({ ...formData, urgeIntensity: parseInt(val as string) })}
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
                                onValueChange={(val) => {
                                    if(val) setFormData({ ...formData, urgeType: val })
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue 
                                    // placeholder="Type" 
                                    />
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
                                onValueChange={(val) => {
                                    if(val) setFormData({ ...formData, urgeTrigger: val })
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue 
                                    // placeholder="Trigger" 
                                    />
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
                                onValueChange={(val) => {
                                    if(val) setFormData({ ...formData, urgeLocation: val })
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue 
                                    // placeholder="Location" 
                                    />
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
                            
                            // placeholder="Describe the urge..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleCreate} variant="destructive">Log Urge</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
