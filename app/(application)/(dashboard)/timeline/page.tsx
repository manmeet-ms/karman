
"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";

export default function TimelinePage() {
    return (
        <section className="p-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">Timeline <Badge>Entries 0/24</Badge></h2>
            <p className="text-muted-foreground">No entries today.</p>
        </section>
    );
}
