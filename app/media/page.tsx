import PageHero from "@/components/layout/PageHero";
import MediaLibrary from "@/components/interactive/MediaLibrary";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Islamic Media Library | Videos, Audio, Recitation and Photo Gallery",
  "Search Alvasatiya's full media library for videos, audio, Quran recitation, lectures, talks and photo gallery items.",
  "/media"
);

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Media" title="Islamic Media" description="Search and filter videos, audio, recitation, lectures, talks, and photos." />
      <section className="section-container py-12"><MediaLibrary /></section>
    </>
  );
}
