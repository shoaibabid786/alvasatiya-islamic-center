import { notFound } from "next/navigation";
import DepartmentView from "@/components/templates/DepartmentView";
import JsonLd from "@/components/seo/JsonLd";
import { departments, getDepartment } from "@/data/departments";
import { pageMeta } from "@/lib/seo";
import { departmentSchema } from "@/lib/schema";

export function generateStaticParams() {
  return departments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/departments/[slug]">) {
  const { slug } = await params;
  const dept = getDepartment(slug);
  if (!dept) return pageMeta("Department", "Alvasatiya department", "/departments");
  return pageMeta(
    `${dept.name} Department`,
    dept.intro,
    `/departments/${dept.slug}`
  );
}

export default async function Page({ params }: PageProps<"/departments/[slug]">) {
  const { slug } = await params;
  const dept = getDepartment(slug);
  if (!dept) notFound();
  return (
    <>
      <JsonLd data={departmentSchema(dept)} />
      <DepartmentView dept={dept} />
    </>
  );
}
