import HomePage from "@/components/home/HomePage";
import JsonLd from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { eventSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export const metadata = pageMeta(
  "Alvasatiya Islamic Center | Quran Learning, Islamic Education & Community Service",
  "Read the Holy Quran, join Islamic courses, explore welfare services, Fatwa Q&A, Hajj guidance and prayer times at Alvasatiya Islamic Center in Lahore.",
  "/",
  { image: "/images/hero/alvasatiya.png", imageAlt: "Mosque architecture representing Alvasatiya Islamic Center" }
);

export default function Page() {
  return (
    <>
      <JsonLd data={eventSchema()} />
      <HomePage />
    </>
  );
}
