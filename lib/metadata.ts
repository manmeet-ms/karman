import { Metadata } from 'next';

/**
 * Constructs a Next.js Metadata object for SEO and page titles.
 * Formats title as "Drona - [Page Name]".
 * @param title The page title (without the "Drona - " prefix)
 * @param description The page description
 */
export function constructMetadata({
  title ="Karman — Personal Governance & Discipline System",
  description = "Karman is a personal governance system that enforces discipline through immutable schedules, behavior tracking, violations, and consequences. No motivation. No excuses. Only recorded action and enforced accountability.",
  image = "/thumbnail.png",
  icons = "/logo.svg",
  noIndex = false
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const fullTitle = title ? `${title}` : "A self-enforcement platform designed to eliminate self-deception. Karman tracks timeblocks, logs behavior, detects violations, and applies consequences automatically to build real discipline through structure and pressure.";

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description:"A strict accountability system built to enforce discipline when willpower fails. Immutable timeblocks, violations, penalties, and behavioral records. No comfort. Only compliance.",
      images: [
        {
          url: image
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    icons,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://karman-akf.vercel.app'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}
