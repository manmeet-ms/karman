
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconMessageCirclePlus, IconExternalLink } from "@tabler/icons-react";

// Dummy Data
const DUMMY_NOTES = Array.from({ length: 6 }).map((_, i) => ({
  title: `Note Title ${i + 1}`,
  content: "This is a placeholder for the content of the note. It simulates text that would come from Discord.",
  date: "2024-01-01",
  tag: "Tag"
}));

const DUMMY_WORDS = ["Discipline", "Focus", "Strength", "Will", "Consistency"];

function MasonryGrid({ children }: { children: React.ReactNode }) {
    // Simple CSS Columns implementation for Masonry-like layout
    return (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {children}
        </div>
    );
}

function NoteCard({ note, colorClass }: { note: any, colorClass: string }) {
    return (
        <Card className="break-inside-avoid mb-4">
            <CardHeader>
                <CardTitle className="text-lg capitalize">{note.title}</CardTitle>
                <CardDescription>{note.content}</CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center">
                <div className={`mt-0.5 mr-2 h-2 w-2 rounded-full ${colorClass}`}></div>
                <span className="text-muted-foreground/40 text-xs">
                    {note.date} {note.tag}
                </span>
            </CardFooter>
        </Card>
    );
}

export default function DiscordPage() {
  const [activeTab, setActiveTab] = useState("positives");

  return (
    <div className="pb-24">
      <Tabs defaultValue="positives" onValueChange={setActiveTab}>
        <div className="sticky top-0 container flex justify-center z-10 bg-background/80 backdrop-blur-sm py-2">
            <TabsList className="md:py-6 mb-2 rounded-full h-auto">
                {["positives", "negatives", "dairy", "query", "thoughts"].map((tab) => (
                    <TabsTrigger 
                        key={tab}
                        className="capitalize text-md rounded-full py-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" 
                        value={tab}
                    >
                        {tab}
                    </TabsTrigger>
                ))}
            </TabsList>
        </div>

        <TabsContent value="positives" className="pl-4 pr-4">
            <div className="mx-auto w-full max-w-6xl">
                 <div className="mb-4 flex flex-wrap justify-center gap-1">
                    {DUMMY_WORDS.map((word, index) => (
                        <span key={index} className="rounded-lg text-sm bg-green-400/30 text-green-900 dark:bg-green-900/40 dark:text-green-200 px-4 py-2 font-semibold capitalize">
                            {word}
                        </span>
                    ))}
                 </div>
                 <MasonryGrid>
                    {DUMMY_NOTES.map((note, idx) => (
                        <NoteCard key={idx} note={note} colorClass="bg-green-400" />
                    ))}
                 </MasonryGrid>
            </div>
        </TabsContent>

        <TabsContent value="negatives" className="pl-4 pr-4">
            <div className="mx-auto w-full max-w-6xl">
                 <MasonryGrid>
                    {DUMMY_NOTES.map((note, idx) => (
                        <NoteCard key={idx} note={note} colorClass="bg-red-400" />
                    ))}
                 </MasonryGrid>
            </div>
        </TabsContent>

        <TabsContent value="dairy" className="pl-4 pr-4">
             <div className="mx-auto w-full max-w-6xl">
                 <MasonryGrid>
                    {DUMMY_NOTES.map((note, idx) => (
                        <NoteCard key={idx} note={note} colorClass="bg-blue-400" />
                    ))}
                 </MasonryGrid>
            </div>
        </TabsContent>

        <TabsContent value="query" className="pl-4 pr-4">
             <div className="mx-auto w-full max-w-6xl text-center p-8 text-muted-foreground">
                <p>why do ssc in month why strenght train why discipline why preserve why work why skil up why educate why elarn extra things bring ack yu r tech savvy era knowin about everything why read book why ditvh instghram , reddit post</p>
             </div>
        </TabsContent>

        <TabsContent value="thoughts" className="pl-4 pr-4">
             <div className="mx-auto w-full max-w-6xl">
                 <MasonryGrid>
                    {DUMMY_NOTES.map((note, idx) => (
                        <NoteCard key={idx} note={note} colorClass="bg-orange-400" />
                    ))}
                 </MasonryGrid>
            </div>
        </TabsContent>
      </Tabs>

      <Button className="fixed bottom-24 md:bottom-8 right-4 lg:right-8 z-50">
        <IconMessageCirclePlus className="mr-2 h-4 w-4"/> Add Thought
      </Button>
    </div>
  );
}
