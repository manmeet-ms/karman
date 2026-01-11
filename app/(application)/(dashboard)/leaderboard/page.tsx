
"use client";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { usePageMeta } from "@/contexts/PageMetaContext";

export default function LeaderboardPage() {
  const { setPageMeta } = usePageMeta();
  React.useEffect(() => {
      setPageMeta({ title: "Leaderboard", subtitle: "Hall of Fame" });
  }, []);
  const [violations, setViolations] = useState<any[]>([]);
  return (
    <section className="grid grid-cols-1 items-start gap-2 md:gap-4 md:grid-cols-3 px-4 py-6">
      <div className="rounded-lg col-span-2 border p-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
              Hall of Fame <Badge>Top {violations.length}</Badge>
        </h2>
        <Table>
          <TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>User</TableHead><TableHead>Credits</TableHead></TableRow></TableHeader>
          <TableBody><TableRow><TableCell colSpan={3}>No Data</TableCell></TableRow></TableBody>
        </Table>
      </div>
      <ScrollArea className="h-screen p-4 border rounded-md">
        <h2 className="text-xl font-semibold">Points Activity</h2>
      </ScrollArea>
    </section>
  );
}
