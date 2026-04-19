"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { usePageMeta } from "@/contexts/PageMetaContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function GlobalPage() {
    const { setPageMeta } = usePageMeta();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setPageMeta({
            title: "Global Feed",
            subtitle: "Quotes, Techniques, and Advices from the community.",
            headerActions: undefined
        });

        const fetchPosts = async () => {
            try {
                const res = await axios.get("/api/global");
                setPosts(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [setPageMeta]);

    if (loading) return <div className="p-8">Loading global community feed...</div>;

    return (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
            {posts.map((post) => (
                <Card key={post.id}>
                    <CardContent className="p-4 flex gap-4">
                        <Avatar>
                            <AvatarImage src={post.user?.image} />
                            <AvatarFallback>{post.user?.name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm">{post.user?.name} <span className="font-normal text-muted-foreground ml-1">@{post.user?.username || 'user'}</span></span>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{post.type}</span>
                            </div>
                            <p className="mt-2 text-foreground text-sm whitespace-pre-wrap">{post.content}</p>
                            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                                <span>{post.likes} Likes</span>
                                <span>{dayjs(post.createdAt).fromNow()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
