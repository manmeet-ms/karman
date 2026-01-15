import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  description: string;
  items?: string[];
  image?: string;
  button?: {
    url: string;
    text: string;
  };
};

export interface ChangelogProps {
  className?: string;
  title?: string;
  description?: string;
  entries?: ChangelogEntry[];
}

export const defaultEntries: ChangelogEntry[] = [
  {
    version: "Version 1.5.0",
    date: "10 January 2026",
    title: "Enforcement Protocols",
    description:
      "Introduced strict locking mechanisms for time blocks. Once a block is set, it cannot be edited or moved.",
    items: [
      "Immutable time blocks",
      "Removal of 'Edit' button during active blocks",
      "Strict enforcement of start/end times",
    ],
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-aspect-video-1.svg",
  },
  {
    version: "Version 1.4.0",
    date: "15 December 2025",
    title: "Violation Logging",
    description:
      "Added immutable logging for missed check-ins and protocol violations.",
    items: [
      "Missed check-ins are now permanently recorded",
      "Violation history cannot be cleared",
      "New 'Shame' dashboard for reviewing failures",
    ],
  },
  {
    version: "Version 1.3.0",
    date: "20 November 2025",
    title: "Vertical Accountability",
    description:
      "Removed social features. Data is now isolated to user identity to prevent performative productivity.",
    items: [
      "Removed friend feeds",
      "Removed 'Likes' and Comments",
      "Data isolation protocol implemented",
    ],
  },
  {
    version: "Version 1.2.0",
    date: "01 November 2025",
    title: "Memory Collapse",
    description:
      "Implemented hourly check-ins to prevent narrative rewriting and memory gaps.",
    items: [
      "Hourly prompt triggers",
      "Forced reflection entry",
      "Gap detection algorithm",
    ],
  },
  {
    version: "Version 1.1.0",
    date: "10 October 2025",
    title: "The Purge",
    description:
      "Removed all decorative elements and dopamine loops from the interface.",
    items: [
      "Black and white mode enforcement",
      "Removal of gamification badges",
      "Typography hardening",
    ],
     image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-aspect-video-1.svg",
  },
];

const Changelog = ({
  title = "Changelog",
  description = "Get the latest updates and improvements to our platform.",
  entries = defaultEntries,
  className,
}: ChangelogProps) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mb-6 text-base text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-3xl space-y-16 md:mt-24 md:space-y-24">
          {entries.map((entry, index) => (
            <div
              key={index}
              className="relative flex flex-col gap-4 md:flex-row md:gap-16"
            >
              <div className="top-8 flex h-min w-64 shrink-0 items-center gap-4 md:sticky">
                <Badge variant="secondary" className="text-xs">
                  {entry.version}
                </Badge>
                <span className="text-xs font-medium text-muted-foreground">
                  {entry.date}
                </span>
              </div>
              <div className="flex flex-col">
                <h2 className="mb-3 text-lg leading-tight font-bold text-foreground/90 md:text-2xl">
                  {entry.title}
                </h2>
                <p className="text-sm text-muted-foreground md:text-base">
                  {entry.description}
                </p>
                {entry.items && entry.items.length > 0 && (
                  <ul className="mt-4 ml-4 space-y-1.5 text-sm text-muted-foreground md:text-base">
                    {entry.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {entry.image && (
                  <img
                    src={entry.image}
                    alt={`${entry.version} visual`}
                    className="mt-8 w-full rounded-lg object-cover"
                  />
                )}
                {entry.button && (
                  <Button variant="link" className="mt-4 self-end" render={<a href={entry.button.url} target="_blank" />}>
                      {entry.button.text} <ArrowUpRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Changelog
