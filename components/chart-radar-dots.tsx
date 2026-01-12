"use client"


import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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
import { IconTrendingUp } from "@tabler/icons-react"

export const description = "A radar chart with dots"

const chartData = [
  // { month: "T. Blocks", desktop: 186 },
  { month: "C. Blocks", desktop: 90 },
  { month: "Discipline", desktop: 70 },
  { month: "Blocks Missed", desktop: 20 },
  { month: "Streak", desktop: 30 },
  { month: "C. Ritual", desktop: 10 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartRadarDots() {
  return (
    <Card>
      <CardHeader className="items-center">
        
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto  max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
  )
}
