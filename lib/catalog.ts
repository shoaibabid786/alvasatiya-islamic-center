import { courses as seedCourses, getCourse as findSeedCourse, type Course } from "@/data/courses";
import { getDb, saveDb, newId, type CourseOverride } from "@/lib/academy-db";

export function getPublishedCourses(): Course[] {
  const db = getDb();
  const map = new Map(seedCourses.map((course) => [course.slug, course]));
  for (const override of db.courseOverrides) {
    if (override.deleted) {
      map.delete(override.slug);
      continue;
    }
    const base = map.get(override.slug);
    if (!base) {
      map.set(override.slug, overrideAsCourse(override));
      continue;
    }
    map.set(override.slug, { ...base, ...override, slug: override.slug });
  }
  return [...map.values()];
}

export function getPublishedCourse(slug: string) {
  const list = getPublishedCourses();
  return list.find((c) => c.slug === slug || c.aliases?.includes(slug)) ?? findSeedCourse(slug, list);
}

function overrideAsCourse(override: CourseOverride): Course {
  const fallback = seedCourses[0];
  return {
    ...fallback,
    ...override,
    slug: override.slug,
    title: override.title || "Untitled course",
    description: override.description || "Course details will be published by Admin.",
    featured: override.featured ?? false,
  };
}

export function upsertCourseOverride(payload: CourseOverride) {
  const db = getDb();
  const index = db.courseOverrides.findIndex((item) => item.slug === payload.slug);
  if (index >= 0) db.courseOverrides[index] = { ...db.courseOverrides[index], ...payload };
  else db.courseOverrides.push(payload);
  saveDb(db);
  return getPublishedCourse(payload.slug);
}

export function createAdminCourse(input: { title: string; category: string; description: string; duration: string; language: string; level: Course["level"] }) {
  const slug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || newId("course");
  return upsertCourseOverride({
    slug,
    title: input.title,
    category: input.category,
    description: input.description,
    duration: input.duration,
    durationBand: "flexible",
    classDuration: "45 minutes",
    language: input.language,
    level: input.level,
    mode: "Online",
    liveFormat: "Live online classes with teacher guidance",
    image: "/images/courses/photo-01.jpg",
    banner: "/images/courses/photo-01.jpg",
    icon: "book-open",
    instructor: "Qualified Alvasatiya teachers",
    teacherBio: "A named teacher is assigned after verified enrollment.",
    certificateAvailable: false,
    about: input.description,
    learn: ["Teacher-led lessons", "Guided practice", "Progress review"],
    topics: ["Foundations", "Practice", "Review"],
    achieve: ["A clear study plan", "Teacher feedback after enrollment"],
    curriculum: [{ title: "Pathway", items: ["Placement", "Lessons", "Review"] }],
    whoFor: ["Students placed after a free demo"],
    features: ["Live classes", "Portal access after verified payment"],
    faqs: [],
    requirements: ["Sincere intention", "Regular attendance"],
  });
}
