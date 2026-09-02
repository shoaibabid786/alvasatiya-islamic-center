export type StatValue = number | null;

export type ProgramStat = {
  id: string;
  label: string;
  students: StatValue;
};

export type InstitutionKind = "headquarters" | "branch-network" | "branch" | "service";

export type GalleryItem = { src: string; alt: string };

export type Institution = {
  slug: string;
  kind: InstitutionKind;
  title: string;
  eyebrow: string;
  summary: string;
  location: string;
  image: string;
  href: string;
  parentSlug?: string;
  students: StatValue;
  programs: ProgramStat[];
  intro: string[];
  educationalPrograms: { title: string; text: string }[];
  facilities: string[];
  teachers: string;
  activities: string[];
  gallery: GalleryItem[];
  admissions: string;
  contactNote: string;
};

export type InstitutionOverride = {
  slug: string;
  students?: StatValue;
  location?: string;
  summary?: string;
  intro?: string[];
  programs?: ProgramStat[];
  facilities?: string[];
  teachers?: string;
  activities?: string[];
  admissions?: string;
};

export type ProvisionItem = {
  id: string;
  title: string;
  text: string;
  icon: "mosque" | "school" | "computer" | "home" | "meals" | "heart" | "orphan" | "graduate";
};

const JAMIA_GALLERY: GalleryItem[] = [
  { src: "/images/hero/alvasatiya.png", alt: "Mosque architecture representing Alvasatiya's educational environment" },
  { src: "/images/hero/education.png", alt: "Students and teachers in an Islamic educational setting" },
  { src: "/images/hero/quran.png", alt: "Quran study setting used across Alvasatiya campuses" },
  { src: "/images/courses/photo-06.jpg", alt: "A gathering for Islamic learning" },
];

const HIFZ_GALLERY: GalleryItem[] = [
  { src: "/images/hero/quran.png", alt: "Quran placed for recitation and memorization" },
  { src: "/images/courses/photo-14.jpg", alt: "Bound Quran copies for Hifz students" },
  { src: "/images/courses/photo-08.jpg", alt: "Quran recitation and Tajweed study materials" },
  { src: "/images/courses/slider/slide-1.jpg", alt: "Islamic scholarly books for Quranic education" },
];

export const HEADQUARTERS_SLUG = "jamia-umme-ashraf-jamal";
export const TEHFEEZ_SLUG = "alvasatiya-tehfeez-ul-quran";

export const institutions: Institution[] = [
  {
    slug: HEADQUARTERS_SLUG,
    kind: "headquarters",
    title: "Jamia Umme Ashraf Jamal",
    eyebrow: "Main Headquarters",
    summary: "The central campus for traditional Islamic scholarship, Quran memorization, and Tajweed & Qirat.",
    location: "Glaxo Town, Ferozpur Road, Lahore",
    image: "/images/hero/alvasatiya.png",
    href: `/institutions/${HEADQUARTERS_SLUG}`,
    students: 400,
    programs: [
      { id: "dars-e-nizami", label: "Dars-e-Nizami", students: 250 },
      { id: "hifz-ul-quran", label: "Hifz-ul-Quran", students: 130 },
      { id: "tajweed-qirat", label: "Tajweed & Qirat", students: 40 },
    ],
    intro: [
      "Jamia Umme Ashraf Jamal is the headquarters of Alvasatiya Islamic Center. It is a residential and day campus for Islamic education in Lahore, focused on a calm, structured environment for knowledge and character.",
      "The Jamia brings together Dars-e-Nizami, Hifz-ul-Quran, and Tajweed & Qirat under one roof, so students can progress in traditional scholarship and Quranic recitation with teacher care.",
    ],
    educationalPrograms: [
      {
        title: "Dars-e-Nizami",
        text: "A classical Islamic sciences pathway. Placement and texts are confirmed with the academic team according to the student's stage.",
      },
      {
        title: "Hifz-ul-Quran",
        text: "A revision-centered memorization path with new lesson, recent revision, and longer-term review.",
      },
      {
        title: "Tajweed & Qirat",
        text: "Recitation training so pronunciation is clearer and more careful, with teacher listening.",
      },
    ],
    facilities: [
      "Classrooms for Dars-e-Nizami, Hifz, and Tajweed & Qirat",
      "Prayer space and supervised study areas",
      "Student support for eligible boarding students, as arranged by the office",
    ],
    teachers:
      "Classes are taught by teachers appointed by Alvasatiya Islamic Center. A named faculty list is published when the administration confirms it.",
    activities: [
      "Daily lessons and Quran recitation",
      "Structured revision for Hifz students",
      "Educational gatherings as scheduled by the campus",
    ],
    gallery: JAMIA_GALLERY,
    admissions:
      "Admissions are arranged through the office. Eligible poor and orphan students may receive education, and where applicable accommodation and meals, free of cost. Contact the Center for current placement.",
    contactNote: "Visit the headquarters in Glaxo Town, Ferozpur Road, Lahore, or write through the contact form.",
  },
  {
    slug: TEHFEEZ_SLUG,
    kind: "branch-network",
    title: "Alvasatiya Tehfeez-ul-Quran",
    eyebrow: "Quran Memorization Network",
    summary: "Five Hifz-ul-Quran branches serving students with Quran memorization and Quranic education.",
    location: "Lahore area — exact branch addresses are published as the administration confirms them",
    image: "/images/hero/quran.png",
    href: `/institutions/${TEHFEEZ_SLUG}`,
    students: 140,
    programs: [{ id: "hifz-ul-quran", label: "Hifz-ul-Quran", students: 140 }],
    intro: [
      "Alvasatiya Tehfeez-ul-Quran is the Center's Quran memorization network. Its branches exist so children and youth can memorize the Quran closer to their communities, with teacher guidance and regular revision.",
      "The public student figures below are those supplied for each branch. Branch 5 remains open for Admin to publish a confirmed count.",
    ],
    educationalPrograms: [
      {
        title: "Hifz-ul-Quran",
        text: "Each branch focuses on memorization, revision, and basic Tajweed care at a child- and youth-friendly pace.",
      },
      {
        title: "Quranic education",
        text: "Alongside Hifz, students receive Quran reading manners and a calm classroom routine.",
      },
    ],
    facilities: [
      "Classrooms suited to Hifz circles",
      "Revision space under teacher supervision",
      "Branch-level facilities are updated by Admin as each site is documented",
    ],
    teachers:
      "Hifz teachers are appointed and approved by Alvasatiya. Named teachers for each branch are listed when the office confirms them.",
    activities: ["Daily sabaq and revision", "Listening and recitation", "Parent or guardian partnership where children are enrolled"],
    gallery: HIFZ_GALLERY,
    admissions:
      "Families may enquire about a nearby branch through the office. Placement depends on the student's recitation level and available seats.",
    contactNote: "Use the contact form and mention the preferred Tehfeez branch.",
  },
  {
    slug: "alvasatiya-tehfeez-ul-quran-branch-1",
    kind: "branch",
    parentSlug: TEHFEEZ_SLUG,
    title: "Alvasatiya Tehfeez-ul-Quran — Branch 1",
    eyebrow: "Hifz Branch",
    summary: "A Hifz-ul-Quran classroom focused on memorization, revision, and Quranic manners.",
    location: "Address to be published by Admin",
    image: "/images/courses/photo-14.jpg",
    href: `/institutions/${TEHFEEZ_SLUG}/branch-1`,
    students: 40,
    programs: [{ id: "hifz-ul-quran", label: "Hifz-ul-Quran", students: 40 }],
    intro: [
      "Branch 1 is part of Alvasatiya Tehfeez-ul-Quran. The program is Hifz-ul-Quran: new lesson, revision, and teacher listening in a calm setting.",
    ],
    educationalPrograms: [
      { title: "Hifz-ul-Quran", text: "Structured memorization with daily revision. Pace follows the student's ability." },
    ],
    facilities: ["Hifz classroom and revision space. Further facility details can be added by Admin."],
    teachers: "Teachers are appointed by Alvasatiya. Names are published when confirmed.",
    activities: ["Daily Hifz lesson", "Revision", "Recitation practice"],
    gallery: HIFZ_GALLERY,
    admissions: "Ask the office about current seats at Branch 1.",
    contactNote: "Contact Alvasatiya and mention Tehfeez Branch 1.",
  },
  {
    slug: "alvasatiya-tehfeez-ul-quran-branch-2",
    kind: "branch",
    parentSlug: TEHFEEZ_SLUG,
    title: "Alvasatiya Tehfeez-ul-Quran — Branch 2",
    eyebrow: "Hifz Branch",
    summary: "Quran memorization with teacher-guided revision for children and youth.",
    location: "Address to be published by Admin",
    image: "/images/courses/photo-08.jpg",
    href: `/institutions/${TEHFEEZ_SLUG}/branch-2`,
    students: 45,
    programs: [{ id: "hifz-ul-quran", label: "Hifz-ul-Quran", students: 45 }],
    intro: [
      "Branch 2 serves Hifz-ul-Quran students in the Tehfeez network, with emphasis on consistency and gentle correction.",
    ],
    educationalPrograms: [
      { title: "Hifz-ul-Quran", text: "Memorization and revision under a Hifz teacher, with Quranic adab." },
    ],
    facilities: ["Hifz classroom and revision space. Further facility details can be added by Admin."],
    teachers: "Teachers are appointed by Alvasatiya. Names are published when confirmed.",
    activities: ["Daily Hifz lesson", "Revision", "Recitation practice"],
    gallery: HIFZ_GALLERY,
    admissions: "Ask the office about current seats at Branch 2.",
    contactNote: "Contact Alvasatiya and mention Tehfeez Branch 2.",
  },
  {
    slug: "alvasatiya-tehfeez-ul-quran-branch-3",
    kind: "branch",
    parentSlug: TEHFEEZ_SLUG,
    title: "Alvasatiya Tehfeez-ul-Quran — Branch 3",
    eyebrow: "Hifz Branch",
    summary: "A neighborhood Hifz circle for memorizing the Quran with regular teacher care.",
    location: "Address to be published by Admin",
    image: "/images/courses/photo-07.jpg",
    href: `/institutions/${TEHFEEZ_SLUG}/branch-3`,
    students: 30,
    programs: [{ id: "hifz-ul-quran", label: "Hifz-ul-Quran", students: 30 }],
    intro: [
      "Branch 3 focuses on Hifz-ul-Quran. Lessons stay short enough for children to remain consistent.",
    ],
    educationalPrograms: [
      { title: "Hifz-ul-Quran", text: "New lesson and revision with teacher listening." },
    ],
    facilities: ["Hifz classroom and revision space. Further facility details can be added by Admin."],
    teachers: "Teachers are appointed by Alvasatiya. Names are published when confirmed.",
    activities: ["Daily Hifz lesson", "Revision", "Recitation practice"],
    gallery: HIFZ_GALLERY,
    admissions: "Ask the office about current seats at Branch 3.",
    contactNote: "Contact Alvasatiya and mention Tehfeez Branch 3.",
  },
  {
    slug: "alvasatiya-tehfeez-ul-quran-branch-4",
    kind: "branch",
    parentSlug: TEHFEEZ_SLUG,
    title: "Alvasatiya Tehfeez-ul-Quran — Branch 4",
    eyebrow: "Hifz Branch",
    summary: "Hifz-ul-Quran study with revision and Quranic manners in a small-group setting.",
    location: "Address to be published by Admin",
    image: "/images/courses/photo-05.jpg",
    href: `/institutions/${TEHFEEZ_SLUG}/branch-4`,
    students: 25,
    programs: [{ id: "hifz-ul-quran", label: "Hifz-ul-Quran", students: 25 }],
    intro: [
      "Branch 4 is a smaller Hifz circle in the Tehfeez network, suited to close teacher attention.",
    ],
    educationalPrograms: [
      { title: "Hifz-ul-Quran", text: "Memorization, revision, and recitation care." },
    ],
    facilities: ["Hifz classroom and revision space. Further facility details can be added by Admin."],
    teachers: "Teachers are appointed by Alvasatiya. Names are published when confirmed.",
    activities: ["Daily Hifz lesson", "Revision", "Recitation practice"],
    gallery: HIFZ_GALLERY,
    admissions: "Ask the office about current seats at Branch 4.",
    contactNote: "Contact Alvasatiya and mention Tehfeez Branch 4.",
  },
  {
    slug: "alvasatiya-tehfeez-ul-quran-branch-5",
    kind: "branch",
    parentSlug: TEHFEEZ_SLUG,
    title: "Alvasatiya Tehfeez-ul-Quran — Branch 5",
    eyebrow: "Hifz Branch",
    summary: "A Hifz-ul-Quran branch whose student count is published when Admin confirms it.",
    location: "Address to be published by Admin",
    image: "/images/courses/photo-10.jpg",
    href: `/institutions/${TEHFEEZ_SLUG}/branch-5`,
    students: null,
    programs: [{ id: "hifz-ul-quran", label: "Hifz-ul-Quran", students: null }],
    intro: [
      "Branch 5 is part of Alvasatiya Tehfeez-ul-Quran and focuses on Hifz-ul-Quran. The student count will appear here after Admin enters a confirmed figure.",
    ],
    educationalPrograms: [
      { title: "Hifz-ul-Quran", text: "Memorization and revision under a Hifz teacher." },
    ],
    facilities: ["Hifz classroom and revision space. Further facility details can be added by Admin."],
    teachers: "Teachers are appointed by Alvasatiya. Names are published when confirmed.",
    activities: ["Daily Hifz lesson", "Revision", "Recitation practice"],
    gallery: HIFZ_GALLERY,
    admissions: "Ask the office about current seats at Branch 5.",
    contactNote: "Contact Alvasatiya and mention Tehfeez Branch 5.",
  },
  {
    slug: "alvasatiya-islamic-center",
    kind: "service",
    title: "Alvasatiya Islamic Center",
    eyebrow: "Community & Learning",
    summary: "Islamic learning, community services, and guidance for students and families.",
    location: "Glaxo Town, Ferozpur Road, Lahore, with online programs worldwide",
    image: "/images/hero/service.png",
    href: "/institutions/alvasatiya-islamic-center",
    students: null,
    programs: [],
    intro: [
      "Alvasatiya Islamic Center is the parent organization for Quran learning, Islamic education, welfare, and community guidance.",
      "Through the website and the Lahore campus, people can read the Quran, join courses, ask questions, and support students in need.",
    ],
    educationalPrograms: [
      { title: "Islamic learning", text: "Courses, Quran study, and educational resources for children, youth, and adults." },
      { title: "Community services", text: "Welfare, Fatwa Q&A, Hajj education, and pastoral care as published on the site." },
      { title: "Guidance", text: "A calm, knowledge-based public message. Personal rulings are referred to qualified scholars." },
    ],
    facilities: ["Campus and digital services are described across the Education, Courses, and Social Services pages."],
    teachers: "Teachers and scholars are approved by the Center. Public names appear when confirmed.",
    activities: ["Online and on-site classes", "Community welfare", "Public educational resources"],
    gallery: [
      { src: "/images/hero/alvasatiya.png", alt: "Alvasatiya Islamic Center architectural setting" },
      { src: "/images/hero/service.png", alt: "Community service in an Islamic educational context" },
    ],
    admissions: "Explore courses, book a demo, or contact the office. Eligible students may receive free support as described in What We Provide.",
    contactNote: "Phone, email, and the contact form are listed on the Contact page.",
  },
  {
    slug: "alvasatiya-it-lab",
    kind: "service",
    title: "Alvasatiya IT Lab",
    eyebrow: "Technology Education",
    summary: "Computer and technology education so students can gain practical digital skills.",
    location: "Offered through Alvasatiya's educational campuses — schedule published by Admin",
    image: "/images/hero/education.png",
    href: "/institutions/alvasatiya-it-lab",
    students: null,
    programs: [],
    intro: [
      "Alvasatiya IT Lab offers computer and technology education as part of the Center's mix of Islamic and modern learning.",
      "Class lists, software tools, and student counts are published when the administration confirms them.",
    ],
    educationalPrograms: [
      { title: "Computer education", text: "Foundational IT and computer skills for students, including those in Islamic programs." },
      { title: "Practical skills", text: "Lessons are arranged so students can use computers for study and lawful work. Exact modules are announced by the office." },
    ],
    facilities: ["Computer classroom facilities are documented by Admin as equipment is confirmed."],
    teachers: "IT instructors are appointed by the Center. Names are published when confirmed.",
    activities: ["Computer classes as scheduled", "Guided practice sessions"],
    gallery: [{ src: "/images/hero/education.png", alt: "Educational classroom setting for Alvasatiya programs" }],
    admissions: "Ask the office about current IT Lab groups and whether a seat is available.",
    contactNote: "Mention Alvasatiya IT Lab when you contact the Center.",
  },
  {
    slug: "alvasatiya-science-academy",
    kind: "service",
    title: "Alvasatiya Science Academy",
    eyebrow: "Academic Education",
    summary: "Science and academic education alongside the Center's Islamic studies pathways.",
    location: "Offered through Alvasatiya's educational campuses — schedule published by Admin",
    image: "/images/cover-study.svg",
    href: "/institutions/alvasatiya-science-academy",
    students: null,
    programs: [],
    intro: [
      "Alvasatiya Science Academy supports science and general academic education so students can grow in both religious and worldly knowledge.",
      "Subject lists and class sizes are published when the administration confirms them.",
    ],
    educationalPrograms: [
      { title: "Science education", text: "Age-appropriate science learning in a values-based classroom." },
      { title: "Academic support", text: "General schooling support that sits beside Quran and Islamic studies, not in place of them." },
    ],
    facilities: ["Classroom facilities for academic subjects are updated by Admin as the academy timetable is confirmed."],
    teachers: "Academic teachers are appointed by the Center. Names are published when confirmed.",
    activities: ["Scheduled science and academic classes", "Study support as announced"],
    gallery: [{ src: "/images/hero/education.png", alt: "Students in an educational classroom at Alvasatiya" }],
    admissions: "Enquire with the office about Science Academy placement.",
    contactNote: "Mention Alvasatiya Science Academy when you contact the Center.",
  },
];

export const WHAT_WE_PROVIDE: ProvisionItem[] = [
  {
    id: "free-islamic-education",
    title: "Free Islamic Education",
    text: "Quran and Islamic studies for eligible students, so knowledge is not closed by lack of means.",
    icon: "mosque",
  },
  {
    id: "free-schooling",
    title: "Free Schooling",
    text: "General schooling support for eligible children, arranged through the Center's educational campuses.",
    icon: "school",
  },
  {
    id: "it-computer",
    title: "IT & Computer Education",
    text: "Computer and technology classes through Alvasatiya IT Lab, so students gain practical digital skills.",
    icon: "computer",
  },
  {
    id: "free-accommodation",
    title: "Free Accommodation",
    text: "Boarding support for eligible students who travel to study, as approved by the office.",
    icon: "home",
  },
  {
    id: "free-meals",
    title: "Free 3-Time Meals",
    text: "Meal support for eligible boarding and deserving students, offered with dignity.",
    icon: "meals",
  },
  {
    id: "poor-students",
    title: "Support for Poor Students",
    text: "Educational and living support for students whose families cannot meet the cost of study.",
    icon: "heart",
  },
  {
    id: "orphan-education",
    title: "Free Education for Orphans",
    text: "Care and education for orphaned children as cases are reviewed and seats are available.",
    icon: "orphan",
  },
  {
    id: "islamic-modern",
    title: "Islamic & Modern Education",
    text: "Traditional Islamic sciences together with schooling, science, and IT — a balanced path of knowledge.",
    icon: "graduate",
  },
];

export const SERVICE_INSTITUTION_SLUGS = [
  HEADQUARTERS_SLUG,
  "alvasatiya-islamic-center",
  "alvasatiya-it-lab",
  "alvasatiya-science-academy",
  TEHFEEZ_SLUG,
] as const;

export function seedInstitution(slug: string, list: Institution[] = institutions) {
  return list.find((item) => item.slug === slug);
}

export function headquarters(list: Institution[] = institutions) {
  return list.find((item) => item.kind === "headquarters")!;
}

export function tehfeezBranches(list: Institution[] = institutions) {
  return list.filter((item) => item.kind === "branch" && item.parentSlug === TEHFEEZ_SLUG);
}

export function serviceInstitutions(list: Institution[] = institutions) {
  return SERVICE_INSTITUTION_SLUGS.map((slug) => list.find((item) => item.slug === slug)).filter(
    (item): item is Institution => Boolean(item)
  );
}

export function formatStudentCount(value: StatValue) {
  if (value == null) return "To be published";
  return String(value);
}
