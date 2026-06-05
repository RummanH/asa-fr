import type { Metadata } from "next";
import { HomePage } from "@/components/landing/HomePage";

const homeTitle = "Al Asatizah | Find Qualified Teachers Faster";
const homeDescription =
  "Al Asatizah helps institutions find teachers and helps teachers find khidmah opportunities.";
const homeKeywords = [
  "teacher hiring platform",
  "hire teachers",
  "teacher recruitment platform",
  "education jobs marketplace",
  "school teacher hiring",
  "online tutor hiring",
  "teacher job portal",
  "institution hiring teachers",
];
const homeUrl = "https://teacherhiring.app/";
const ogImage = "https://teacherhiring.app/landing-hero-main-v2.png";

export const metadata: Metadata = {
  title: {
    absolute: homeTitle,
  },
  description: homeDescription,
  keywords: homeKeywords,
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    title: homeTitle,
    description: homeDescription,
    url: homeUrl,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Al Asatizah landing page preview",
      },
    ],
  },
  twitter: {
    title: homeTitle,
    description: homeDescription,
    images: [ogImage],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${homeUrl}#website`,
      url: homeUrl,
      name: "Al Asatizah",
      description: homeDescription,
      inLanguage: "en-US",
      publisher: {
        "@id": `${homeUrl}#organization`,
      },
    },
    {
      "@type": "Organization",
      "@id": `${homeUrl}#organization`,
      name: "Al Asatizah",
      url: homeUrl,
      logo: "https://teacherhiring.app/icon.png",
    },
    {
      "@type": "Service",
      "@id": `${homeUrl}#service`,
      serviceType: "Education hiring marketplace",
      name: "Al Asatizah",
      description: homeDescription,
      provider: {
        "@id": `${homeUrl}#organization`,
      },
      areaServed: "Worldwide",
      audience: [
        {
          "@type": "Audience",
          audienceType: "Teachers",
        },
        {
          "@type": "Audience",
          audienceType: "Schools and educational institutions",
        },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePage />
    </>
  );
}
