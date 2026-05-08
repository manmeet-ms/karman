
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import dayjs from "dayjs";

export function RecentViolations({ violations, totalCount, setViolations }: { violations: any[], totalCount: number, setViolations: any }) {
  const [reasonMap, setReasonMap] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const handleStateReason = async (id: string) => {
      const reason = reasonMap[id];
      if (!reason) return toast.error("Please enter a reason");
      
      setSubmittingId(id);
      try {
          await axios.put(`/api/violations/${id}`, { reason });
          toast.success("Reason recorded");
          
          setViolations((prev: any[]) => prev.map(v => 
              v.id === id ? { ...v, reason, resolved: true } : v
          ));
      } catch {
          toast.error("Failed to record reason");
      } finally {
          setSubmittingId(null);
      }
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Recent Violations
                <span className="bg-primary/20 text-primary ml-2 rounded-full px-2 py-1 text-xs font-bold">
                    {totalCount}
                </span> 
            </CardTitle>
        </CardHeader>
        <CardContent>
            {violations.length === 0 ? (
                <p className="text-muted-foreground">No violations logged.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Violation Type</TableHead>
                            <TableHead>Time / Source</TableHead>
                            <TableHead>State Reason</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {violations.map((v) => (
                            <TableRow key={v.id}>
                                <TableCell>
                                    <Badge variant="destructive">{v.type}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{dayjs(v.timestamp).format("DD MMM HH:mm")}</span>
                                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                            {v.blockData?.task || v.tauntStatement || "System Action"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {v.resolved ? (
                                        <span className="text-sm text-muted-foreground italic truncate max-w-[150px] inline-block">
                                            {v.reason || "Resolved"}
                                        </span>
                                    ) : (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">State Reason</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>State Your Reason</DialogTitle>
                                                </DialogHeader>
                                                <Textarea 
                                                    placeholder="Why did this violation happen?"
                                                    value={reasonMap[v.id] || ""}
                                                    onChange={e => setReasonMap(prev => ({ ...prev, [v.id]: e.target.value }))}
                                                />
                                                <DialogFooter>
                                                    <Button 
                                                        onClick={() => handleStateReason(v.id)} 
                                                        disabled={submittingId === v.id}
                                                    >
                                                        {submittingId === v.id ? "Saving..." : "Save"}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
    </Card>
  );
}
