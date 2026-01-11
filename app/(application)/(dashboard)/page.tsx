

"use client";
import { Badge } from "@/components/ui/badge"
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
export default function Dashboard() {
  // Placeholder state for data
  const [blocks, setBlocks] = useState<any[]>([]);
  const [ritual, setRitual] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [violations, setViolations] = useState<any[]>([]);

  useEffect(() => {
    setStats({ points: 120, rank: "Acolyte" });
    setViolations([]);
    setRitual([]);
    setBlocks([]);
  }, []);
  const session = useSession()
  console.log(session)
  return (
    <div className="flex flex-1 flex-col ">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4">
          <StatsGrid statsDataProp={stats} />

          <div className="grid grid-cols-1 items-start gap-4  md:grid-cols-2  ">
            {/* <ChartAreaInteractive /> */}
            {/* <Button
                onClick={async () => {
                  const newPoints = await applyPointsSrv("TIMEBLOCK_COMPLETE_CREDIT");
                  console.log(newPoints);

                  dispatch(setPt(newPoints.data.points));
                }}>
                Add +20 points
              </Button>
              <Button
                onClick={async () => {
                  const newPoints = await applyPointsSrv("TIMER_RESET_PENALTY");
                  dispatch(setPt(newPoints.data.points));
                }}>
                Deduct -60 points
              </Button> */}
            {/* { !user?.id&& 
<Link target='_blank' to="http://localhost:3000/api/auth/discord/login"><Button>Login with Discord</Button></Link>
} */}
            <TimeBlockCard />
            <div className="">
              {blocks.some((b) => !b.completed && b.strict) && (
                <Card className="mb-4 bg-red-800/20">
                  <CardContent className="">
                    <h2 className="mb-2 text-xl font-bold">Strict Mode Active</h2>
                    <p>Uncompleted strict tasks will trigger punishments.</p>
                  </CardContent>
                </Card>
              )}
              <RecentViolations violations={violations.slice(0, 5)} totalCount={violations.length} setViolations={setViolations} />

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
