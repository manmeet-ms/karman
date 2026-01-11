
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconEye } from "@tabler/icons-react";

export default function UrgeInputForm() {
  return (
    <div className="flex items-center gap-2 border p-2 rounded-lg">
        <IconEye size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium">Log Urge</span>
        <Button size="sm" variant="outline">Quick Log</Button>
    </div>
  );
}
