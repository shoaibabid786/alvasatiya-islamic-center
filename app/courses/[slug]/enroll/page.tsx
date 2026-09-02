import { notFound } from "next/navigation";
import EnrollClient from "@/components/academy/EnrollClient";
import { getPublishedCourse } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/courses/[slug]/enroll">) {
  const { slug } = await params;
  const course = getPublishedCourse(slug);
  return pageMeta(
    `Enroll | ${course?.title ?? "Course"}`,
    "Complete enrollment and secure payment verification to unlock the student portal.",
    `/courses/${slug}/enroll`,
    { index: false }
  );
}

export default async function Page({ params }: PageProps<"/courses/[slug]/enroll">) {
  const { slug } = await params;
  const course = getPublishedCourse(slug);
  if (!course) notFound();
  return <EnrollClient course={course} />;
}
