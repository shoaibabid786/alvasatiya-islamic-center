import PageHero from "@/components/layout/PageHero";
import BlogsClient from "@/components/interactive/BlogsClient";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Islamic Blogs | Articles on Quran, Worship, Character and Family",
  "Read featured and latest Islamic articles from Alvasatiya on Quran, worship, character, family life and community.",
  "/islamic-services/islamic-blogs"
);

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Islamic Services" title="Islamic Blogs" description="Articles on Quran, worship, character, family, and community." />
      <section className="section-container py-12"><BlogsClient /></section>
    </>
  );
}
