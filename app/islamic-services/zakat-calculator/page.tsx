import PageHero from "@/components/layout/PageHero";
import ZakatCalculator from "@/components/interactive/ZakatCalculator";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Zakat Calculator | Educational Estimate of Zakatable Wealth",
  "Estimate zakatable wealth, nisab references and Zakat with educational guidance. Confirm personal cases with a qualified scholar.",
  "/islamic-services/zakat-calculator"
);

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Islamic Services" title="Zakat Calculator" description="An educational estimate of eligible wealth and Zakat. Confirm personal cases with a qualified scholar." />
      <section className="section-container py-12"><ZakatCalculator /></section>
    </>
  );
}
