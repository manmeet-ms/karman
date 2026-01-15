
"use client";
"use client";
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { usePageMeta } from "@/contexts/PageMetaContext";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { IconAccessPoint, IconBolt, IconBoltFilled } from "@tabler/icons-react";
import dayjs from "dayjs";

export default function LeaderboardPage() {
  const { setPageMeta } = usePageMeta();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
      setPageMeta({ title: "Leaderboard", subtitle: "Hall of Fame" ,headerActions:null});
      
      const fetchData = async () => {
          try {
              const res = await axios.get("/api/leaderboard");
              if (res.status === 200) {
                  setLeaderboard(res.data);
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
    <section className="grid grid-cols-1 items-start gap-2 md:gap-4 md:grid-cols-3  ">
      <div className="rounded-lg col-span-2 border p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="mb-2 flex flex-col gap-0 pb-2">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              Hall of Fame
              <Badge>
                <IconBolt size={14} className="mr-1" />
                Top {leaderboard.length}{" "}
              </Badge>
            </h2>
            <span className="text-secondary-foreground/60 text-xs"> Leaderboard</span>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead> Credits</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">Loading...</TableCell>
                </TableRow>
            ) : leaderboard.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">No Data</TableCell>
                </TableRow>
            ) : (
                leaderboard.map((user, idx) => {
                    let topUserIcon;
                    const shiftPosition = "";
                    switch (idx) {
                      case 0: // Gold
                        topUserIcon = (
                          <span className="ml-2 px-2 py-1 inline-flex items-center justify-center rounded-full bg-yellow-400/20 text-yellow-500">
                            <IconBolt size={14} stroke={2.5} />
                          </span>
                        );
                        break;
                      case 1: // Silver
                        topUserIcon = (
                          <span className="ml-2 px-2 py-1 inline-flex items-center justify-center rounded-full bg-gray-400/20 text-gray-400">
                            <IconBolt size={14} stroke={2.5} />
                          </span>
                        );
                        break;
                      case 2: // Bronze
                        topUserIcon = (
                          <span className="ml-2 px-2 py-1 inline-flex items-center justify-center rounded-full bg-amber-700/20 text-amber-700">
                            <IconBolt size={14} stroke={2.5} />
                          </span>
                        );
                        break;
                      default:
                        topUserIcon = null;
                        break;
                    }

                    return (
                        <TableRow key={user.id}>
                            <TableCell>{idx + 1}.</TableCell>
                            <TableCell className="flex items-center justify-start gap-2">
                                <Avatar>
                                    <AvatarImage src={user.image} />
                                    <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                {user.name}
                            </TableCell>
                            <TableCell className={shiftPosition}>
                                {user.points}
                                {topUserIcon}
                            </TableCell>
                            <TableCell>{dayjs(user.createdAt).format("DD MMM, YYYY")}</TableCell>
                        </TableRow>
                    );
                })
            )}
          </TableBody>
        </Table>
        </ScrollArea>
      </div>
      <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
        <div className="rounded-lg border p-4 bg-primary/5 border-primary/20">
             <div className="mb-2 flex flex-col gap-0 pb-2">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                Community
                </h2>
                <span className="text-secondary-foreground/60 text-xs"> Join the movement</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
                Where we track account and announcement public pressure for performing, join the community, weekly leaderboard, rewards in the form of points.
            </p>
            <Button className="w-full" onClick={() => window.open("https://discord.gg/placeholder", "_blank")}>
                Join Discord
            </Button>
        </div>

        <div className="rounded-lg border p-4">

            <div className="mb-2 flex flex-col gap-0 pb-2">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
                Points activity
                <Badge variant="secondary">
                <IconAccessPoint size={14} className="mr-1" />
                Live
                </Badge>
            </h2>
            <span className="text-secondary-foreground/60 text-xs"> Coming Soon</span>
            </div>

            <ScrollArea className="h-[400px] border rounded-md ">
            <div className="p-4">
                <div className="text-sm text-muted-foreground text-center py-8">
                    Global activity feed coming soon.
                </div>
            </div>
            </ScrollArea>
        </div>
      </div>
    </section>
  );
}
