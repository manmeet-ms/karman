"use client"
 
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import dayjs from "dayjs"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A bar chart with a label"

const chartConfig = {
  intensity: {
    label: "Intensity",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function ChartBarInteractive({ title, urges, clx }: { title?: string, urges?: any[], clx?: string }) {
  const chartData = useMemo(() => {
    if (!urges || urges.length === 0) return [];
    
    // Group by date (Last 7 days)
    const grouped: Record<string, number> = {};
    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
        last7Days.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
    }

    last7Days.forEach(date => {
        grouped[date] = 0;
    });

    urges.forEach(u => {
        const date = dayjs(u.urgeTimeStamp).format('YYYY-MM-DD');
        if (grouped[date] !== undefined) {
             grouped[date] += (u.urgeIntensity || 0);
        }
    });

    return Object.keys(grouped).map(date => ({
        date: dayjs(date).format('MMM DD'),
        intensity: grouped[date]
    }));
  }, [urges]);

  return (
    <Card className={clx}>
      <CardHeader>
        <CardTitle>{title || "Urge Intensity"}</CardTitle>
        <CardDescription>Daily cumulative intensity (Last 7 Days)</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px]" >
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="intensity" fill="var(--color-intensity)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
