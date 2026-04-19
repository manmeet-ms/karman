"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePageMeta } from "@/contexts/PageMetaContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import {
    IconCrown,
    IconGitMerge,
    IconBrain,
    IconActivity,
    IconAward,
    IconBatteryCharging,
    IconBattery,
    IconCurrentLocation,
    IconTrash,
    IconRefresh,
    IconPlus,
    IconArrowUp,
    IconArrowUpRight,
    IconArrowDown
} from "@tabler/icons-react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import { toast } from "sonner";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSound } from "@/hooks/use-sound";

dayjs.extend(duration);
dayjs.extend(relativeTime);

interface TimerPill {
    name: string;
    description: string | null;
}

interface Timer {
    id: string;
    codename: string;
    title: string;
    description: string;
    timerStarted: string;
    failures: number;
    perks?: TimerPill[];
    punishments?: TimerPill[];
    alternates?: TimerPill[];
}

interface Rank {
    hours: number;
    name: string;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
    bgOpacity: string;
}

const rankDistribution: Rank[] = [
    {
        hours: 24 * 30,
        name: "🌿 Entering ਭੁਜੰਗੀ Era",
        icon: <IconCrown className={`-mt-1 mr-2 inline w-3 items-center text-rose-500`} strokeWidth={2.5} />,
        bgColor: "bg-pink-500 dark:bg-pink-600",
        textColor: "text-pink-800 dark:text-pink-400",
        bgOpacity: "bg-pink-400/10 border-pink-800/20"
    },
    {
        hours: 24 * 21,
        name: "Neurological transformation",
        icon: <IconGitMerge className={`-mt-1 mr-2 inline w-3 items-center text-purple-500`} strokeWidth={2.5} />,
        bgColor: "bg-purple-500 dark:bg-purple-600",
        textColor: "text-purple-800 dark:text-purple-400",
        bgOpacity: "bg-purple-400/10 border-purple-800/20"
    },
    {
        hours: 24 * 10,
        name: "Deep habit reformation",
        icon: <IconCurrentLocation className={`-mt-1 mr-2 inline w-3 items-center text-indigo-500`} strokeWidth={2.5} />,
        bgColor: "bg-indigo-500 dark:bg-indigo-600",
        textColor: "text-indigo-800 dark:text-indigo-400",
        bgOpacity: "bg-indigo-400/10 border-indigo-800/20"
    },
    {
        hours: 24 * 7,
        name: "Neural Recalibration",
        icon: <IconBrain className={`-mt-1 mr-2 inline w-3 items-center text-sky-500`} strokeWidth={2.25} />,
        bgColor: "bg-sky-500 dark:bg-sky-600",
        textColor: "text-sky-800 dark:text-sky-400",
        bgOpacity: "bg-sky-400/10 border-sky-800/20"
    },
    {
        hours: 24 * 5,
        name: "Establishing new patterns",
        icon: <IconActivity className={`-mt-1 mr-2 inline w-3 items-center text-teal-500`} strokeWidth={2.5} />,
        bgColor: "bg-teal-500 dark:bg-teal-600",
        textColor: "text-teal-800 dark:text-teal-400",
        bgOpacity: "bg-teal-400/10 border-teal-800/20"
    },
    {
        hours: 24 * 3,
        name: "Breaking through barriers",
        icon: <IconAward className={`-mt-1 mr-2 inline w-3 items-center text-green-500`} strokeWidth={2.25} />,
        bgColor: "bg-green-500 dark:bg-green-600",
        textColor: "text-green-800 dark:text-green-400",
        bgOpacity: "bg-green-400/10 border-green-800/20"
    },
    {
        hours: 24 * 2,
        name: "Short-Term Achieved",
        icon: <IconBatteryCharging className={`-mt-1 mr-2 inline w-3 items-center text-amber-500`} strokeWidth={2.5} />,
        bgColor: "bg-amber-500 dark:bg-amber-600",
        textColor: "text-amber-800 dark:text-amber-400",
        bgOpacity: "bg-amber-400/10 border-amber-800/20"
    },
    {
        hours: 24 * 1,
        name: "Full day commitment",
        icon: <IconBattery className={`-mt-1 mr-2 inline w-3 items-center text-yellow-500`} strokeWidth={2.5} />,
        bgColor: "bg-yellow-500 dark:bg-yellow-600",
        textColor: "text-yellow-800 dark:text-yellow-400",
        bgOpacity: "bg-yellow-400/10 border-yellow-800/20"
    },
    {
        hours: 0,
        name: "Detention / Reboot",
        icon: <IconActivity className={`-mt-1 mr-2 inline w-3 items-center text-slate-500`} strokeWidth={2.25} />,
        bgColor: "bg-slate-500 dark:bg-slate-600",
        textColor: "text-slate-800 dark:text-slate-400",
        bgOpacity: "bg-slate-400/10 border-slate-800/20"
    },
];

// Header Actions Component
function ChronosHeaderActions() {
    return (
        <Link href="/chronos/create">
            <Button>
                <IconPlus size={20} className="mr-2" /> New Timer
            </Button>
        </Link>
    );
}

export default function ChronosPage() {
    const { setPageMeta } = usePageMeta();
    const [timers, setTimers] = useState<Timer[]>([]);
    const [loading, setLoading] = useState(true);
    const [resetTimerId, setResetTimerId] = useState<string | null>(null);
    const { play } = useSound("/sounds/window_open.mp3");

    const fetchTimers = async () => {
        try {
            const res = await axios.get("/api/chronos");
            if (res.status === 200) {
                setTimers(res.data);
            }
        } catch {
            toast.error("Failed to fetch timers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPageMeta({ 
            title: "Chronos", 
            subtitle: "Time Management", 
            headerActions: <ChronosHeaderActions />
        });
        fetchTimers();
    }, [setPageMeta]);

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/chronos/${id}`);
            toast.success("Timer deleted");
            fetchTimers();
        } catch {
            toast.error("Failed to delete timer");
        }
    }

    const handleReset = async (id: string) => {
        try {
            await axios.put(`/api/chronos/${id}`, { action: "RESET" });
            toast.success("Timer reset! Points deducted.");
            play();
            setResetTimerId(null); // Close the modal
            fetchTimers();
        } catch {
            toast.error("Failed to reset timer");
        }
    }

    // Helper for Rank Calculation
    const getRank = (startDate: string): Rank & { idx: number } => {
        const now = dayjs();
        const start = dayjs(startDate);
        const hours = Math.floor(now.diff(start, 'hour', true)); // Float hours

        let rankIdx = rankDistribution.length - 1;
        for (let i = 0; i < rankDistribution.length; i++) {
            if (hours >= rankDistribution[i].hours) {
                rankIdx = i;
                break;
            }
        }
        return { idx: rankIdx, ...rankDistribution[rankIdx] };
    };

    // Helper for time string
    const getTimeString = (startDate: string) => {
        const now = dayjs();
        const start = dayjs(startDate);
        const diff = now.diff(start);
        const dur = dayjs.duration(diff);

        const h = Math.floor(dur.asHours()).toString().padStart(2, '0');
        const m = dur.minutes().toString().padStart(2, '0');
        const s = dur.seconds().toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    // Live update for timers
    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="grid grid-cols-1 md:grid-cols-3 gap-4  items-start">
            <section className="col-span-2 flex flex-col gap-4">
                    

                {loading ? <div className="text-muted-foreground p-8 text-center border rounded-lg">Loading timers...</div> :
                    timers.length === 0 ? (
                        <div className="text-muted-foreground p-8 text-center border rounded-lg bg-card">
                            No active timers. Create one to start tracking!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {timers.map((timer) => {
                                const rank = getRank(timer.timerStarted);
                                const timeStr = getTimeString(timer.timerStarted);

                                return (
                                    <div key={timer.id} className="bg-card/80 rounded-xl border px-4 py-6 relative group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h2 className="text-xs font-semibold text-primary uppercase flex items-center gap-2 mb-1">
                                                    {timer.codename}
                                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${rank.textColor} bg-opacity-20 border `} style={{ backgroundColor: rank.bgColor.includes('pink') ? 'rgba(236, 72, 153, 0.1)' : 'rgba(0,0,0,0.05)' /* Hacky approximation, better to use proper tailwind classes */ }}>
                                                        <span className={`border ${rank.bgOpacity} rounded px-1 flex items-center`}>
                                                            Rank #{rank.idx < 0 ? 0 : rank.idx} - {rank.name}
                                                        </span>
                                                    </span>
                                                </h2>
                                                <h1 className="text-xl font-medium text-foreground">{timer.title}</h1>
                                                <p className="text-sm text-muted-foreground line-clamp-1">{timer.description}</p>

                                                <section className="flex flex-wrap gap-1.5 py-2 text-sm mt-2">
                                                    {Array.isArray(timer.perks) && timer.perks.map((pill: TimerPill, idx: number) => (
                                                        <TooltipProvider key={`perk-${idx}`}>
                                                            <Tooltip>
                                                                <TooltipTrigger className="cursor-help rounded bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 font-semibold text-blue-600 dark:text-blue-400 text-xs flex items-center">
                                                                    <span>
                                                                        {pill.name}
                                                                        <IconArrowUp className="ml-1 inline-flex" size={12} stroke={2.5} />
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{pill.description || "No description"}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ))}

                                                    {Array.isArray(timer.alternates) && timer.alternates.map((pill: TimerPill, idx: number) => (
                                                        <TooltipProvider key={`alt-${idx}`}>
                                                            <Tooltip>
                                                                <TooltipTrigger className="cursor-help rounded bg-green-500/10 hover:bg-green-500/20 px-2 py-0.5 font-semibold text-green-600 dark:text-green-400 text-xs flex items-center">
                                                                    <span>
                                                                        {pill.name}
                                                                        <IconArrowUpRight className="ml-1 inline-flex" size={12} stroke={2.5} />
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{pill.description || "No description"}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ))}

                                                    {Array.isArray(timer.punishments) && timer.punishments.map((pill: TimerPill, idx: number) => (
                                                        <TooltipProvider key={`punish-${idx}`}>
                                                            <Tooltip>
                                                                <TooltipTrigger className="cursor-help rounded bg-red-500/10 hover:bg-red-500/20 px-2 py-0.5 font-semibold text-red-600 dark:text-red-400 text-xs flex items-center">
                                                                    <span>
                                                                        {pill.name}
                                                                        <IconArrowDown className="ml-1 inline-flex" size={12} stroke={2.5} />
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{pill.description || "No description"}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ))}
                                                </section>
                                            </div>
                                            <div className="text-right">
                                                <h2 className="text-2xl font-mono font-medium tracking-tight tabular-nums">{timeStr}</h2>
                                                <span className="text-xs text-muted-foreground">Started {dayjs(timer.timerStarted).fromNow()}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>Failures: <span className="text-red-500 font-semibold">{timer.failures}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <AlertDialog open={resetTimerId === timer.id} onOpenChange={(open) => setResetTimerId(open ? timer.id : null)}>
                                                    <AlertDialogTrigger className={buttonVariants({ variant: "ghost", size: "sm", className: "h-8 text-destructive hover:text-destructive hover:bg-destructive/10" })}>
                                                        <IconRefresh size={14} className="mr-1" /> Reset
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Reset Timer?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will reset your streak to zero and increment the failure count. Points will be deducted.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <Button onClick={() => handleReset(timer.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Confirm Reset</Button>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                <AlertDialog>
                                                    <AlertDialogTrigger className={buttonVariants({ variant: "ghost", size: "icon-sm", className: "h-8 w-8 text-muted-foreground hover:text-foreground" })}>
                                                        <IconTrash size={14} />
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Timer?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(timer.id)}>Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
            </section>
            <section>
                <div className="bg-card rounded-lg border p-4 sm:rounded-lg sticky top-6">
                    <div className="mb-2 flex flex-col gap-0 border-b pb-2">
                        <h2 className="flex items-center gap-2 text-xl font-semibold">
                            Ranks <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-bold">{rankDistribution.length}</span>
                        </h2>
                        <span className="text-muted-foreground text-xs"> Ranking table</span>
                    </div>
                    <Table>
                        <TableCaption className="text-xs">Get back to work</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60%]">Rank</TableHead>
                                <TableHead className="text-right">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rankDistribution.map((item, index) => (
                                <TableRow key={index} className="text-xs">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${item.bgColor}`}></div>
                                            {item.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {item.hours}H <span className="text-muted-foreground ml-1">({(item.hours / 24).toFixed(1)}D)</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </section>
        </main>
    );
}
