export type Book = {
  slug: string;
  title: string;
  author: string;
  category: string;
  description: string;
  featured?: boolean;
  added: string;
  canDownload?: boolean;
};

export const BOOK_CATEGORIES = [
  "Quran",
  "Hadith",
  "Aqidah",
  "Fiqh",
  "Seerah",
  "Arabic",
  "Children",
  "Spirituality",
] as const;

export const books: Book[] = [
  {
    slug: "holy-quran",
    title: "The Holy Quran",
    author: "Revelation of Allah",
    category: "Quran",
    description: "Read the Quran in Arabic with English translation in the Alvasatiya Quran reader.",
    featured: true,
    added: "2026-01-12",
  },
  {
    slug: "forty-hadith",
    title: "Al-Arba'in (Forty Hadith)",
    author: "Imam al-Nawawi",
    category: "Hadith",
    description: "A renowned short collection of foundational prophetic teachings used in beginner and intermediate study.",
    featured: true,
    added: "2026-02-02",
  },
  {
    slug: "riyad-as-salihin",
    title: "Riyad as-Salihin",
    author: "Imam al-Nawawi",
    category: "Hadith",
    description: "A classical garden of righteous teachings covering manners, worship, and daily life.",
    featured: true,
    added: "2026-02-18",
  },
  {
    slug: "stories-of-the-prophets",
    title: "Stories of the Prophets",
    author: "Classical educational compilation",
    category: "Seerah",
    description: "Educational narratives of the prophets mentioned in the Quran, for family and classroom reading.",
    added: "2026-03-01",
  },
  {
    slug: "beginner-salah-guide",
    title: "Beginner Salah Guide",
    author: "Alvasatiya Education",
    category: "Fiqh",
    description: "A simple educational outline of purification and prayer for new learners. Personal cases should be reviewed with a teacher.",
    added: "2026-03-20",
  },
  {
    slug: "arabic-reading-primer",
    title: "Arabic Reading Primer",
    author: "Alvasatiya Education",
    category: "Arabic",
    description: "A starter resource for letters, connections, and first Quranic reading steps.",
    added: "2026-04-04",
  },
  {
    slug: "childrens-akhlaq",
    title: "Children's Akhlaq Reader",
    author: "Alvasatiya Education",
    category: "Children",
    description: "Short, gentle lessons on Islamic manners for children and families.",
    added: "2026-04-22",
  },
  {
    slug: "adhkar-for-the-day",
    title: "Adhkar for the Day",
    author: "Educational compilation",
    category: "Spirituality",
    description: "A reminder collection of commonly taught morning and evening remembrances. Verify wording with a qualified teacher.",
    added: "2026-05-10",
  },
];
