'use client'
import UrgeInputForm from "@/components/Forms/UrgeInputForm";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { usePageMeta } from "@/contexts/PageMetaContext";
import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import { ChartBarInteractive } from "@/components/chart-bar-interactive"; // Assuming this handles the props
import { Separator } from "@/components/ui/separator";

dayjs.extend(relativeTime);

// Header Actions Component
interface UrgesHeaderActionsProps {
    setIsCreateOpen: (open: boolean) => void;
}

function UrgesHeaderActions({ setIsCreateOpen }: UrgesHeaderActionsProps) {
    return (
        <Button onClick={() => setIsCreateOpen(true)}>
            <IconPlus size={20} className="mr-2" /> Log Urge
        </Button>
    );
}

export default function UrgesPage() {
    const { setPageMeta } = usePageMeta();
    const [urges, setUrges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

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
        setPageMeta({ 
            title: "Urges", 
            subtitle: "Impulse recognition and control mechanisms",
            headerActions: <UrgesHeaderActions setIsCreateOpen={setIsCreateOpen} />
        });
        fetchUrges();
    }, [setPageMeta]);

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
                     const typeLower = u.urgeType.toLowerCase();
                     let pillBg = "bg-zinc-300/60 text-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300";
                     if (typeLower === 'procrastination') pillBg = "bg-yellow-300/60 text-yellow-800 dark:bg-yellow-800/40 dark:text-yellow-300";
                     if (typeLower === 'distraction') pillBg = "bg-blue-300/60 text-blue-800 dark:bg-blue-800/40 dark:text-blue-300";
                     if (typeLower === 'doomscroll') pillBg = "bg-rose-300/60 text-rose-800 dark:bg-rose-800/40 dark:text-rose-300";
                     if (typeLower === 'browsing') pillBg = "bg-indigo-300/60 text-indigo-800 dark:bg-indigo-800/40 dark:text-indigo-300";
                     if (typeLower === 'addiction') pillBg = "bg-red-300/60 text-red-800 dark:bg-red-800/40 dark:text-red-300";

                     return (
                        <Card key={u.id} className="break-inside-avoid mb-4">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {dayjs(u.urgeTimeStamp).format("DD/MM/YYYY HH:mm:ss")}
                                </CardTitle>
                                <CardDescription className="text-xs flex items-center gap-1 opacity-70">
                                     {u.urgeTrigger && (
                                         <span className="capitalize">{u.urgeTrigger.toLowerCase().replace(/_/g, " ")}</span>
                                     )}
                                    <span className="mx-1">•</span>
                                    <span>{dayjs(u.urgeTimeStamp).fromNow()}</span>
                                </CardDescription>
                            </CardHeader>
                            {u.urgeNotes && (
                                <CardContent className="text-sm line-clamp-2 text-pretty mb-2">
                                    {u.urgeNotes}
                                </CardContent>
                            )}
                            <CardFooter className="flex items-center justify-between text-xs pt-0">
                                 <span className={`${pillBg} inline-flex rounded px-1.5 py-0.5 tracking-wide capitalize`}>
                                     {typeLower}
                                 </span>
                                 <span className="flex font-medium">Intensity: {u.urgeIntensity}</span>
                            </CardFooter>
                        </Card>
                     )
                })}
             </div>

           
             <UrgeInputForm open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={fetchUrges} />
        </div>
    );
}
