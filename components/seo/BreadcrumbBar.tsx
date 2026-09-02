"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

const LABELS: Record<string, string> = {
  about: "About Us",
  introduction: "Introduction",
  mission: "Our Mission",
  "where-we-are": "Where We Are",
  founder: "Our Founder",
  achievements: "Our Achievements",
  "islamic-services": "Islamic Services",
  "books-library": "Books Library",
  "zakat-calculator": "Zakat Calculator",
  "islamic-education": "Islamic Education",
  "islamic-media": "Islamic Media",
  "new-muslims": "New Muslims",
  "islamic-courses": "Islamic Courses",
  "islamic-events": "Islamic Events",
  "islamic-blogs": "Islamic Blogs",
  "social-services": "Social Services",
  "fatwa-qa": "Fatwa Q&A",
  "welfare-services": "Welfare Services",
  "what-to-donate": "What to Donate",
  donate: "Donate Now",
  "hajj-umrah": "Hajj & Umrah",
  "prayer-times": "Prayer Times",
  departments: "Departments",
  quran: "Al Quran",
  courses: "Courses",
  demo: "Free Demo",
  login: "Login",
  signup: "Sign Up",
  "forgot-password": "Forgot Password",
  portal: "Portal",
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
  enroll: "Enroll",
  pay: "Payment",
  education: "Education",
  services: "Services",
  media: "Media",
  news: "News & Media",
  contact: "Contact Us",
  feedback: "Feedback",
  institutions: "Institutions",
  "our-info": "Our Info",
  "jamia-umme-ashraf-jamal": "Jamia Umme Ashraf Jamal",
  "alvasatiya-tehfeez-ul-quran": "Alvasatiya Tehfeez-ul-Quran",
  "alvasatiya-islamic-center": "Alvasatiya Islamic Center",
  "alvasatiya-it-lab": "Alvasatiya IT Lab",
  "alvasatiya-science-academy": "Alvasatiya Science Academy",
  "branch-1": "Branch 1",
  "branch-2": "Branch 2",
  "branch-3": "Branch 3",
  "branch-4": "Branch 4",
  "branch-5": "Branch 5",
  "what-we-provide": "What We Provide",
};

export default function BreadcrumbBar() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;
  const parts = pathname.split("/").filter(Boolean);
  const items = [{ name: "Home", path: "/" }];
  let acc = "";
  for (const part of parts) {
    acc += `/${part}`;
    items.push({
      name: LABELS[part] ?? part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      path: acc,
    });
  }
  return (
    <nav aria-label="Breadcrumb" className="bg-sage/80 border-b border-border">
      <JsonLd data={breadcrumbSchema(items)} />
      <ol className="section-container flex flex-wrap gap-1 py-2 text-xs text-muted">
        {items.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? (
              <span className="text-green-deep font-semibold">{item.name}</span>
            ) : (
              <Link href={item.path} className="hover:text-gold">{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
