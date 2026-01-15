"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"





import { useEffect, useState } from "react";

import type { CarouselApi } from "@/components/ui/carousel";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";


import { Button } from "@/components/ui/button";


interface GalleryItem {
    id: string;
    title: string;
    summary: string;
    url: string;
    image: string;
}

interface Gallery6Props {
    heading?: string;
    demoUrl?: string;
    items?: GalleryItem[];
    className?: string;
}

const Gallery6 = ({
    heading = "Gallery",
    demoUrl = "https://www.shadcnblocks.com",
    items = [
        {
            id: "item-1",
            title: "Build Modern UIs",
            summary:
                "Create stunning user interfaces with our comprehensive design system.",
            url: "#",
            image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
        },
        {
            id: "item-2",
            title: "Computer Vision Technology",
            summary:
                "Powerful image recognition and processing capabilities that allow AI systems to analyze, understand, and interpret visual information from the world.",
            url: "#",
            image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
        },
        {
            id: "item-3",
            title: "Machine Learning Automation",
            summary:
                "Self-improving algorithms that learn from data patterns to automate complex tasks and make intelligent decisions with minimal human intervention.",
            url: "#",
            image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
        },
        {
            id: "item-4",
            title: "Predictive Analytics",
            summary:
                "Advanced forecasting capabilities that analyze historical data to predict future trends and outcomes, helping businesses make data-driven decisions.",
            url: "#",
            image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
        },
        {
            id: "item-5",
            title: "Neural Network Architecture",
            summary:
                "Sophisticated AI models inspired by human brain structure, capable of solving complex problems through deep learning and pattern recognition.",
            url: "#",
            image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
        },
    ],
    className,
}: Gallery6Props) => {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    useEffect(() => {
        if (!carouselApi) {
            return;
        }
        const updateSelection = () => {
            setCanScrollPrev(carouselApi.canScrollPrev());
            setCanScrollNext(carouselApi.canScrollNext());
        };
        updateSelection();
        carouselApi.on("select", updateSelection);
        return () => {
            carouselApi.off("select", updateSelection);
        };
    }, [carouselApi]);
    return (
        <section className={cn("py-16 bg-background", className)}>
            <div className="container w-full mx-auto">
                <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
                    <div>
                        <h2 className="mb-3 text-3xl font-medium md:mb-4 md:text-4xl lg:mb-6">
                            {heading}
                        </h2>
                        <a
                            href={demoUrl}
                            className="group flex items-center gap-1 text-sm font-medium md:text-base lg:text-lg"
                        >
                            Book a demo
                            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>
                    <div className="mt-8 flex shrink-0 items-center justify-start gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                carouselApi?.scrollPrev();
                            }}
                            disabled={!canScrollPrev}
                            className="disabled:pointer-events-auto"
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                carouselApi?.scrollNext();
                            }}
                            disabled={!canScrollNext}
                            className="disabled:pointer-events-auto"
                        >
                            <IconBrandGithub className="size-5 inline-flex items-center justify-center " />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-full">
                <Carousel
                    setApi={setCarouselApi}
                    opts={{
                        breakpoints: {
                            "(max-width: 768px)": {
                                dragFree: true,
                            },
                        },
                    }}
                    className="relative w-full max-w-full md:left-[-1rem]"
                >
                    <CarouselContent className="hide-scrollbar w-full max-w-full md:-mr-4 md:ml-8 2xl:mr-[max(0rem,calc(50vw-700px-1rem))] 2xl:ml-[max(8rem,calc(50vw-700px+1rem))]">
                        {items.map((item) => (
                            <CarouselItem key={item.id} className="ml-8 md:max-w-[452px]">
                                <a
                                    href={item.url}
                                    className="group flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex aspect-3/2 overflow-clip rounded-xl">
                                            <div className="flex-1">
                                                <div className="relative h-full w-full origin-bottom transition duration-300 group-hover:scale-105">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-2 line-clamp-3 pt-4 text-lg font-medium break-words md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-2xl">
                                        {item.title}
                                    </div>
                                    <div className="mb-8 line-clamp-2 text-sm text-muted-foreground md:mb-12 md:text-base lg:mb-9">
                                        {item.summary}
                                    </div>
                                    <div className="flex items-center text-sm">
                                        Read more{" "}
                                        <IconBrandGithub className="inline-flex items-center justify-center size-5 ml-2 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </a>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
};


interface Community1Props {
    className?: string;
}

const Community1 = ({ className }: Community1Props) => {
    return (
        <section className={cn("py-16", className)}>
            <div className="container w-full mx-auto">
                <div className="flex flex-col items-center gap-5">
                    <img src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg" alt="logo" className="size-10" />
                    <h2 className="text-center text-3xl font-medium">
                        Join the Hierarchy
                        <br />
                        <span className="text-muted-foreground/80">
                            Externalize your discipline. Join the Discord.
                        </span>
                    </h2>
                    <div className="flex items-center gap-4">


                        <Button size="icon-lg" variant="outline" render={<a href="#" />}>

                            <IconBrandGithub className="inline-flex items-center justify-center " />

                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};



interface Cta10Props {
    heading?: string;
    description?: string;
    buttons?: {
        primary?: {
            text: string;
            url: string;
        };
        secondary?: {
            text: string;
            url: string;
        };
    };
    className?: string;
}

const Cta10 = ({
    heading = "Submit to the System",
    description = "Stop negotiating with your weakness. Start executing your will.",
    buttons = {
        primary: {
            text: "Get Started",
            url: "/login",
        },
    },
    className,
}: Cta10Props) => {
    return (
        <section className={cn("py-16 rounded-xl", className)}>
            <div className="container w-full mx-auto">
                <div className="flex w-full flex-col gap-16 overflow-hidden rounded-lg   p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-12">
                    <div className="flex-1">
                        <h3 className="mb-3 text-2xl font-medium md:mb-4 md:text-4xl lg:mb-6">
                            {heading}
                        </h3>
                        <p className="max-w-xl text-muted-foreground lg:text-lg">
                            {description}
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        {buttons.secondary && (
                            <Button variant="outline" render={<a href={buttons.secondary.url} />}>
                                {buttons.secondary.text}
                            </Button>
                        )}
                        {buttons.primary && (
                            <Button variant="default" size="lg" render={<a href={buttons.primary.url} />}>
                                {buttons.primary.text}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};





import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import { HeroSection } from "@/components/hero-section-1";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { LandingFooter } from "@/components/Footer";

function FAQsTwo() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'Can I edit my plan after locking it?',
            answer: 'No. Once locked, time blocks are immutable law. Modification is failure.',
        },
        {
            id: 'item-2',
            question: 'What if I have an emergency?',
            answer: 'The system records the failure. You can explain it to yourself later. The log remains.',
        },
        {
            id: 'item-3',
            question: 'Why so harsh?',
            answer: 'Because your "gentle" approach is why you are still making the same mistakes.',
        },
        {
            id: 'item-4',
            question: 'Who is this for?',
            answer: "People who are tired of their own excuses and want externalized authority.",
        },
        {
            id: 'item-5',
            question: 'Is there a free tier?',
            answer: 'Discipline costs comfort. The app has a cost to ensure commitment.',
        },
    ]

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground/60 mt-4 text-balance">Answers for those who hesitate.</p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-dashed">
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <p className="text-muted-foreground/60 mt-6 px-8">
                        Can't find what you're looking for? Contact our{' '}
                        <Link
                            href="#"
                            className="text-primary font-medium hover:underline">
                            support team
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}




interface Feature42Props {
    className?: string;
}

const Feature42 = ({ className }: Feature42Props) => {
    return (
        <section className={cn("py-16 bg-background hidden", className)}>
            <div className="container w-full mx-auto">
                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="col-span-2">
                        <h2 className="row-span-2 text-3xl font-medium lg:text-5xl">
                            Philosophy
                        </h2>
                        <div className="grid grid-cols-2 gap-8 mt-12 ">
                            <div>
                                <h3 className="mb-2 text-xl font-medium">Structure</h3>
                                <p className="text-muted-foreground/60">
                                   Discipline is submission to rules you set when rational.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-2 text-xl font-medium">Enforcement</h3>
                                <p className="text-muted-foreground/60">
                                    Without consequence, intention is just theatre.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-2 text-xl font-medium">Truth</h3>
                                <p className="text-muted-foreground/60">
                                    The system records what you try to hide.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-2 text-xl font-medium">Identity</h3>
                                <p className="text-muted-foreground/60">
                                    Change is a pattern shift, not a feeling.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};







interface Stats6Props {
    className?: string;
}

const Stats6 = ({ className }: Stats6Props) => {
    return (
        <section className={cn(" ", className)}>
            <div className="container flex flex-col items-start text-left">
                <div className="mb-12 w-full md:mb-16">
                    <h2 className="w-full max-w-[24rem] text-3xl font-bold text-pretty leading-normal sm:text-4xl md:max-w-[30rem] lg:max-w-[37rem] lg:text-5xl">
                        Enforcement Stats
                    </h2>
                    {/* <div className="flex flex-col justify-start gap-2 sm:flex-row">
            <Button className="w-full sm:w-auto">Get Started</Button>
            <Button varian t="outline" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div> */}
                </div>
                <div className="grid w-full grid-cols-2 md:grid-cols-4 gap-12 sm:w-fit  items-center lg:gap-16">
                    <div className="w-full">
                        <div className="mb-2 text-4xl font-medium sm:text-4xl lg:text-5xl">
                            100%
                        </div>
                        <div className="text-base leading-6 text-muted-foreground lg:text-lg">
                            Compliance
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="mb-2 text-4xl font-medium sm:text-4xl lg:text-5xl">
                            0
                        </div>
                        <div className="text-base leading-6 text-muted-foreground lg:text-lg">
                            Negotiations
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="mb-2 text-4xl font-medium sm:text-4xl lg:text-5xl">
                            24/7
                        </div>
                        <div className="text-base leading-6 text-muted-foreground lg:text-lg">
                            Monitoring
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="mb-2 text-4xl font-medium sm:text-4xl lg:text-5xl">
                            1
                        </div>
                        <div className="text-base leading-6 text-muted-foreground lg:text-lg">
                            Authority
                        </div>
                    </div>
                </div>
            </div>
        </section>
        //      <CardSpotlight >
        // </CardSpotlight>

    );
};


interface Feature {
    title: string;
    description: string;
    image: string;
}

interface Feature166Props {
    title?: string;
    description?: string;
    feature1?: Feature;
    feature2?: Feature;
    feature3?: Feature;
    feature4?: Feature;
    className?: string;
}

const Feature166 = ({
    title = "The Enforcers",
    description = "Every feature exists to close a loophole. Every screen answers one question only: did you obey or not.",
    feature1 = {
        title: "Immutable Time Blocks",
        description:
            "Time is segmented into immutable blocks. Once locked, they are law. Editing them mid-day is treated as failure.",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    },
    feature2 = {
        title: "Violation Logging",
        description:
            "Violations are first-class data. Each violation triggers deterministic consequences.",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
    },
    feature3 = {
        title: "Vertical Accountability",
        description:
            "Accountability is vertical, not horizontal-between you and the system, not you and a crowd.",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
    },
    feature4 = {
        title: "Memory Collapse",
        description:
            "Hourly check-ins exist to collapse memory gaps.",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-4.svg",
    },
    className,
}: Feature166Props) => {
    return (
        <section className={cn("py-16 bg-background", className)}>
            <div className="container w-full mx-auto">
                {/* <div className="mb-24 flex flex-col items-center gap-6">
                    <h1 className="text-center text-3xl font-medium lg:max-w-3xl lg:text-5xl">
                        {title}
                    </h1>
                    <p className="text-center text-lg font-medium text-muted-foreground md:max-w-4xl lg:text-xl">
                        {description}
                    </p>
                </div> */}
                <div className="relative flex justify-center">
                    <div className="border-muted2 relative flex w-full flex-col border md:w-1/2 lg:w-full">
                        <div className="relative flex flex-col lg:flex-row">
                            <div className="border-muted2 flex flex-col justify-between border-b border-solid p-10 lg:w-3/5 lg:border-r lg:border-b-0">
                                <h2 className="text-xl font-medium">{feature1.title}</h2>
                                <p className="text-muted-foreground/60">{feature1.description}</p>
                                <img
                                    src={feature1.image}
                                    alt={feature1.title}
                                    className="mt-8 aspect-[1.5] h-full w-full object-cover lg:aspect-[2.4]"
                                />
                            </div>
                            <div className="flex flex-col justify-between p-10 lg:w-2/5">
                                <h2 className="text-xl font-medium">{feature2.title}</h2>
                                <p className="text-muted-foreground/60">{feature2.description}</p>
                                <img
                                    src={feature2.image}
                                    alt={feature2.title}
                                    className="mt-8 aspect-[1.45] h-full w-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="border-muted2 relative flex flex-col border-t border-solid lg:flex-row">
                            <div className="border-muted2 flex flex-col justify-between border-b border-solid p-10 lg:w-2/5 lg:border-r lg:border-b-0">
                                <h2 className="text-xl font-medium">{feature3.title}</h2>
                                <p className="text-muted-foreground/60">{feature3.description}</p>
                                <img
                                    src={feature3.image}
                                    alt={feature3.title}
                                    className="mt-8 aspect-[1.45] h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-between p-10 lg:w-3/5">
                                {/* <h2 className="text-xl font-medium">{feature4.title}</h2>
                                <p className="text-muted-foreground/60">{feature4.description}</p>
                                <img
                                    src={feature4.image}
                                    alt={feature4.title}
                                    className="mt-8 aspect-[1.5] h-full w-full object-cover lg:aspect-[2.4]"
                                /> */}
                                <Stats6 />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

interface PhoneFeaturePreviewPhotoProps {
    badge?: string;
    heading?: string;
    description?: string;
    buttons?: {
        primary?: {
            text: string;
            url: string;
        };
        secondary?: {
            text: string;
            url: string;
        };
    };
    image?: {
        src: string;
        alt: string;
    };
    className?: string;
}

const PhoneFeaturePreviewPhoto = ({
    badge = "Bird’s-Eye Life Tracking",
    heading = "Discipline is not motivation",
    description = "It is submission to rules you set when you were rational, enforced when you are weak. This app treats your excuses as noise.",
    buttons = {
        primary: {
            text: "Start Tracking",
            url: "/login",
        },
        secondary: {
            text: "Read Philosophy",
            url: "/philosophy",
        },
    },
    image = {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
        alt: "Interface showing strict time blocks and violation logs",
    },
    className,
}: PhoneFeaturePreviewPhotoProps) => {
    return (
        <section className={cn("py-16 bg-background", className)}>
            <div className="container w-full mx-auto">
                <div className="grid items-center gap-6 lg:grid-cols-3 lg:gap-12">
                    <div className="col-span-2"><Feature42 /></div>
                    <div className="gap-5 flex flex-col items-center text-center lg:items-start lg:text-left">
            {badge && (
              <Badge variant="outline">
                {badge}
              </Badge>
            )}
            <h1 className="text-4xl font-bold text-pretty lg:text-6xl">
              {heading}
            </h1>
            <p className="max-w-xl text-muted-foreground lg:text-xl">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button size="lg" render={<a href={buttons.primary.url} />}>
                    {buttons.primary.text}
                </Button>
              )}
              {buttons.secondary && (
                <Button variant="outline" size="lg" render={<a href={buttons.secondary.url} />}>
                    {buttons.secondary.text}
                    {/* <ArrowRight className="size-4" /> */}
                </Button>
              )}
            </div>
          </div>
                    <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full rounded-md object-cover aspect-video"
                    />
                </div>
            </div>
        </section>
    );
};



const defaultTestimonials = [
    {
        name: "J.R.",
        role: "Former Negotiator",
        avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
        content:
            "I used to negotiate with my alarm clock every morning. Now I don't. The system removed the option.",
    },
    {
        name: "Marcus T.",
        role: "Disciplined",
        avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
        content:
            "This app doesn't care if I'm tired. It just logs the failure. That clarity changed everything.",
    },
    {
        name: "Emily W.",
        role: "Focused",
        avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-7.webp",
        content:
            "No badges. No confetti. Just the cold hard truth of my adherence rate. It's the only thing that works.",
    },
    {
        name: "David K.",
        role: "Executor",
        avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
        content:
            "I thought I needed motivation. I needed consequences. This app provided them.",
    },
    {
        name: "Sarah L.",
        role: "Builder",
        avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
        content:
            "The hourly check-ins are annoying. That's the point. They stop me from drifting.",
    },
    {
        name: "Alex J.",
        role: "Convert",
        avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
        content:
            "Finally, an app that treats me like an adult who needs to get work done, not a child whoneeds a treat.",
    },
];

interface Testimonial8Props {
    testimonials?: Array<{
        name: string;
        role: string;
        avatar: string;
        content: string;
    }>;
    className?: string;
}

const Testimonial8 = ({
    testimonials = defaultTestimonials,
    className,
}: Testimonial8Props) => {
    return (
        <section className={cn("py-16", className)}>
            <div className="container w-full mx-auto">
                <div className="flex flex-col items-center gap-4">
                    <h2 className="text-center text-3xl font-semibold lg:text-5xl">
                        What Our Clients Say
                    </h2>
                    <p className="text-muted-foreground lg:text-xl">
                        Discover how our customers are using our products to build their
                        businesses
                    </p>
                </div>
                <div className="relative mt-14 w-full after:absolute after:inset-x-0 after:-bottom-2 after:h-96 after:bg-linear-to-t after:from-background">
                    <div
                        className="columns-1 gap-5 md:columns-2 lg:columns-3"
                        style={{ columnGap: "20px" }}
                    >
                        {testimonials.map((testimonial, idx) => {
                            // Reorder for masonry flow: distribute across columns first
                            const displayIdx = (idx % 3) * 3 + Math.floor(idx / 3);

                            return (
                                <div
                                    key={idx}
                                    className={cn(
                                        "mb-5",
                                        displayIdx > 3 && displayIdx <= 5 && "hidden md:block",
                                        displayIdx > 5 && "hidden lg:block",
                                    )}
                                >
                                    <Card className="break-inside-avoid p-5">
                                        <div className="flex gap-4 leading-5">
                                            <Avatar className="size-10 rounded-full ring-1 ring-input">
                                                <AvatarImage
                                                    src={testimonial.avatar}
                                                    alt={testimonial.name}
                                                />
                                            </Avatar>
                                            <div className="mb-2 text-sm">
                                                <p className="font-semibold text-foreground">
                                                    {testimonial.name}
                                                </p>
                                                <p className="text-muted-foreground">
                                                    {testimonial.role}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="leading-7 text-foreground/60">
                                            <q>{testimonial.content}</q>
                                        </div>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export {
    Testimonial8,
    Gallery6, Community1, PhoneFeaturePreviewPhoto
    , Cta10
    , Stats6
    , Feature42, Feature166, FAQsTwo
};
export default function LandingPage() {
    return (
        <>




            {/* - header */}
            {/* - hero tailart gradient */}
            <HeroSection />

            <section className="px-8">
                {/* - 4 section [] mobile preview */}
                <PhoneFeaturePreviewPhoto />

                {/* - feature bento gallery + stats */}
                <Feature166 />               {/* <Gallery6 /> */}


                <Testimonial8 />



                <section className="flex items-center justify-around" >
                    <div className="bg-secondary/20  rounded-2xl flex flex-col">
                        <Community1 />
                        <Separator className={'max-w-1/2 mx-auto '} />
                        <Cta10 />
                    </div>
                    <FAQsTwo />
                </section>


            </section>

        </>
    )
}
