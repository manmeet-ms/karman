
"use client";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { usePageMeta } from "@/contexts/PageMetaContext";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LeaderboardPage() {
  const { setPageMeta } = usePageMeta();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
      setPageMeta({ title: "Leaderboard", subtitle: "Hall of Fame" });
      
      const fetchData = async () => {
          try {
              const res = await fetch("/api/leaderboard");
              if (res.ok) {
                  const data = await res.json();
                  setLeaderboard(data);
              }
          } catch (e) {
              console.error("Failed to fetch leaderboard", e);
          } finally {
              setLoading(false);
          }
      };
      
      fetchData();
  }, [setPageMeta]);

  return (
    <section className="grid grid-cols-1 items-start gap-2 md:gap-4 md:grid-cols-3 px-4 py-6">
      <div className="rounded-lg col-span-2 border p-4 bg-card">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
              Hall of Fame <Badge variant="secondary">Top {leaderboard.length}</Badge>
        </h2>
        <ScrollArea className="h-[calc(100vh-200px)]">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Credits</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">Loading...</TableCell>
                    </TableRow>
                ) : leaderboard.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">No Data</TableCell>
                    </TableRow>
                ) : (
                    leaderboard.map((user, idx) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                {idx + 1 === 1 ? "🥇" : idx + 1 === 2 ? "🥈" : idx + 1 === 3 ? "🥉" : `#${idx + 1}`}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.image} alt={user.name || "User"} />
                                        <AvatarFallback>{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{user.name || "Anonymous"}</span>
                                        <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-mono font-bold text-primary">
                                {user.points}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
            </Table>
        </ScrollArea>
      </div>
      <div className="border rounded-lg p-4 bg-card h-full">
         <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
         <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="text-sm text-muted-foreground text-center py-8">
                Global activity feed coming soon.
            </div>
         </ScrollArea>
      </div>
    </section>
  );
}
