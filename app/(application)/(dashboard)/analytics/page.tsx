
"use client";

import React, { useState } from "react";
import { ChartBarInteractive } from "@/components/chart-bar-interactive";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = {
  streaks: [
    { date: "Jul 20", value: 1 },
    { date: "Jul 21", value: 2 },
  ],
  completions: [
    { date: "Jul 20", completed: 2, missed: 1 },
  ],
  moods: [
    { hour: "08:00", mood: 3 },
  ],
  rituals: [
    { date: "Jul 20", completed: true },
  ],
};

export default function AnalyticsPage() {
  const [tab, setTab] = useState("streaks");

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Analytics</h1>
      
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="streaks">Streaks</TabsTrigger>
          <TabsTrigger value="completions">Completed vs Missed</TabsTrigger>
          <TabsTrigger value="moods">Mood Tracker</TabsTrigger>
          <TabsTrigger value="rituals">Ritual History</TabsTrigger>
        </TabsList>

        <TabsContent value="streaks">
          <Card>
            <CardHeader><CardTitle>Streaks Over Days</CardTitle></CardHeader>
            <CardContent className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.streaks}>
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completions">
          <Card>
            <CardHeader><CardTitle>Completed vs Missed Blocks</CardTitle></CardHeader>
            <CardContent className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.completions}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                  <Bar dataKey="missed" fill="#ef4444" name="Missed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Placeholders for other tabs */}
        <TabsContent value="moods"><Card><CardContent>Mood Chart Placeholder</CardContent></Card></TabsContent>
        <TabsContent value="rituals"><Card><CardContent>Ritual History Placeholder</CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}
