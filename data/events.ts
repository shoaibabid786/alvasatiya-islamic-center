export type EventItem = {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: "upcoming" | "past";
};

export const events: EventItem[] = [
  {
    slug: "community-quran-circle",
    title: "Community Quran Circle",
    date: "2026-09-20",
    time: "After Maghrib",
    location: "Headquarters, Lahore",
    description: "A peaceful gathering for recitation, short reminder, and dua. Registration details will be confirmed by the administration.",
    status: "upcoming",
  },
  {
    slug: "new-muslims-welcome",
    title: "Welcome Session for New Muslims",
    date: "2026-09-27",
    time: "11:00 AM",
    location: "Online and on-site",
    description: "A gentle introduction to Shahadah, Wudu, Salah, and first Quran steps.",
    status: "upcoming",
  },
  {
    slug: "hajj-education-workshop",
    title: "Hajj Education Workshop",
    date: "2026-10-11",
    time: "3:00 PM",
    location: "Education hall / online option",
    description: "An educational overview of Hajj stages and preparation. Not a substitute for personal scholarly advice.",
    status: "upcoming",
  },
  {
    slug: "ramadan-preparation-evening",
    title: "Ramadan Preparation Evening",
    date: "2026-02-22",
    time: "After Isha",
    location: "Headquarters, Lahore",
    description: "A past community evening of reminders, Quran, and charity intention.",
    status: "past",
  },
];
