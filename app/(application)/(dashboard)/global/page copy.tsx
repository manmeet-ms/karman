"use client";

import { useEffect } from "react";
import { usePageMeta } from "@/contexts/PageMetaContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { IconQuote, IconTool, IconTrophy, IconBulb } from "@tabler/icons-react";

const CATEGORIES = [
    { title: "Quotes", type: "QUOTE", desc: "Quotes from our community.", href: "/global/quotes", icon: IconQuote },
    { title: "Techniques", type: "TECHNIQUE", desc: "Techniques from the community.", href: "/global/techniques", icon: IconTool },
    { title: "Achievements", type: "ACHIEVEMENT", desc: "Grateful moments to get you driving.", href: "/global/achievements", icon: IconTrophy },
    { title: "Advices", type: "ADVICE", desc: "Advices from the community.", href: "/global/advices", icon: IconBulb },
];

export default function GlobalPage() {
    const { setPageMeta } = usePageMeta();

    useEffect(() => {
        setPageMeta({
            title: "Global Hub",
            subtitle: "Discover community wisdom.",
            headerActions: undefined
        });
    }, [setPageMeta]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto w-full p-4">
            {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                    <Link href={cat.href} key={cat.type} className="group">
                        <Card className="h-full hover:border-primary transition-colors cursor-pointer flex flex-col justify-center py-6">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="p-3 bg-muted rounded-full group-hover:bg-primary/20 transition-colors">
                                    <Icon className="text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <CardTitle className="group-hover:text-primary transition-colors text-xl">{cat.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{cat.desc}</p>
                            </CardContent>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}
