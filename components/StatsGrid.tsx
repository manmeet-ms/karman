
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsGrid({ statsDataProp }: { statsDataProp: any }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statsDataProp?.points || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rank</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statsDataProp?.rank || "N/A"}</div>
        </CardContent>
      </Card>
    </div>
  );
}
