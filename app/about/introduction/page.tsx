import PageHero from "@/components/layout/PageHero";
import { aboutIntro } from "@/data/about";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Introduction to Alvasatiya | Knowledge, Faith and Service",
  "Who Alvasatiya Islamic Center is, why it exists, and how Quran education, faith and community service belong together.",
  "/about/introduction"
);

export default function Page() {
  return (
    <>
      <PageHero eyebrow="About Us" title={aboutIntro.title} description="Who we are, why we exist, and the values that guide our work." />
      <section className="section-container py-12 max-w-3xl prose-islamic">
        {aboutIntro.paragraphs.map((p) => <p key={p} className="mb-5">{p}</p>)}
      </section>
    </>
  );
}
