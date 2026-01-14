"use client";

import { cn } from "@/lib/utils";
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
        <section className={cn("py-16", className)}>
            <div className="container">
                <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
                    <div>
                        <h2 className="mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
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
                            <IconBrandGithub className="size-5" />
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
                                        <IconBrandGithub className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
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
            <div className="container">
                <div className="flex flex-col items-center gap-5">
                    <img src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg" alt="logo" className="size-10" />
                    <h2 className="text-center text-3xl font-semibold">
                        Join our community
                        <br />
                        <span className="text-muted-foreground/80">
                            of designers & developers
                        </span>
                    </h2>
                    <div className="flex items-center gap-4">
                        <Button size="lg" variant="outline" asChild>
                            <a
                                href="https://x.com/shadcnblocks"
                                target="_blank"
                                className="size-10"
                            >
                                <IconBrandGithub />
                            </a>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <a
                                href="https://github.com/shadcnblocks"
                                target="_blank"
                                className="size-10"
                            >
                                <IconBrandGithub />
                            </a>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <a
                                href="https://shadcnblocks.com"
                                target="_blank"
                                className="size-10"
                            >
                                <IconBrandGithub />
                            </a> 
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};



interface Cta10Props {
    heading: string;
    description: string;
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
    heading = "Call to Action",
    description = "Build faster with our collection of pre-built blocks. Speed up your development and ship features in record time.",
    buttons = {
        primary: {
            text: "Buy Now",
            url: "https://www.shadcnblocks.com",
        },
    },
    className,
}: Cta10Props) => {
    return (
        <section className={cn("py-16", className)}>
            <div className="container">
                <div className="flex w-full flex-col gap-16 overflow-hidden rounded-lg bg-accent p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-12">
                    <div className="flex-1">
                        <h3 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
                            {heading}
                        </h3>
                        <p className="max-w-xl text-muted-foreground lg:text-lg">
                            {description}
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        {buttons.secondary && (
                            <Button variant="outline" asChild>
                                <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
                            </Button>
                        )}
                        {buttons.primary && (
                            <Button asChild variant="default" size="lg">
                                <a href={buttons.primary.url}>{buttons.primary.text}</a>
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

  function FAQsTwo() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How long does shipping take?',
            answer: 'Standard shipping takes 3-5 business days, depending on your location. Express shipping options are available at checkout for 1-2 business day delivery.',
        },
        {
            id: 'item-2',
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. For enterprise customers, we also offer invoicing options.',
        },
        {
            id: 'item-3',
            question: 'Can I change or cancel my order?',
            answer: 'You can modify or cancel your order within 1 hour of placing it. After this window, please contact our customer support team who will assist you with any changes.',
        },
        {
            id: 'item-4',
            question: 'Do you ship internationally?',
            answer: "Yes, we ship to over 50 countries worldwide. International shipping typically takes 7-14 business days. Additional customs fees may apply depending on your country's import regulations.",
        },
        {
            id: 'item-5',
            question: 'What is your return policy?',
            answer: 'We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some specialty items may have different return terms, which will be noted on the product page.',
        },
    ]

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground mt-4 text-balance">Discover quick and comprehensive answers to common questions about our platform, services, and features.</p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="single"
                        collapsible
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

                    <p className="text-muted-foreground mt-6 px-8">
                        Can't find what you're looking for? Contact our{' '}
                        <Link
                            href="#"
                            className="text-primary font-medium hover:underline">
                            customer support team
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}


interface Stats8Props {
    className?: string;
    heading?: string;
    description?: string;
    link?: {
        text: string;
        url: string;
    };
    stats?: Array<{
        id: string;
        value: string;
        label: string;
    }>;
}

const Stats8 = ({
    heading = "Platform performance insights",
    description = "Ensuring stability and scalability for all users",
    link = {
        text: "Read the full impact report",
        url: "https://www.shadcnblocks.com",
    },
    stats = [
        {
            id: "stat-1",
            value: "250%+",
            label: "average growth in user engagement",
        },
        {
            id: "stat-2",
            value: "$2.5m",
            label: "annual savings per enterprise partner",
        },
        {
            id: "stat-3",
            value: "200+",
            label: "integrations with top industry platforms",
        },
        {
            id: "stat-4",
            value: "99.9%",
            label: "customer satisfaction over the last year",
        },
    ],
    className,
}: Stats8Props) => {
    return (
        <section className={cn("py-16", className)}>
            <div className="container">
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold md:text-4xl">{heading}</h2>
                    <p>{description}</p>
                    <a
                        href={link.url}
                        className="flex items-center gap-1 font-bold hover:underline"
                    >
                        {link.text}
                        <IconBrandGithub className="h-auto w-4" />
                    </a>
                </div>
                <div className="mt-14 grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.id} className="flex flex-col gap-5">
                            <div className="text-6xl font-bold">{stat.value}</div>
                            <p>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};



interface Feature42Props {
    className?: string;
}

const Feature42 = ({ className }: Feature42Props) => {
    return (
        <section className={cn("py-16", className)}>
            <div className="container">
                <div className="grid gap-8 lg:grid-cols-3">
                    <h2 className="row-span-2 text-3xl font-semibold lg:text-5xl">
                        Our Values and Principles
                    </h2>
                    <div>
                        <h3 className="mb-2 text-xl font-medium">Team Spirit</h3>
                        <p className="text-muted-foreground">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
                            architecto atque consequuntur perferendis ratione dolorem vitae,
                            doloribus facere.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-xl font-medium">Innovation</h3>
                        <p className="text-muted-foreground">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
                            architecto atque consequuntur perferendis ratione dolorem vitae,
                            doloribus facere.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-xl font-medium">Quality</h3>
                        <p className="text-muted-foreground">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
                            architecto atque consequuntur perferendis ratione dolorem vitae,
                            doloribus facere.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-xl font-medium">Integrity</h3>
                        <p className="text-muted-foreground">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
                            architecto atque consequuntur perferendis ratione dolorem vitae,
                            doloribus facere.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};












interface Feature {
    title: string;
    description: string;
    image: string;
}

interface Feature166Props {
    title: string;
    description: string;
    feature1: Feature;
    feature2: Feature;
    feature3: Feature;
    feature4: Feature;
    className?: string;
}

const Feature166 = ({
    title = "Blocks built with Shadcn & Tailwind",
    description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
    feature1 = {
        title: "UI/UX Design",
        description:
            "Creating intuitive user experiences with modern interface design principles and user-centered methodologies.",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    },
    feature2 = {
        title: "Responsive Development",
        description:
            "Building websites that look and function perfectly across all devices and screen sizes.",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
    },
    feature3 = {
        title: "Brand Integration",
        description:
            "Seamlessly incorporating your brand identity into every aspect of your website's design.",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
    },
    feature4 = {
        title: "Performance Optimization",
        description:
            "Ensuring fast loading times and smooth performance through optimized code and assets.",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-4.svg",
    },
    className,
}: Feature166Props) => {
    return (
        <section className={cn("py-16", className)}>
            <div className="container">
                {/* <div className="mb-24 flex flex-col items-center gap-6">
                    <h1 className="text-center text-3xl font-semibold lg:max-w-3xl lg:text-5xl">
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
                                <h2 className="text-xl font-semibold">{feature1.title}</h2>
                                <p className="text-muted-foreground">{feature1.description}</p>
                                <img
                                    src={feature1.image}
                                    alt={feature1.title}
                                    className="mt-8 aspect-[1.5] h-full w-full object-cover lg:aspect-[2.4]"
                                />
                            </div>
                            <div className="flex flex-col justify-between p-10 lg:w-2/5">
                                <h2 className="text-xl font-semibold">{feature2.title}</h2>
                                <p className="text-muted-foreground">{feature2.description}</p>
                                <img
                                    src={feature2.image}
                                    alt={feature2.title}
                                    className="mt-8 aspect-[1.45] h-full w-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="border-muted2 relative flex flex-col border-t border-solid lg:flex-row">
                            <div className="border-muted2 flex flex-col justify-between border-b border-solid p-10 lg:w-2/5 lg:border-r lg:border-b-0">
                                <h2 className="text-xl font-semibold">{feature3.title}</h2>
                                <p className="text-muted-foreground">{feature3.description}</p>
                                <img
                                    src={feature3.image}
                                    alt={feature3.title}
                                    className="mt-8 aspect-[1.45] h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-between p-10 lg:w-3/5">
                                <h2 className="text-xl font-semibold">{feature4.title}</h2>
                                <p className="text-muted-foreground">{feature4.description}</p>
                                <img
                                    src={feature4.image}
                                    alt={feature4.title}
                                    className="mt-8 aspect-[1.5] h-full w-full object-cover lg:aspect-[2.4]"
                                />
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
  heading: string;
  description: string;
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
  image: {
    src: string;
    alt: string;
  };
  className?: string;
}

const PhoneFeaturePreviewPhoto = ({
  badge = "Your Website Builder",
  heading = "Blocks Built With Shadcn & Tailwind",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  buttons = {
    primary: {
      text: "Discover all components",
      url: "https://www.shadcnblocks.com",
    },
    secondary: {
      text: "View on GitHub",
      url: "https://www.shadcnblocks.com",
    },
  },
  image = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    alt: "Hero section demo image showing interface components",
  },
  className,
}: PhoneFeaturePreviewPhotoProps) => {
  return (
    <section className={cn("py-16", className)}>
      <div className="container">
      <div className="grid items-center gap-6 lg:grid-cols-3 lg:gap-12">
        <div className="col-span-2"><Feature42/></div>
          {/* <div className="gap-5 flex flex-col items-center text-center lg:items-start lg:text-left">
            {badge && (
              <Badge variant="outline">
                {badge}
                <ArrowUpRight className="ml-2 size-4" />
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
                <Button asChild className="w-full sm:w-auto">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={buttons.secondary.url}>
                    {buttons.secondary.text}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              )}
            </div>
          </div> */}
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
 
export {
    Gallery6, Community1,PhoneFeaturePreviewPhoto
    , Cta10
    , Stats8
    , Feature42, Feature166,FAQsTwo
};
export default function LandingPage() {
    return (
        <>


          
        
            {/* - header */}
            {/* - hero tailart gradient */}
            <HeroSection/>
            {/* - 4 section [] mobile preview */}
            <PhoneFeaturePreviewPhoto/>
          
            {/* - feature */}
            {/* - bento gallery */}
            <Feature166/>
            {/* - testimonial */}
            
            {/* - stats */}
            <Stats8/>
            {/* - faq */}
            <FAQsTwo/>
            {/* - cta */}
            <Cta10/>
            {/* - footer */}
 <Gallery6/>

            <Community1/>
         
        </>
    )
}
