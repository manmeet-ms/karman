"use client";
import { ChartRadarDots } from "@/components/chart-radar-dots";
import RitualInputForm from "@/components/Forms/RitualInputForm";
import { LongtermModuleCarousel } from "@/components/LongtermModuleCarousel";
import { PeopleSection } from "@/components/PeopleSection";
// import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import TimeBlockCard from "@/components/TimeBlockCard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { RecentViolations } from "@/components/ViolationLogs";
import { usePageMeta } from "@/contexts/PageMetaContext";
// import { IconTrophy } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// ...

import dayjs from "dayjs";

import axios from "axios";
import { toast } from "sonner";
import { IconCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { setPageMeta } = usePageMeta();
  const [ritual, setRitual] = useState<any[]>([]);
  //   const [stats, setStats] = useState<any>({ points: 0, rank: "Rookie" });
  const [violations, setViolations] = useState<any[]>([]);

  const fetchViolations = async () => {
      try {
          const res = await fetch("/api/violations");
          if (res.ok) {
              const data = await res.json();
              setViolations(data);
          }
      } catch (e) {
          console.error("Failed to fetch violations", e);
      }
  }

  const fetchRituals = async () => {
      try {
          const res = await fetch("/api/rituals");
          if (res.ok) {
              const data = await res.json();
              setRitual(data);
          }
      } catch (e) {
          console.error("Failed to fetch rituals", e);
      }
  }

  const handleCompleteRitual = async (id: string) => {
      try {
          await axios.put("/api/rituals", { id, action: "complete" });
          toast.success("Ritual completed! Points awarded.");
          fetchRituals();
      } catch (e) {
          console.error("Failed to complete ritual", e);
          toast.error("Failed to complete ritual");
      }
  }

  useEffect(() => {
    setPageMeta({
      title: 'Dashboard',
      subtitle: ' Your mirror, centralized Monitoring'
    });
    // fetchUserData();
    fetchViolations();
    fetchRituals();
  }, [setPageMeta]);

  const todayRitual = ritual.find((r: any) => r.date === dayjs().format("YYYY-MM-DD"));

  return (
    <div className="flex flex-1 flex-col ">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4">

          {/* Header Area: Longterm Modules */}
           

          <div className="grid grid-cols-1 items-start gap-4  md:grid-cols-2  ">

            <TimeBlockCard />
            <div className="">
              <RecentViolations violations={violations.slice(0, 5)} totalCount={violations.length} setViolations={setViolations} />
              <div className="grid my-4 grid-cols-2 gap-4">              
                <ChartRadarDots />

                <div className="h-full"> 
                   <PeopleSection />
                </div>

              </div>
              
              <Card   >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {" "}
                    <CardTitle>Today’s Ritual
                      <Badge className="mx-2 rounded-full py-3 relative bottom-0.5" variant={"secondary"}>{ritual.length}</Badge>
                    </CardTitle>
                    <RitualInputForm onComplete={fetchRituals}
                    // add this prop to make it edit curectly set or perhaps first vow 
                    // currentRitual={todayRitual}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table className="table-fixed w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">Date</TableHead>
                        <TableHead className="w-1/3">Vows</TableHead>
                        <TableHead className="w-1/3">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ritual.map((r, idx) => (
                        <TableRow key={r.id}>
                          <TableCell className="w-1/3 truncate font-medium">{r.date}</TableCell>
                          <TableCell className="w-1/3 truncate text-muted-foreground">{r.vow}</TableCell>
                          <TableCell className="w-1/3 truncate">
                              {r.completedDailyCheckIn ? (
                                  <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10 gap-1">
                                      <IconCheck size={12} /> Completed
                                  </Badge>
                              ) : (
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 text-xs gap-1 hover:bg-primary/10 hover:text-primary"
                                    onClick={() => handleCompleteRitual(r.id)}
                                  >
                                      <IconCheck size={14} /> Mark Complete
                                  </Button>
                              )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
