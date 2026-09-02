import Link from "next/link";
import Image from "next/image";
import type { Course } from "@/data/courses";
import { CourseIcon } from "@/components/academy/CourseIcon";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <article className="card-surface overflow-hidden h-full flex flex-col">
      <div className="relative h-44">
        <Image src={course.image} alt={course.title} fill className="object-cover" sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw" />
        <span className="absolute top-3 left-3 w-10 h-10 rounded-full bg-green-deep/90 text-gold grid place-items-center">
          <CourseIcon name={course.icon} />
        </span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs uppercase tracking-widest text-gold">{course.category}</p>
        <h3 className="mt-1 text-lg font-semibold text-green-deep">{course.title}</h3>
        <p className="mt-2 text-sm text-muted flex-1">{course.description}</p>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted">
          <div>
            <dt className="font-semibold text-green-deep">Duration</dt>
            <dd>{course.duration}</dd>
          </div>
          <div>
            <dt className="font-semibold text-green-deep">Language</dt>
            <dd>{course.language}</dd>
          </div>
        </dl>
        <div className="mt-5 flex gap-2">
          <Link href={`/courses/${course.slug}`} className="btn btn-green !py-2 flex-1">View Course</Link>
          <Link href={`/demo?course=${course.slug}`} className="btn btn-gold !py-2 flex-1">Free Demo</Link>
        </div>
      </div>
    </article>
  );
}
