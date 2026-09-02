import { notFound } from "next/navigation";
import CourseDetail from "@/components/templates/CourseDetail";
import JsonLd from "@/components/seo/JsonLd";
import { allCourseParams } from "@/data/courses";
import { getPublishedCourse } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";
import { courseSchema, faqSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return allCourseParams();
}

export async function generateMetadata({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const course = getPublishedCourse(slug);
  if (!course) return pageMeta("Course", "Islamic course at Alvasatiya Islamic Center", "/courses");
  return pageMeta(
    `${course.title} | ${course.category} Course`,
    course.description,
    `/courses/${course.slug}`
  );
}

export default async function Page({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const course = getPublishedCourse(slug);
  if (!course) notFound();
  return (
    <>
      <JsonLd data={[courseSchema(course), faqSchema(course.faqs)]} />
      <CourseDetail course={course} />
    </>
  );
}
