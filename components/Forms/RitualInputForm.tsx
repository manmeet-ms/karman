
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RitualInputForm() {
  return (
    <div className="flex gap-2">
        <Input placeholder="Enter new ritual..." />
        <Button>Add</Button>
    </div>
  );
}
