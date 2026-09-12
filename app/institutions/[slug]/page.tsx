import { notFound, redirect } from "next/navigation";
import InstitutionDetail from "@/components/templates/InstitutionDetail";
import JsonLd from "@/components/seo/JsonLd";
import { institutions } from "@/data/institutions";
import { getPublishedInstitution } from "@/lib/institutions";
import { pageMeta } from "@/lib/seo";
import { educationalOrgSchema, faqSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return institutions
    .filter((item) => item.kind !== "branch" && item.slug !== "alvasatiya-it-lab")
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps<"/institutions/[slug]">) {
  const { slug } = await params;
  const item = getPublishedInstitution(slug);
  if (!item) return pageMeta("Institution", "Alvasatiya institution", "/institutions");
  return pageMeta(`${item.title} | ${item.eyebrow}`, item.summary, item.href);
}

export default async function Page({ params }: PageProps<"/institutions/[slug]">) {
  const { slug } = await params;
  if (slug === "alvasatiya-it-lab" || slug === "ths-it-lab") redirect("/institutions/ths-it-lab");
  const item = getPublishedInstitution(slug);
  if (!item || item.kind === "branch") notFound();
  return (
    <>
      <JsonLd
        data={[
          educationalOrgSchema(item.title, item.summary, item.href, item.location, item.students),
          faqSchema([
            { q: "Where is this institution?", a: item.location },
            { q: "How do I apply?", a: item.admissions },
          ]),
        ]}
      />
      <InstitutionDetail institution={item} />
    </>
  );
}
