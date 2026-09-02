import PageHero from "@/components/layout/PageHero";
import FatwaClient from "@/components/interactive/FatwaClient";
import JsonLd from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";

export const metadata = pageMeta(
  "Fatwa Q&A | Ask an Educational Islamic Question",
  "Submit a question for review and read previously answered educational fatwas. Personal and complex matters should be referred to qualified scholars.",
  "/social-services/fatwa-qa"
);

export default function Page() {
  return (
    <>
      <JsonLd data={serviceSchema("Fatwa Q&A", "Educational Islamic questions and previously published answers.", "/social-services/fatwa-qa")} />
      <PageHero eyebrow="Social Services" title="Fatwa Q&A" description="Educational answers with a clear disclaimer: personal and complex matters belong with qualified scholars." />
      <section className="section-container py-12"><FatwaClient /></section>
    </>
  );
}
