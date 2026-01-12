
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { IconBoltFilled, IconLogout, IconPercentage10, IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../mode-toogle";
import { EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}
export function AppHeader() {

  const session = useSession()
  const [emblaRef, emblaApi] = useEmblaCarousel({ axis: 'y', loop: true }, [Autoplay()])


  const points: number = 1
  const pointsLedgerFe: string[] = []
  const longTermGoals = [
     
    {
      icon: <IconPlus />,
      name: "Learn Advanced Python",
      daysTill: "2025-12-01"
    },
    {
      icon: <IconPlus />,
      name: "Publish First Blog",
      daysTill: "2025-07-15"
    },
    {
      icon: <IconPlus />,
      name: "Run Half Marathon",
      daysTill: "2026-01-10"
    },
    {
      icon: <IconPlus />,
      name: "Master Data Visualization",
      daysTill: "2025-11-30"
    } ,  {
      icon: <IconPlus />,
      name: "Run Half Marathon",
      daysTill: "2026-01-10"
    }
  ];

  return (
    <>

      <header className="p-4 sticky top-0 z-10 bg-muted/30 border-b backdrop-brightness-20 backdrop-blur-2xl ">
        <nav className="flex items-center  justify-between">
          <Link href="/" className="flex   items-center gap-2">
            {" "}
            <Image src="/logo.svg" width={24} height={24} className="grayscale w-8 h-8 rounded" alt="logo" />
            <div className="flex flex-col">
              {" "}
              <span className="text-lg font-semibold tracking-tighter">Karman</span>
              <span className="text-[10px] uppercase tracking-widest text-secondary">
                formerly Jathedar
              </span>
            </div>


          </Link>

          <div className="  flex container max-w-[65%]    overflow-x-scroll no-scrollbar p-1 border  gap-2    rounded-full ">



            {longTermGoals.map((item, idx) => (
              <div key={idx} className="    bg-primary/10 text-primary  backdrop-blur-2xl flex flex-nowrap items-center gap-2 rounded-full px-3 py-2 text-xs/4 whitespace-nowrap ring ring-gray-950/8 dark:ring-white/10 hover:bg-gray-950/2 hover:ring-gray-950/10 dark:hover:bg-white/5 dark:hover:ring-white/20  ">
                <IconPercentage10 className="text-primary size-4 " />
                <span className="font-medium">
                  {item.name} - <b>Day {dayjs(item.daysTill).diff(dayjs(), "days") * -1}</b>{" "}
                </span>
              </div>

            ))}
            <Button className="sticky right-0" ><IconPlus />
              {/* Long term Goal */}
            </Button>
          </div>
          {/* // TODO: refactor Nav logic */}

          <section className="flex   gap-2 justify-end items-center">

            {/* // TODO: Make this button cretion  on footer */}
            {/* <Button><IconPlus />
              Long term Goal
            </Button> */}
            <ModeToggle />
            {session?.status === 'authenticated' ? (
              <div className="flex gap-2">



                <Sheet>
                  <SheetTrigger>
                    {" "}
                    <span className={cn("text-sm flex justify-center items-center px-3  gap-1.5  py-2   rounded-full bg-accent/50       ", points < 0 ? "text-red-600" : "")}>
                      <IconBoltFilled size={16} />
                      {/* TODO: add the optiomization to add background job that periodically syncs with backd, since there will be many many evern tsin the whole day, so we need to minise the backedn calls */}
                      {Number.parseFloat(points ?? 0).toFixed(2)}
                    </span>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>
                        Points Ledger
                        <br />
                        <span className="font-normal text-xs text-secondary-foreground/40">
                          Total Entries till {dayjs(new Date()).format("DD MMM, YYYY")} - {pointsLedgerFe.length}
                        </span>
                        {/* //TODO Download CSV */}
                        {/* type
points
balanceAfter
timestamps[] */}
                      </SheetTitle>
                      <SheetDescription>
                        <ScrollArea className="h-screen ">
                          <ol className="  ">
                            {pointsLedgerFe
                              ? pointsLedgerFe.reverse().map((entry, idx) => (
                                <li key={idx} className="border-b py-2  flex items-center justify-between  ">
                                  <div>
                                    <div className="flex gap-4 items-center  justify-start">
                                      <span className="opacity-30">#{idx + 1}</span>
                                      <div>
                                        <Badge variant="outline" className="border-0 px-0 ">
                                          {entry.type.includes("credit")}

                                          {entry.type.includes("credit".toUpperCase()) ? <IconTrendingUp className="text-green-400" /> : <IconTrendingDown className="text-red-400" />}
                                          {entry.type.replace(/_/g, " ")}
                                          <DotIcon className="inline -mx-1     " />
                                          <span className={cn("  text-sm font-normal leading-none ", entry.balanceAfter - entry.points > 0 ? "text-green-400" : "text-red-400")}>{entry.balanceAfter - entry.points}</span>
                                        </Badge>{" "}
                                        <p className="text-xs pl-4 text-secondary-foreground/40">
                                          Balance{" "}
                                          <span className="text-secondary-foreground/40 font-medium">
                                            {entry?.points} → {entry?.balanceAfter}
                                          </span>
                                        </p>
                                      </div>{" "}
                                    </div>{" "}
                                  </div>
                                  <div className="flex flex-col items-end text-xs text-secondary-foreground/40">
                                    <span>{dayjs(entry.createdAt).format("DD MMM")}</span>
                                    <span>{dayjs(entry.createdAt).format("hh:mm a")}</span>
                                  </div>
                                </li>
                              ))
                              : null}
                          </ol>
                        </ScrollArea>
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src={session?.data?.user?.image} />
                      <AvatarFallback>{session?.data?.user?.name[0]}</AvatarFallback>
                    </Avatar>

                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="  ">
                        Logged in as  {session?.data?.user?.name} <br />
                        <span className="relative top-1 text-muted-foreground/40 mt-1 ">{session?.data?.user?.email}
                        </span>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href={"/settings"}>Settings</Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="flex items-center gap-2  ">
                      Logout <IconLogout size={16} />
                    </DropdownMenuItem>


                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
            ) : (
              <Button onClick={() => signIn('google')} >Login</Button>

            )}


          </section>
        </nav>
      </header>

    </>
  );
}

export function LandingHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="font-bold text-xl">Karman</div>
      <nav className="flex gap-4">
        <Link href="/"><Button variant="ghost">Dashboard</Button></Link>
        <Link href="/login"><Button>Login</Button></Link>
      </nav>
    </header>
  );
}