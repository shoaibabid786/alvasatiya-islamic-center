export type Blog = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  minutes: number;
  featured?: boolean;
  content: string[];
};

export const BLOG_CATEGORIES = [
  "Quran",
  "Worship",
  "Character",
  "Family",
  "Community",
  "Education",
] as const;

export const blogs: Blog[] = [
  {
    slug: "balanced-nation",
    title: "A Justly Balanced Nation: The Spirit of Al-Wasatiyyah",
    excerpt: "A reflection on balance, knowledge, and service as a community ethic.",
    category: "Education",
    author: "Alvasatiya Editorial",
    date: "2026-08-12",
    minutes: 6,
    featured: true,
    content: [
      "Alvasatiya takes its name from the Quranic idea of a justly balanced community. Balance here is not emptiness or compromise of truth. It is a call to knowledge, mercy, and responsibility.",
      "Beneficial knowledge should humble the student. Faith should refine character. Service should reach people in need. These three — knowledge, faith, and service — are the heart of this institution's public message.",
      "This article is educational. For detailed religious questions, please consult qualified scholars or submit a question through Fatwa Q&A.",
    ],
  },
  {
    slug: "beginning-quran-reading",
    title: "Beginning Quran Reading with Calm and Consistency",
    excerpt: "Practical advice for new readers of the Quran.",
    category: "Quran",
    author: "Alvasatiya Editorial",
    date: "2026-07-28",
    minutes: 5,
    featured: true,
    content: [
      "A strong Quran journey is usually quiet and consistent. Short daily reading, a patient teacher, and sincere revision often help more than rushed ambition.",
      "New readers may start with letters, connections, and short surahs. Tajweed is a mercy that protects recitation; it can be learned step by step.",
      "Families can support children by setting a peaceful time and praising effort, not only speed.",
    ],
  },
  {
    slug: "manners-of-seeking-knowledge",
    title: "Manners of Seeking Knowledge",
    excerpt: "Adab that keeps Islamic learning sincere and beneficial.",
    category: "Character",
    author: "Alvasatiya Editorial",
    date: "2026-07-02",
    minutes: 4,
    content: [
      "Seeking knowledge is an act of worship when the intention is to please Allah and to benefit people.",
      "Respect for teachers, patience with classmates, and honesty in what one does not yet know are part of the path.",
      "Knowledge that does not improve character still needs work. The student should ask Allah for beneficial knowledge and protection from knowledge that does not benefit.",
    ],
  },
  {
    slug: "serving-families-in-need",
    title: "Serving Families in Need with Dignity",
    excerpt: "A reminder that welfare is worship when done with sincerity and care.",
    category: "Community",
    author: "Alvasatiya Editorial",
    date: "2026-06-18",
    minutes: 4,
    content: [
      "Helping poor families, orphans, and students is part of community responsibility. Dignity matters as much as the gift itself.",
      "Alvasatiya's welfare page describes areas of support. Needs and project details will be published as they are confirmed.",
      "Those who wish to give can review What to Donate and Donate Now.",
    ],
  },
  {
    slug: "family-quran-time",
    title: "Making a Small Quran Time at Home",
    excerpt: "Simple ideas for families who want a peaceful daily habit.",
    category: "Family",
    author: "Alvasatiya Editorial",
    date: "2026-05-30",
    minutes: 3,
    content: [
      "A short family Quran time can be more sustainable than a long session that rarely happens.",
      "One ayah, one meaning, and one manners reminder can be enough for a weekday evening.",
      "Parents do not need to be scholars to sit with their children and show love for Allah's Book.",
    ],
  },
  {
    slug: "friday-reminders",
    title: "Friday Reminders for a Quieter Heart",
    excerpt: "A gentle Friday reflection on prayer, charity, and remembrance.",
    category: "Worship",
    author: "Alvasatiya Editorial",
    date: "2026-05-09",
    minutes: 3,
    content: [
      "Friday is a weekly opportunity to slow down, attend Jumu'ah where one can, give charity, and send salutations upon the Prophet ﷺ.",
      "A reminder is not a fatwa. Personal circumstances differ, and local prayer times should be checked for your city.",
    ],
  },
];

export function getBlog(slug: string) {
  return blogs.find((b) => b.slug === slug);
}
