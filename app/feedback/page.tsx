import PageHero from "@/components/layout/PageHero";
import FeedbackForm from "@/components/interactive/FeedbackForm";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Share Feedback | Help Improve Alvasatiya Services",
  "Send feedback to help Alvasatiya Islamic Center improve its educational programs, community services and website experience.",
  "/feedback"
);

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Feedback"
        title="Your Feedback Matters"
        description="Help Alvasatiya Islamic Center improve its services and educational experience."
      />
      <section className="section-container py-12">
        <FeedbackForm />
      </section>
    </>
  );
}
