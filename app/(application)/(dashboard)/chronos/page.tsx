
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";

const rankDistribution = [
    { hours: 720, name: "🌿 Entering ਭੁਜੰਗੀ Era" },
    { hours: 0, name: "Detention" }
];

export default function ChronosPage() {
    const [timers, setTimers] = useState<any[]>([]);
    return (
        <main className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4 space-y-4 px-4 py-6">
            <section className="col-span-2 flex flex-col gap-4">
                {timers.length > 0 ? <div>Timers List</div> : <Button>Initialize timers</Button>}
            </section>
            <section>
                <div className="bg-card rounded-lg border p-4 sm:rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Ranks</h2>
                    <Table>
                        <TableCaption>Get back to work</TableCaption>
                        <TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>Time</TableHead></TableRow></TableHeader>
                        <TableBody>
                             {rankDistribution.map((item, index) => (
                                <TableRow key={index}><TableCell>{item.name}</TableCell><TableCell>{item.hours}H</TableCell></TableRow>
                             ))}
                        </TableBody>
                    </Table>
                </div>
            </section>
        </main>
    );
}
