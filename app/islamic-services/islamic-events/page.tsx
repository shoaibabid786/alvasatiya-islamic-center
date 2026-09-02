import PageHero from "@/components/layout/PageHero";
import EventsClient from "@/components/interactive/EventsClient";
import JsonLd from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { eventSchema } from "@/lib/schema";

export const metadata = pageMeta(
  "Islamic Events | Classes, Gatherings and Community Programs",
  "Upcoming and past Alvasatiya events with dates, locations and registration details for Quran classes, educational programs and community gatherings.",
  "/islamic-services/islamic-events"
);

export default function Page() {
  return (
    <>
      <JsonLd data={eventSchema()} />
      <PageHero eyebrow="Islamic Services" title="Islamic Events" description="A calendar of community gatherings, classes, and educational programs." />
      <section className="section-container py-12"><EventsClient /></section>
    </>
  );
}
