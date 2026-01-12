"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePageMeta } from "@/contexts/PageMetaContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconArrowLeft } from "@tabler/icons-react";
import axios from "axios";
import { toast } from "sonner";
import { TagInput } from "@/components/ui/tag-input";

export default function CreateTimerPage() {
    const router = useRouter();
    const { setPageMeta } = usePageMeta();
    
    // Form State
    const [formData, setFormData] = useState({ 
        codename: "", 
        title: "", 
        description: "",
    });
    
    // Tag States
    const [perks, setPerks] = useState<string[]>([]);
    const [alternates, setAlternates] = useState<string[]>([]);
    const [punishments, setPunishments] = useState<string[]>([]);

    React.useEffect(() => {
        setPageMeta({ title: "New Chronos Timer", subtitle: "Create a new time tracker" });
    }, [setPageMeta]);

    const handleCreate = async () => {
        try {
            if (!formData.title || !formData.codename) {
                toast.error("Please fill in at least Codename and Title");
                return;
            }

            const payload = {
                ...formData,
                perks: perks.map(name => ({ name, description: null })),
                alternates: alternates.map(name => ({ name, description: null })),
                punishments: punishments.map(name => ({ name, description: null }))
            };

            const res = await axios.post("/api/chronos", payload);
            
            if (res.status === 200 || res.status === 201) {
                toast.success("Timer created successfully");
                router.push("/chronos");
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to create timer");
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all" onClick={() => router.back()}>
                <IconArrowLeft className="mr-2" size={18} /> Back to Timers
            </Button>
            
            <div className="space-y-8 bg-card border rounded-xl p-8 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Timer</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Set up a new habit tracking timer with customizable rules.</p>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Codename</Label>
                            <Input 
                                placeholder="e.g. MONKMODE" 
                                value={formData.codename} 
                                onChange={(e) => setFormData({...formData, codename: e.target.value})} 
                                className="font-mono uppercase"
                            />
                            <p className="text-[10px] text-muted-foreground">Short, punchy identifier.</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input 
                                placeholder="e.g. Dopamine Detox" 
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                            placeholder="What is this timer tracking? What are the rules?" 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                            className="h-24"
                        />
                    </div>

                    <div className="space-y-6 pt-4 border-t">
                        <div className="space-y-3">
                            <Label className="text-blue-600 dark:text-blue-400 font-medium">Perks / Benefits</Label>
                            <TagInput 
                                placeholder="Type and press comma or enter..." 
                                tags={perks} 
                                setTags={setPerks}
                                colorClass="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                            />
                            <p className="text-[10px] text-muted-foreground">What do you gain by keeping this streak?</p>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-green-600 dark:text-green-400 font-medium">Allowed Alternatives</Label>
                            <TagInput 
                                placeholder="Type and press comma..." 
                                tags={alternates} 
                                setTags={setAlternates}
                                colorClass="bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                            />
                             <p className="text-[10px] text-muted-foreground">Healthy substitutes for the bad habit.</p>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-red-600 dark:text-red-400 font-medium">Punishments</Label>
                            <TagInput 
                                placeholder="Type and press comma..." 
                                tags={punishments} 
                                setTags={setPunishments}
                                colorClass="bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                            />
                             <p className="text-[10px] text-muted-foreground">Consequences for breaking the streak.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleCreate}>Create Timer</Button>
                </div>
            </div>
        </div>
    );
}
