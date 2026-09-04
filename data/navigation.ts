export type NavChild = { label: string; href: string };
export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const QUICK_LEFT = [
  { label: "Al Quran", href: "/quran", accent: false },
  { label: "Books", href: "/islamic-services/books-library", accent: false },
  { label: "Headquarters", href: "/institutions/jamia-umme-ashraf-jamal", accent: true },
] as const;

export const QUICK_RIGHT = [
  { label: "Branches", href: "/institutions/alvasatiya-tehfeez-ul-quran", accent: true },
  { label: "Courses", href: "/courses", accent: false },
  { label: "Media", href: "/media", accent: false },
] as const;

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "Introduction", href: "/about/introduction" },
      { label: "Our Mission", href: "/about/mission" },
      { label: "Where We Are", href: "/about/where-we-are" },
      { label: "Our Founder", href: "/about/founder" },
      { label: "Our Achievements", href: "/about/achievements" },
    ],
  },
  {
    label: "Our Info",
    href: "/institutions",
    children: [
      { label: "Headquarters — Jamia Umme Ashraf Jamal", href: "/institutions/jamia-umme-ashraf-jamal" },
      { label: "Branches — Tehfeez-ul-Quran", href: "/institutions/alvasatiya-tehfeez-ul-quran" },
      { label: "Alvasatiya Islamic Center", href: "/institutions/alvasatiya-islamic-center" },
      { label: "Alvasatiya IT Lab", href: "/institutions/alvasatiya-it-lab" },
      { label: "Alvasatiya Science Academy", href: "/institutions/alvasatiya-science-academy" },
      { label: "What We Provide", href: "/what-we-provide" },
    ],
  },
  {
    label: "Islamic Services",
    href: "/islamic-services",
    children: [
      { label: "Books Library", href: "/islamic-services/books-library" },
      { label: "Zakat Calculator", href: "/islamic-services/zakat-calculator" },
      { label: "Islamic Education", href: "/islamic-services/islamic-education" },
      { label: "Islamic Media", href: "/islamic-services/islamic-media" },
      { label: "New Muslims", href: "/islamic-services/new-muslims" },
      { label: "Islamic Courses", href: "/islamic-services/islamic-courses" },
      { label: "Islamic Events", href: "/islamic-services/islamic-events" },
      { label: "Islamic Blogs", href: "/islamic-services/islamic-blogs" },
    ],
  },
  {
    label: "Social Services",
    href: "/social-services",
    children: [
      { label: "Fatwa Q&A", href: "/social-services/fatwa-qa" },
      { label: "Welfare Services", href: "/social-services/welfare-services" },
      { label: "What to Donate", href: "/social-services/what-to-donate" },
      { label: "Donate Now", href: "/social-services/donate" },
      { label: "Hajj & Umrah", href: "/social-services/hajj-umrah" },
      { label: "Prayer Times", href: "/social-services/prayer-times" },
    ],
  },
  {
    label: "Departments",
    href: "/departments",
    children: [
      { label: "Jamia Umme Ashraf Jamal", href: "/departments/jamia-umme-ashraf-jamal" },
      { label: "Tehfeez-ul-Quran", href: "/departments/tehfeez-ul-quran" },
      { label: "IT Lab", href: "/departments/it-lab" },
      { label: "Science Academy", href: "/departments/science-academy" },
      { label: "Welfare Services", href: "/departments/welfare" },
      { label: "Social Media", href: "/departments/social-media" },
      { label: "Online Courses", href: "/departments/online-courses" },
    ],
  },
  { label: "News & Media", href: "/news" },
  {
    label: "Contact Us",
    href: "/contact",
    children: [
      { label: "Contact Form", href: "/contact" },
      { label: "Where We Are", href: "/about/where-we-are" },
      { label: "Feedback", href: "/feedback" },
    ],
  },
];
