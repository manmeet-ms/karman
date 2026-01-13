"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner";
import { IconCheck, IconPlus } from "@tabler/icons-react";

interface Props {
  onComplete?: () => void;
  currentRitual?: any;
}

export default function RitualInputForm({ onComplete, currentRitual }: Props) {
  const [open, setOpen] = useState(false);
  const [vow, setVow] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
      if (currentRitual) {
          setVow(currentRitual.vow);
      }
  }, [currentRitual]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
        // Always usage POST for setting/updating vow for now (assuming serv-side upsert or we just use it for setting)
        // If we need explicit update, we should implement PUT with action="update" in api
        // For now, let's use POST as "Set/Upsert"
        await axios.post("/api/rituals", { vow });
        toast.success("Vow set for today!");
        
        setOpen(false);
        // Don't clear vow if it's an edit, but maybe nice to reset if we want fresh state? 
        // But if we are editing, we probably want it to persist until re-open re-sets it.
        // setVow(""); 
        if (onComplete) onComplete();
    } catch (error) {
      console.error("Failed to update ritual", error);
      toast.error("Failed to update ritual.");
    } finally {
      setLoading(false);
    }
  };

  if (currentRitual?.completedDailyCheckIn) {
      // Allow editing even if completed, or just show normal form?
      // User said "only in this place set vow button should appear".
      // We will remove the "Ritual Completed" return.
  }

  // Check if we are editing an existing ritual (vow) vs creating new
  const isUpdate = !!currentRitual;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant={"outline"} className="gap-2">
            <IconPlus size={16} className={isUpdate ? "text-primary" : "text-muted-foreground"} /> 
            {isUpdate ? "Edit Vow" : "Set Vow"}
        </Button>}>
        
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? "Edit Vow" : "Set Intention"}</DialogTitle>
          <DialogDescription>
            {isUpdate ? "Update your vow for today." : "What is your vow or intention for today?"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label>Vow / Intention</Label>
                <Input 
                    value={vow} 
                    onChange={(e) => setVow(e.target.value)} 
                    placeholder="I vow to focus on..." 
                />
            </div>
        </div>

        <DialogFooter>
            <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Processing..." : (isUpdate ? "Update Vow" : "Set Vow")}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
