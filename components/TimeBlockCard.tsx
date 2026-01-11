
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TimeBlockCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Time Blocks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-muted-foreground">No active blocks.</p>
          <Button>Add Block</Button>
        </div>
      </CardContent>
    </Card>
  );
}
