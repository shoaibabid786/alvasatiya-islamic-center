import Link from "next/link";
import WhatWeProvideSection from "@/components/home/WhatWeProvideSection";
import SuccessStoriesCarousel from "@/components/home/SuccessStoriesCarousel";
import PageHero from "@/components/layout/PageHero";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "What We Provide | Free Islamic Education, Meals and Support for Eligible Students",
  "Alvasatiya provides Islamic and modern education. Eligible poor and orphan students may receive education, accommodation, and meals free of cost.",
  "/what-we-provide"
);

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Mission"
        title="What We Provide"
        description="Accessible education and community support — with dignity for every eligible student."
      />
      <section className="section-container pt-10 max-w-3xl">
        <p className="text-muted">
          The Center's purpose is that a sincere student is not turned away only because of poverty. Eligible poor and orphan students can receive education, and where the office approves it, accommodation and three meals a day, free of cost. Support is case-by-case and confirmed by the administration.
        </p>
      </section>
      <WhatWeProvideSection showLearnMore={false} />
      <SuccessStoriesCarousel showDonate />
      <section className="section-container pb-16 flex flex-wrap gap-3">
        <Link href="/institutions" className="btn btn-outline">Our institutions</Link>
        <Link href="/contact" className="btn btn-green">Ask about eligibility</Link>
      </section>
    </>
  );
}
