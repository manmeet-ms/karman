
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentViolations({ violations, totalCount }: { violations: any[], totalCount: number, setViolations: any }) {
  return (
<Card>
        <CardHeader>
            <CardTitle>Recent Violations
                <span className="bg-primary/20 text-primary ml-2 rounded-full px-2 py-1 text-xs font-bold">
            {totalCount}
          </span> </CardTitle>

        </CardHeader>
        <CardContent>
            {violations.length === 0 ? (
                <p>No violations logged.</p>
            ) : (
                <ul>
                    {violations.map((v, i) => <li key={i}>{v.type}</li>)}
                </ul>
            )}
        </CardContent>
    </Card>
  );
}
