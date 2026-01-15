import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface AboutProps {
  className?: string;
  title: string;
  description?: string;
  mainImage: {
    src: string;
    alt: string;
  };
  secondaryImage: {
    src: string;
    alt: string;
  };
  breakout: {
    src?: string;
    alt?: string;
    title: string;
    description: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companiesTitle?: string;
  companies?: Array<{
    src: string;
    alt: string;
  }> | null;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{
    label: string;
    value: string;
  }>;
}

const About = ({ className, ...props }: AboutProps) => {
  const {
    title,
    description,
    mainImage,
    secondaryImage,
    breakout,
    companiesTitle,
    companies,
    achievementsTitle,
    achievementsDescription,
    achievements,
  } = { ...defaultProps, ...props };
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mb-14 grid gap-5 text-center md:grid-cols-2 md:text-left">
          <h1 className="text-5xl font-semibold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="grid gap-7 lg:grid-cols-3">
          <img
            src={mainImage.src}
            alt={mainImage.alt}
            className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
          />
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="flex flex-col justify-between gap-6 rounded-xl bg-muted p-7 md:w-1/2 lg:w-auto">
              <img
                src={breakout.src}
                alt={breakout.alt}
                className="mr-auto h-12 dark:invert"
              />
              <div>
                <p className="mb-2 text-lg font-semibold">{breakout.title}</p>
                <p className="text-muted-foreground">{breakout.description}</p>
              </div>
              <Button variant="outline" className="mr-auto" render={<a href={breakout.buttonUrl} target="_blank" />}>
                  {breakout.buttonText}
              </Button>
            </div>
            <img
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
            />
          </div>
        </div>
        {companies && (
          <div className="py-32">
            <p className="text-center">{companiesTitle} </p>
            <div className="mt-8 flex flex-wrap justify-center gap-8">
              {companies.map((company, idx) => (
                <div
                  className="flex items-center gap-3"
                  key={company.src + idx}
                >
                  <img
                    src={company.src}
                    alt={company.alt}
                    className="h-6 w-auto md:h-8 dark:invert"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="relative my-8 overflow-hidden rounded-xl bg-muted p-7 md:p-16">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h2 className="text-3xl font-semibold md:text-4xl">
              {achievementsTitle}
            </h2>
            <p className="max-w-xl text-muted-foreground">
              {achievementsDescription}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 text-center lg:grid-cols-4">
            {achievements.map((item, idx) => (
              <div className="flex flex-col gap-2" key={item.label + idx}>
                <span className="text-4xl font-semibold md:text-5xl">
                  {item.value}
                </span>
                <p className="text-sm md:text-base">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { About };



const defaultProps = {
  title: "About Karman",
  description:
    "We are not here to motivate you. We are here to govern you.",
  mainImage: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    alt: "Structure and Order",
  },
  secondaryImage: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
    alt: "Systematic Enforcement",
  },
  breakout: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg",
    alt: "Governance Icon",
    title: "Governance over Motivation",
    description:
      "This app was built because motivation is fleeting and unreliable. Structure is permanent. We believe that change requires an external authority to enforce the rules you set for yourself.",
    buttonText: "Read the Philosophy",
    buttonUrl: "/philosophy",
  },
  companiesTitle: "This system is NOT for:",
  companies: null,
  achievementsTitle: "System Outcomes",
  achievementsDescription:
    "The only metrics that matter are compliance and consistency. Everything else is noise.",
  achievements: [
    { label: "Excuses Tolerated", value: "0" },
    { label: "Compliance Rate", value: "100%" },
    { label: "Negotiations", value: "0" },
    { label: "Mercy", value: "None" },
  ],
};


export default  About