
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentViolations({ violations, totalCount }: { violations: any[], totalCount: number, setViolations: any }) {
  return (
    <Card className="mb-4">
        <CardHeader>
            <CardTitle>Recent Violations ({totalCount})</CardTitle>
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
