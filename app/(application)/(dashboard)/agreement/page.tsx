
"use client";

import React from "react";
import { APP_LONG_DESCRIPTION } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { IconAlertTriangle, IconPoint, IconInfoCircle, IconExternalLink } from "@tabler/icons-react";

// Mocking Masonry behavior with simple grid
function Masonry({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

import { usePageMeta } from "@/contexts/PageMetaContext";

export default function AgreementPage() {
    const { setPageMeta } = usePageMeta();
    React.useEffect(() => {
        setPageMeta({ title: "Agreement", subtitle: "Terms and Conditions" });
    }, []);
    return (
        <section className="bg-background flex h-full flex-wrap overflow-hidden rounded-lg px-4 py-8">
             <Masonry>
                <div className="rounded-lg border p-4">
                    <span className="text-primary type-mono text-md rounded py-1 pb-0.5 font-semibold uppercase">
                        {APP_LONG_DESCRIPTION.content}
                    </span>
                    <h1 className="text-foreground my-3 text-3xl font-medium">
                        Agreement before proceeding
                        <span className="text-muted-foreground block font-normal text-base mt-1">
                            Check the reality tasks, then go forward. Why you must go towards perseverance.{" "}
                            <a href="#" className="text-primary inline-flex items-center">
                                View here <IconExternalLink size={14} className="ml-1" />
                            </a>
                        </span>
                    </h1>
                    {APP_LONG_DESCRIPTION.tasksBeforeProceeding.map((i, idx) => (
                        <div key={idx} className="my-1 flex items-center justify-start space-x-2">
                            <Checkbox id={`task-${idx}`} />
                            <label htmlFor={`task-${idx}`}>{i}</label>
                        </div>
                    ))}
                </div>

                <div className="rounded-lg border p-4">
                    <h1 className="text-foreground mt-4 mb-3 text-3xl font-medium">Warnings and Reality</h1>
                    {APP_LONG_DESCRIPTION.warningBeforeProceeding.map((i, idx) => (
                        <div key={idx} className="my-1 items-center space-x-2 flex">
                            <IconAlertTriangle className="mr-2 text-red-600 animate-pulse" size={16} />
                            {i}
                        </div>
                    ))}
                </div>

                <div className="rounded-lg border p-4">
                     <h1 className="text-foreground mb-3 text-3xl font-medium">
                        Samajh me aa rhi hain?
                        <span className="text-muted-foreground block font-normal text-base">Major life tasks</span>
                     </h1>
                     <ol className="my-6">
                        {APP_LONG_DESCRIPTION.bulletPoints.map((i, idx) => (
                            <li key={idx} className="my-0.5 flex items-center">
                                <IconPoint className="inline-flex mr-1" size={14} strokeWidth={2} /> {i}
                            </li>
                        ))}
                     </ol>
                </div>

                <div className="rounded-lg border p-4">
                    <h1 className="text-foreground my-6 mb-3 text-3xl font-medium">
                        Things I am Managing
                        <span className="text-muted-foreground block text-xl font-normal">Check these, if you still think you&apos;ve got time</span>
                    </h1>
                     {APP_LONG_DESCRIPTION.thingsImManaging.map((i, idx) => (
                        <div key={idx} className="my-1 flex items-center space-x-2 px-0.5">
                            <IconInfoCircle className="text-primary mr-2" size={14} />
                            {i}
                        </div>
                    ))}
                </div>
            </Masonry>
        </section>
    );
}
