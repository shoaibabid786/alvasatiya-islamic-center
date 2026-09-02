import DemoForm from "@/components/academy/DemoForm";
import { getPublishedCourses } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMeta(
  "Book a Free Demo | Alvasatiya Islamic Courses",
  "Request a free demo class with Alvasatiya Islamic Center. Share your preferred time and our team will contact you shortly.",
  "/demo"
);

export default async function Page({ searchParams }: PageProps<"/demo">) {
  const catalog = getPublishedCourses();
  const params = await searchParams;
  const preset = typeof params.course === "string" ? params.course : "";
  return (
    <section className="section-container py-12">
      <p className="section-eyebrow">Free demo</p>
      <h1 className="section-title">Book a Free Demo</h1>
      <p className="section-desc mt-3 mb-8">
        Tell us the course and a preferred time. After submission you will see a confirmation, and Admin can approve, reject, or schedule the demo.
      </p>
      <DemoForm courses={catalog} presetSlug={preset} />
    </section>
  );
}
