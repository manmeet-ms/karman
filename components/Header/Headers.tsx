
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
 
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconBolt, IconBrandGoogleFilled, IconLogout, IconLogout2, IconPercentage10 } from "@tabler/icons-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
 import { ScrollArea } from "@/components/ui/scroll-area"
import dayjs from "dayjs";
import Image from "next/image";
import { cn  } from "@/lib/utils";
import { ModeToggle } from "../mode-toogle";
export function AppHeader() {
  const session = useSession()
  const points:number=1
  const pointsLedgerFe:string[]=[]
  return (
 <>
     <header className="p-4 sticky top-0 z-10 bg-muted/30 backdrop-brightness-20 backdrop-blur-2xl ">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {" "}
          <Image src="/logo.svg" width={24} height={24} className="grayscale w-8 h-8  rounded       " alt="logo" />
          <div className="flex flex-col">
            {" "}
            <span className="text-lg font-semibold tracking-tighter">Karman</span>
            <span className="text-[8px]   uppercase tracking-widest text-muted-foreground/30">formerly Jathedar</span>
          </div>
          <div className="block md:hidden  ">
            {" "}
            <div className="  fixed  bottom-20  bg-background/40  backdrop-blur-2xl flex flex-nowrap items-center gap-2 rounded-full px-3 py-2 text-xs/4 whitespace-nowrap ring ring-gray-950/8 dark:ring-white/10 hover:bg-gray-950/2 hover:ring-gray-950/10 dark:hover:bg-white/5 dark:hover:ring-white/20 @max-[23rem]:hidden">
              <IconPercentage10 className="text-primary size-4 " />
              <span className="font-medium">
                SSC Preparation - <b>Day {dayjs("2025-09-23").diff(dayjs().now, "days") * -1}</b>{" "}
              </span>
            </div>
          </div>
          <div className="ml-4 hidden md:flex flex-nowrap items-center gap-2 rounded-full px-3 py-2 text-xs/4 whitespace-nowrap ring ring-gray-950/8 dark:ring-white/10 hover:bg-gray-950/2 hover:ring-gray-950/10 dark:hover:bg-white/5 dark:hover:ring-white/20 @max-[23rem]:hidden">
            <IconPercentage10 className="text-primary size-4 " />
            <span className="font-medium">
              SSC Preparation - <b>Day {dayjs("2025-09-23").diff(dayjs().now, "days") * -1}</b>{" "}
            </span>
          </div>
        </Link>
        {/* // TODO: refactor Nav logic */}
        <section className="flex gap-2 items-center">
          {/* <NavigationMenu className="hidden items-center gap-2 lg:flex">
    <NavigationMenuList>
      <NavigationMenuItem>
      <NavigationMenuTrigger>Features</NavigationMenuTrigger>
      <NavigationMenuContent>
      <div className="grid w-[600px] grid-cols-2 p-3">
        {features.map((feature, index) => (
        <NavigationMenuLink
        href={feature.href}
        key={index}
        className="hover:bg-muted/70 rounded-md p-3 transition-colors">
        <div key={feature.title}>
          <p className="text-foreground mb-1 font-semibold">
          {feature.title}
          </p>
          <p className="text-muted-foreground text-sm">
          {feature.description}
          </p>
        </div>
        </NavigationMenuLink>
        ))}
      </div>
      </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
      <NavigationMenuLink
      href="/philosophy"
      className={navigationMenuTriggerStyle()}>
      Philosophy
      </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
      <NavigationMenuLink
      href="#"
      className={navigationMenuTriggerStyle()}>
      Changelog
      </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
      <NavigationMenuLink
      href="/contact"
      className={navigationMenuTriggerStyle()}>
      Contact
      </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
    </NavigationMenu> */}
          {/* <Button variant="outline">Sign in</Button>
    <Button>Start for free</Button> */}
<ModeToggle/>
          {session?.status === 'authenticated'? (
            <div className="flex gap-2">
              

          
        <Sheet>
                <SheetTrigger>
                  {" "}
                  <span className={cn("text-sm flex justify-center items-center px-3  gap-1.5  py-2   rounded-full bg-card    border border-accent ", points < 0 ? "text-red-600" : "")}>
                    <IconBolt size={16} />
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
    <DropdownMenuItem onClick={()=>signOut({callbackUrl:"/login"})} className="flex items-center gap-2  ">
      Logout <IconLogout  size={16}/>
      </DropdownMenuItem>


  </DropdownMenuContent>
</DropdownMenu>

            </div>
          ) : (
            <Button onClick={()=>signIn('google')} >Login</Button>
            
          )}

          {/* <Sheet className="lg:hidden" >
    <SheetTrigger asChild>

      <MenuIcon className="inline-flex h-4 w-4" />

    </SheetTrigger>
    <SheetContent side="top" className="max-h-screen overflow-auto">
      <SheetHeader>
      <SheetTitle>
      <a
        href="https://www.shadcnblocks.com"
        className="flex items-center gap-2">
        <img
        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
        className="max-h-8"
        alt="Shadcn UI Navbar"
        />
        <span className="text-lg font-semibold tracking-tighter">
        Shadcnblocks.com
        </span>
      </a>
      </SheetTitle>
      </SheetHeader>
      <div className="flex flex-col p-4">
      <Accordion type="single" collapsible className="mt-4 mb-2">
      <AccordionItem value="solutions" className="border-none">
        <AccordionTrigger className="text-base hover:no-underline">
        Features
        </AccordionTrigger>
        <AccordionContent>
        <div className="grid md:grid-cols-2">
        {features.map((feature, index) => (
          <a
          href={feature.href}
          key={index}
          className="hover:bg-muted/70 rounded-md p-3 transition-colors">
          <div key={feature.title}>
          <p className="text-foreground mb-1 font-semibold">
            {feature.title}
          </p>
          <p className="text-muted-foreground text-sm">
            {feature.description}
          </p>
          </div>
          </a>
        ))}
        </div>
        </AccordionContent>
      </AccordionItem>
      </Accordion>
      <div className="flex flex-col gap-4">
      <a href="#" className="font-medium">
        Templates
      </a>
      <a href="#" className="font-medium">
        Blog
      </a>
      <a href="#" className="font-medium">
        Pricing
      </a>
      </div>
      <div className="mt-6 flex flex-col gap-2">
      <Button variant="outline">Sign in</Button>
      <Button>Start for free</Button>
      </div>
      </div>
    </SheetContent>
    </Sheet> */}
          {/* <ModeToggle /> */}
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
