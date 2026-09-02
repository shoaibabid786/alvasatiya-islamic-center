import type { Metadata } from "next";
import { SITE } from "@/data/site";

type Options = {
  index?: boolean;
  ogType?: "website" | "article";
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  publishedTime?: string;
};

export function pageMeta(
  title: string,
  description: string,
  path = "/",
  options: Options = {}
): Metadata {
  const url = `${SITE.url}${path}`;
  const fullTitle = path === "/" ? title : `${title} | ${SITE.name}`;
  const image = options.image ?? SITE.logo;
  const imageAlt = options.imageAlt ?? `${SITE.name} official logo`;
  const index = options.index ?? true;
  const keywords = options.keywords ?? [
    "Alvasatiya Islamic Center",
    "Quran learning Lahore",
    "Islamic education Pakistan",
    "Islamic courses",
    "community welfare",
  ];
  return {
    title: { absolute: fullTitle },
    description,
    keywords,
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    publisher: SITE.name,
    category: "Education",
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
      : { index: false, follow: false },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      locale: "en_US",
      type: options.ogType ?? "website",
      images: [{ url: image, alt: imageAlt }],
      ...(options.publishedTime ? { publishedTime: options.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
