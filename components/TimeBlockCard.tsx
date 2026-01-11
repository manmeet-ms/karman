
"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IconProgressBolt, IconPlus, IconCopy } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TimeBlock {
  id: string;
  task: string;
  description: string;
  startTime: string;
  endTime: string;
  strict: boolean;
  completed: boolean;
}

export default function TimeBlockCard() {
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [bulkText, setBulkText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchBlocks = async () => {
    try {
      const res = await fetch("/api/timeblocks");
      if (res.ok) {
        const data = await res.json();
        setBlocks(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  // Monitoring Logic
  useEffect(() => {
    const checkActiveBlock = () => {
      const now = dayjs();
      const currentTime = now.format("HH:mm");

      const active = blocks.find((block) => {
        const start = block.startTime;
        const end = block.endTime;

        // Start Notification
        if (currentTime === start) {
          toast.info(`Block Started: ${block.task}`, {
            description: `${block.startTime} - ${block.endTime}. ${block.description || ''}`,
          });
        }

        // End Notification
        if (currentTime === end) {
          toast.info(`Block Ended: ${block.task}`, {
            description: "Block time is over.",
          });
        }

        return currentTime >= start && currentTime < end;
      });

      setActiveBlockId(active?.id || null);
    };

    checkActiveBlock();
    const interval = setInterval(checkActiveBlock, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, [blocks]);


  const handleComplete = async (id: string) => {
    const res = await fetch(`/api/timeblocks/${id}/complete`, {
      method: "POST",
    });
    if (res.ok) {
      // Optimistically update
      setBlocks(prev => prev.map(b => b.id === id ? { ...b, completed: true } : b));
      toast.success("Block Completed!");
      // Fetch to sync
      fetchBlocks();
    }
  };

  const handleBulkAdd = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/timeblocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulkText })
      });

      if (res.ok) {
        toast.success("Timeblocks created successfully");
        setBulkText("");
        setOpen(false);
        fetchBlocks();
      } else {
        toast.error("Failed to create blocks. Check format.");
      }
    } catch {
      toast.error("Error creating blocks");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          Timeblocks
          <span className="bg-primary/20 text-primary ml-2 rounded-full px-2 py-1 text-xs font-bold">
            {blocks.length}
          </span>
        </h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={
            <Button variant="outline" size="sm" className="gap-1">
              <IconPlus size={16} /> Bulk Add
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Bulk Add Timeblocks</DialogTitle>
              <DialogDescription>
               
                Format: // task, description, isStrict(true/false), start(HH:mm), end(HH:mm)
                <code className="text-xs bg-muted p-1 rounded">task, description, isStrict(true/false), start(HH:mm), end(HH:mm)</code><br /><br />

                <h4 className="text-sm mb-4 ">Copy this example:</h4>
                <div className=" flex justify-between items-center p-4 rounded-lg container w-full  bg-accent/40 mt-4 text-xs text-muted-foreground">
<code className="text-pretty" >
  Deep Work, Focus on coding, true, 09:00, 11:00<br />
  Lunch, Healthy meal, false, 12:00, 13:00<br />
  Meeting, Team sync, true, 14:00, 15:00<br />
  Exercise, Gym session, false, 17:30, 18:30<br />
  Review, Plan tomorrow, false, 21:00, 21:30<br />


</code>
<Button onClick={()=>(window.navigator.clipboard.writeText("Deep Work, Focus on coding, true, 09:00, 11:00\nLunch, Healthy meal, false, 12:00, 13:00\nMeeting, Team sync, true, 14:00, 15:00\nExercise, Gym session, false, 17:30, 18:30\nReview, Plan tomorrow, false, 21:00, 21:30"))} variant={"ghost"} ><IconCopy size={12} className="inline-flex"/></Button>
                </div>

              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="// Deep Work, Coding, true, 09:00, 11:00"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="h-[200px]"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleBulkAdd} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Blocks"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {blocks.some((b) => !b.completed && b.strict) && (
        <div className="mb-4 bg-red-800/20 p-4 rounded-lg border border-red-900/50">
          <h2 className="mb-1 text-lg font-bold text-red-500">Strict Mode Active</h2>
          <p className="text-sm text-red-400/80">Uncompleted strict tasks will trigger punishments.</p>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Block</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blocks.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                No blocks scheduled for today.
              </TableCell>
            </TableRow>
          )}
          {blocks.map((block) => {
            const isActive = block.id === activeBlockId;
            return (
              <TableRow key={block.id} className={cn(isActive ? "bg-muted/50" : "")}>
                <TableCell>
                  {!block.completed ? (
                    <span
                      className="cursor-pointer font-medium text-primary hover:underline"
                      onClick={() => handleComplete(block.id)}
                    >
                      Complete
                    </span>
                  ) : (
                    <span className="text-muted-foreground/40">
                      Completed
                    </span>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {block.startTime} - {block.endTime}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col justify-start items-start">
                    <span className="flex items-center gap-1 font-medium">
                      {block.task}
                      {block.strict && (
                        <IconProgressBolt className="inline size-4 bg-red-500/10 text-red-500 rounded-full p-0.5" />
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground/80 flex items-center mt-1">
                      {isActive ? (
                        <span className="mr-2 inline-flex relative h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      ) : (
                        <div className={cn(
                          "mr-2 size-2 rounded-full",
                          block.completed ? "bg-green-600/50" : "bg-red-500/30"
                        )} />
                      )}
                      <span className="truncate max-w-[200px] sm:max-w-xs">{block.description}</span>
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
