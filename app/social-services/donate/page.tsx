import PageHero from "@/components/layout/PageHero";
import DonateForm from "@/components/interactive/DonateForm";
import SuccessStoriesCarousel from "@/components/home/SuccessStoriesCarousel";
import JsonLd from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";

export const metadata = pageMeta(
  "Donate to Alvasatiya | Support Quran Education, Orphans and Families",
  "Support Alvasatiya's mission of Islamic education, student welfare, orphan care, food assistance and community services. Online payment is prepared for future gateway integration.",
  "/social-services/donate"
);

export default function Page() {
  return (
    <>
      <JsonLd data={serviceSchema("Donations", "Support Islamic education, students, orphans, families and community welfare through Alvasatiya.", "/social-services/donate")} />
      <PageHero eyebrow="Social Services" title="Support Alvasatiya's Mission" description="Give toward Islamic education, students, orphans, poor families, food assistance, community services, educational projects, and welfare initiatives." />
      <SuccessStoriesCarousel />
      <section className="section-container py-12"><DonateForm /></section>
    </>
  );
}
