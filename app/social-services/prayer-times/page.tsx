import PageHero from "@/components/layout/PageHero";
import PrayerTimesView from "@/components/interactive/PrayerTimesView";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Prayer Times | Fajr, Dhuhr, Asr, Maghrib and Isha",
  "Check daily prayer times by city with calculation method, Hanafi or standard Asr, countdown to the next prayer, and a monthly timetable.",
  "/social-services/prayer-times"
);

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Social Services" title="Prayer Times" description="A calm timetable with city search, calculation method, Asr setting, and date navigation." />
      <section className="section-container py-12"><PrayerTimesView /></section>
    </>
  );
}
