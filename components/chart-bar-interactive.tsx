
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChartBarInteractive({ title, urges, clx }: { title?: string, urges?: any[], clx?: string }) {
  return (
    <Card className={clx}>
      <CardHeader>
        <CardTitle>{title || "Chart"}</CardTitle>
      </CardHeader>
      <CardContent className="h-[200px] flex items-center justify-center bg-muted/20">
        <p>Chart Placeholder</p>
      </CardContent>
    </Card>
  );
}
