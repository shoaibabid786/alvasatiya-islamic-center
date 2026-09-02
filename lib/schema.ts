import { SITE } from "@/data/site";
import { founder } from "@/data/about";
import { events } from "@/data/events";
import type { Course } from "@/data/courses";
import type { Blog } from "@/data/blogs";
import type { Department } from "@/data/departments";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "NGO"],
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phone,
    logo: `${SITE.url}${SITE.logo}`,
    image: `${SITE.url}${SITE.logo}`,
    description: SITE.description,
    slogan: SITE.tagline,
    foundingLocation: SITE.address,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      addressLocality: "Lahore",
      addressCountry: "PK",
    },
    sameAs: [SITE.social.facebook, SITE.social.twitter].filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/quran?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: founder.name,
    jobTitle: founder.role,
    affiliation: { "@type": "Organization", name: SITE.name, url: SITE.url },
    description: founder.biography[0],
  };
}

export function articleSchema(post: Blog) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author, url: SITE.url },
    publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: `${SITE.url}${SITE.logo}` } },
    mainEntityOfPage: `${SITE.url}/islamic-services/islamic-blogs/${post.slug}`,
    inLanguage: "en",
  };
}

export function courseSchema(course: Course) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
    educationalLevel: course.level,
    timeRequired: course.duration,
    inLanguage: course.language,
    url: `${SITE.url}/courses/${course.slug}`,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: course.mode,
      instructor: { "@type": "Person", name: course.instructor },
    },
  };
}

export function serviceSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
    areaServed: "Worldwide",
    url: `${SITE.url}${path}`,
  };
}

export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function eventSchema() {
  return events.filter((e) => e.status === "upcoming").map((event) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date,
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: event.location, address: SITE.address },
    organizer: { "@type": "Organization", name: SITE.name, url: SITE.url },
  }));
}

export function departmentSchema(dept: Department) {
  return serviceSchema(dept.name, dept.tagline, `/departments/${dept.slug}`);
}

export function educationalOrgSchema(
  name: string,
  description: string,
  path: string,
  area: string,
  students?: number | null
) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name,
    description,
    url: `${SITE.url}${path}`,
    parentOrganization: { "@type": "Organization", name: SITE.name, url: SITE.url },
    address: {
      "@type": "PostalAddress",
      streetAddress: area,
      addressLocality: "Lahore",
      addressCountry: "PK",
    },
    ...(typeof students === "number" ? { numberOfStudents: students } : {}),
  };
}
