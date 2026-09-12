export type Department = {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  purpose: string;
  objectives: string[];
  services: string[];
  programs: string[];
  activities: string[];
  notes?: string[];
  cta?: { label: string; href: string };
};

export const departments: Department[] = [
  {
    slug: "jamia-umme-ashraf-jamal",
    name: "Jamia Umme Ashraf Jamal",
    tagline: "Headquarters for Dars-e-Nizami, Hifz, and Tajweed",
    intro:
      "Jamia Umme Ashraf Jamal is the headquarters of Alvasatiya Islamic Center in Glaxo Town, Ferozpur Road, Lahore. It is the central campus for traditional Islamic scholarship and Quran education.",
    purpose:
      "To teach Dars-e-Nizami, Hifz-ul-Quran, and Tajweed & Qirat in a structured, residential and day campus.",
    objectives: [
      "Teach Dars-e-Nizami according to the student's stage",
      "Support Hifz-ul-Quran with daily lesson and revision",
      "Train recitation through Tajweed & Qirat",
    ],
    services: ["Dars-e-Nizami", "Hifz-ul-Quran", "Tajweed & Qirat", "Student support at the Lahore campus"],
    programs: ["Dars-e-Nizami", "Hifz-ul-Quran", "Tajweed & Qirat"],
    activities: ["Daily lessons", "Quran recitation", "Structured Hifz revision"],
    cta: { label: "View headquarters", href: "/institutions/jamia-umme-ashraf-jamal" },
  },
  {
    slug: "tehfeez-ul-quran",
    name: "Alvasatiya Tehfeez-ul-Quran",
    tagline: "Quran memorization branches",
    intro:
      "Alvasatiya Tehfeez-ul-Quran is the Center's Hifz-ul-Quran network. Branches teach memorization, revision, and Quranic manners closer to students' communities.",
    purpose: "To help children and youth memorize the Quran with teacher guidance and regular revision.",
    objectives: [
      "Teach Hifz-ul-Quran with new lesson and revision",
      "Keep Tajweed care in daily recitation",
      "Place students according to recitation level and available seats",
    ],
    services: ["Hifz-ul-Quran classes", "Revision circles", "Branch admissions through the office"],
    programs: ["Hifz-ul-Quran"],
    activities: ["Daily sabaq", "Revision", "Teacher listening"],
    cta: { label: "View Tehfeez branches", href: "/institutions/alvasatiya-tehfeez-ul-quran" },
  },
  {
    slug: "it-lab",
    name: "THS IT Lab",
    tagline: "Donated by Taleem o Hunar Society",
    intro:
      "THS IT Lab was donated by Taleem o Hunar Society. Islamic students learn basic computer, video editing, graphic designing, basic AI, and more. The lab also manages its own courses and teachers.",
    purpose: "To give students practical digital skills for study and lawful work, in a classroom set up through Taleem o Hunar Society.",
    objectives: [
      "Teach basic computer, video editing, graphic designing, and basic AI",
      "Manage THS IT Lab courses and teachers in one place",
      "Support students already enrolled in Islamic programs",
    ],
    services: ["Computer education", "Video and graphic practice", "Course and teacher coordination"],
    programs: ["Basic computer", "Video editing", "Graphic designing", "Basic AI"],
    activities: ["Scheduled computer classes", "Guided practice sessions"],
    cta: { label: "View THS IT Lab", href: "/institutions/ths-it-lab" },
  },
  {
    slug: "science-academy",
    name: "Alvasatiya Science Academy",
    tagline: "Science and academic education",
    intro:
      "Alvasatiya Science Academy supports science and general academic education alongside Quran and Islamic studies.",
    purpose: "To help students grow in both religious and worldly knowledge.",
    objectives: [
      "Teach age-appropriate science",
      "Support general schooling beside Islamic studies",
    ],
    services: ["Science education", "Academic support"],
    programs: ["Science education", "Academic learning"],
    activities: ["Scheduled academic classes"],
    cta: { label: "View Science Academy", href: "/institutions/alvasatiya-science-academy" },
  },
  {
    slug: "welfare",
    name: "Welfare Services",
    tagline: "Support for students, families, and those in need",
    intro:
      "Alvasatiya welfare work supports Islamic education, orphans, poor families, food assistance, and student care. Eligible poor and orphan students may receive education, and where the office approves it, meals and accommodation.",
    purpose: "To spend donations on Quran education, student welfare, and family assistance with dignity.",
    objectives: [
      "Support Quran and Islamic education",
      "Help orphans and poor families",
      "Provide food and student care where approved",
    ],
    services: ["Education support", "Food assistance", "Orphan care", "Student meals and housing"],
    programs: ["Sadaqah", "Zakat", "Food packages", "Orphan support"],
    activities: ["Welfare cases reviewed by the office", "Donation collection through HBL and JazzCash"],
    cta: { label: "Donate", href: "/social-services/donate" },
  },
  {
    slug: "social-media",
    name: "Social Media",
    tagline: "Official Alvasatiya channels",
    intro:
      "The Social Media department shares Alvasatiya's official updates. Only confirmed accounts are listed: Facebook, YouTube, Instagram, and X.",
    purpose: "To publish official reminders and announcements from Alvasatiya Islamic Center.",
    objectives: [
      "Share official updates",
      "Direct people to the website and campus",
      "Keep only verified accounts public",
    ],
    services: ["Facebook", "YouTube", "Instagram", "X / Twitter"],
    programs: ["Official announcements", "Educational posts"],
    activities: ["Publishing on confirmed platforms"],
    cta: { label: "Contact", href: "/contact" },
  },
  {
    slug: "online-courses",
    name: "Online Courses",
    tagline: "Quran and Islamic sciences",
    intro:
      "Alvasatiya publishes Quran courses and Islamic sciences: Nazira, Hifaz, Tajweed o Qirat, Tarjima, Tafseer, Ilm ul Hadees, Ilm ul Fiqh, Usul, Fraiz, Dars e Nizami, Khatam e Nabuwat, Taharat, and Hajj Course. Students can browse courses and enroll through the website.",
    purpose: "To make Quran and Islamic sciences available online and on site.",
    objectives: [
      "Teach Quran pathways from Nazira to Tafseer",
      "Teach Ilm ul Hadees and Usul al Hadees",
      "Teach Ilm ul Fiqh, Usul al Fiqh, Taharat, and Ilm ul Fraiz",
      "Offer Dars e Nizami, Khatam e Nabuwat, Hajj, Umrah, New Muslim, children, youth, and Urdu courses",
    ],
    services: ["Course catalog", "Enrollment", "Teacher-guided study"],
    programs: [
      "Nazira Tul Quran",
      "Hifaz ul Quran",
      "Tajweed o Qirat",
      "Tarjima tul Quran",
      "Tafseer ul Quran",
      "Ilm ul Hadees",
      "Ilm ul Fiqh",
      "Usul al Hadees",
      "Usul al Fiqh",
      "Ilm ul Fraiz",
      "Dars e Nizami",
      "Khatam e Nabuwat",
      "Taharat",
      "Hajj Course",
      "Umrah Course",
      "New Muslim Course",
      "Ahkam e Shariat",
      "Basic Islam for Children",
      "Basic Islam for Youngers",
      "Urdu Language Course",
      "Famous Surahs Hifaz",
      "Noorani Qaida",
      "Adaab e Parents",
      "Ahl e Bait Course",
      "Parents of Muhammad ﷺ",
      "Qurbani Course",
      "Seerat e Mustafa",
      "Namaz Course",
    ],
    activities: ["Online and on-site classes"],
    cta: { label: "View courses", href: "/courses" },
  },
];

export function getDepartment(slug: string) {
  return departments.find((d) => d.slug === slug);
}
