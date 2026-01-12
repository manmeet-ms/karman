

"use client";
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {

  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React, { useEffect, useState } from "react";
import { StatsGrid } from "@/components/StatsGrid";
import TimeBlockCard from "@/components/TimeBlockCard";
import { RecentViolations } from "@/components/ViolationLogs";
import { useSession } from "next-auth/react";
import RitualInputForm from "@/components/Forms/RitualInputForm";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePageMeta } from "@/contexts/PageMetaContext";
import { IconPercentage10, IconPlus, IconUser, IconUserQuestion } from "@tabler/icons-react";
import dayjs from "dayjs";
import { ChartRadarDots } from "@/components/chart-radar-dots";

export default function Dashboard() {
  const { setPageMeta } = usePageMeta();
  // Placeholder state for data
  // const [blocks, setBlocks] = useState<any[]>([]);
  const [ritual, setRitual] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ points: 120, rank: "Acolyte" });
  const [violations, setViolations] = useState<any[]>([]);

  useEffect(() => {
    setPageMeta({
      title: 'Dashboard',
      subtitle: ' Your mirror, centralized Monitoring'
    });
  }, [setPageMeta]);
  const session = useSession()
  console.log(session)
  return (
    <div className="flex flex-1 flex-col ">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4">


          {/* <StatsGrid statsDataProp={stats} /> */}

          <div className="grid grid-cols-1 items-start gap-4  md:grid-cols-2  ">

            <TimeBlockCard />
            <div className="">
              <RecentViolations violations={violations.slice(0, 5)} totalCount={violations.length} setViolations={setViolations} />
              <div className="grid my-4 grid-cols-2 gap-4">              <ChartRadarDots />


                <Card >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      
                   <div className="">   People vs You <IconUserQuestion size={16} className="inline-flex items-center justify-center mb-0.75 " /></div>

                   <Button variant="outline" size="sm" className="gap-1">
              <IconPlus size={16} /> Add People
            </Button>
                        </CardTitle>
                        {/* <Separator /> */}
                  </CardHeader>
                  <ScrollArea className="max-h-[150px] container  ">
                    <CardContent className="flex flex-wrap gap-1">
                      {Array.from({ length: 40 }).map((_, idx) => (
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">{idx}</div>  
                      ))}

                    </CardContent>
                  </ScrollArea>

                </Card>

              </div>
              {/* {ritual.length<0?    <section className="bg-card my-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    {" "}
                    <h2 className="text-xl font-bold">
                      Today’s Ritual
                      <span className="bg-primary/20 text-primary ml-2 rounded-full px-2 py-1.25 text-xs font-bold">{ritual.length}</span>
                    </h2>
                    <RitualInputForm />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>

                        <TableHead>Vows</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ritual.map((r, idx) => (
                        <TableRow key={r._id}>
                          <TableCell className="w-1/4">{r.date}</TableCell>
                          <TableCell className="">{r.vow}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </section>:null} */}

              <Card className="my-4" >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {" "}
                    <CardTitle>Today’s Ritual

                      <Badge className="mx-2 rounded-full py-3 relative bottom-0.5" variant={"secondary"}>{ritual.length}</Badge>

                    </CardTitle>

                    <RitualInputForm />
                  </div>

                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>

                        <TableHead>Vows</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ritual.map((r, idx) => (
                        <TableRow key={r._id}>
                          <TableCell className="w-1/4">{r.date}</TableCell>
                          <TableCell className="">{r.vow}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>

              </Card>


              {/* <PhilosophyQuoteCard /> */}



              {/* <NegativesDiscordCards/> */}
              {/* <div className="-mx-5"><ThoughtsDiscordCards/>
</div> */}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
