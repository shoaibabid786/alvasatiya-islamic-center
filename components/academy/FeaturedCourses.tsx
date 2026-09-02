import Link from "next/link";
import CourseCard from "@/components/ui/CourseCard";
import { getFeaturedCourses } from "@/data/courses";
import { getPublishedCourses } from "@/lib/catalog";

export default function FeaturedCourses() {
  const featured = getFeaturedCourses(getPublishedCourses());
  return (
    <section className="py-16 md:py-20 bg-ivory islamic-pattern-light">
      <div className="section-container">
        <p className="section-eyebrow">Courses</p>
        <h2 className="section-title">Learn Islam From Qualified Teachers</h2>
        <div className="geometric-divider !mx-0" />
        <p className="section-desc mt-2">
          Six featured pathways to begin. Book a free demo, then enroll. The student portal opens after payment is verified.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {featured.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/courses" className="btn btn-gold">View More Courses</Link>
        </div>
      </div>
    </section>
  );
}
