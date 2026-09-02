import PageHero from "@/components/layout/PageHero";
import MediaLibrary from "@/components/interactive/MediaLibrary";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Islamic Media from Alvasatiya Services | Lectures and Recitations",
  "Lectures, Quran recitations, talks and educational recordings published through Alvasatiya's Islamic Services section.",
  "/islamic-services/islamic-media"
);

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Islamic Services" title="Islamic Media from Our Services" description="Lectures, recitation, talks, and educational recordings as they are published in the Islamic Services collection." />
      <section className="section-container py-12"><MediaLibrary /></section>
    </>
  );
}
