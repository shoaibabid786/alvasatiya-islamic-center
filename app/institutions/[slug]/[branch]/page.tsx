import { notFound } from "next/navigation";
import InstitutionDetail from "@/components/templates/InstitutionDetail";
import JsonLd from "@/components/seo/JsonLd";
import { TEHFEEZ_SLUG } from "@/data/institutions";
import { branchParamToSlug, getPublishedInstitution } from "@/lib/institutions";
import { pageMeta } from "@/lib/seo";
import { educationalOrgSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return [1, 2, 3, 4, 5].map((n) => ({ slug: TEHFEEZ_SLUG, branch: `branch-${n}` }));
}

export async function generateMetadata({ params }: PageProps<"/institutions/[slug]/[branch]">) {
  const { branch } = await params;
  const item = getPublishedInstitution(branchParamToSlug(branch) || "");
  if (!item) return pageMeta("Hifz Branch", "Alvasatiya Tehfeez-ul-Quran", `/institutions/${TEHFEEZ_SLUG}`);
  return pageMeta(`${item.title} | Hifz-ul-Quran`, item.summary, item.href);
}

export default async function Page({ params }: PageProps<"/institutions/[slug]/[branch]">) {
  const { slug, branch } = await params;
  if (slug !== TEHFEEZ_SLUG) notFound();
  const item = getPublishedInstitution(branchParamToSlug(branch) || "");
  if (!item) notFound();
  return (
    <>
      <JsonLd data={educationalOrgSchema(item.title, item.summary, item.href, item.location, item.students)} />
      <InstitutionDetail institution={item} />
    </>
  );
}
