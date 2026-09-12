export type CourseLevel = "Beginner" | "Intermediate" | "Advanced" | "All levels";
export type CourseMode = "Online" | "On-site" | "Online & on-site";
export type DurationBand = "short" | "medium" | "long" | "flexible";
export type CourseIconName =
  | "book-open"
  | "book-marked"
  | "languages"
  | "scroll"
  | "audio"
  | "graduation"
  | "users"
  | "heart"
  | "compass"
  | "sparkles"
  | "scale"
  | "landmark"
  | "book-text"
  | "baby"
  | "globe"
  | "star";

export type CourseFaq = { q: string; a: string };

export type Course = {
  slug: string;
  aliases?: string[];
  title: string;
  category: string;
  description: string;
  instructor: string;
  teacherBio: string;
  duration: string;
  durationBand: DurationBand;
  classDuration: string;
  language: string;
  level: CourseLevel;
  mode: CourseMode;
  liveFormat: string;
  image: string;
  banner: string;
  icon: CourseIconName;
  featured?: boolean;
  certificateAvailable: boolean;
  about: string;
  learn: string[];
  topics: string[];
  achieve: string[];
  curriculum: { title: string; items: string[] }[];
  whoFor: string[];
  features: string[];
  faqs: CourseFaq[];
  requirements: string[];
};

export const COURSE_CATEGORIES = ["Quran", "Hifz", "Tajweed", "Hadith", "Fiqh", "Islamic Studies", "Aqidah", "Hajj", "New Muslims", "Children", "Youth", "Language", "Seerah", "Manners"] as const;

export const FEATURED_COURSE_SLUGS = [
  "nazira-tul-quran",
  "hifaz-ul-quran",
  "tajweed-o-qirat",
  "tarjima-tul-quran",
  "tafseer-ul-quran",
  "ilm-ul-hadees",
] as const;

export const WHAT_WE_TEACH = [
  { title: "Memorize Quran", slug: "hifaz-ul-quran", text: "A structured Hifz path with new lesson, revision, and teacher listening." },
  { title: "Quran Translation", slug: "tarjima-tul-quran", text: "Understand the meanings of the Quran through guided Tarjima study." },
  { title: "Quran Learning", slug: "nazira-tul-quran", text: "Look-and-read fluency with Arabic letters, joining, and careful recitation." },
  { title: "Hadith Learning", slug: "ilm-ul-hadees", text: "Selected Hadith and prophetic manners explained with adab and clarity." },
  { title: "Tajweed Rules", slug: "tajweed-o-qirat", text: "Correct pronunciation and beautiful recitation, taught step by step." },
  { title: "Dars-e-Nizami", slug: "dars-e-nizami", text: "A classical pathway in the Islamic sciences with qualified teachers." },
] as const;

const TEACHER = "Qualified Alvasatiya teachers";
const TEACHER_BIO =
  "Classes are taught by teachers approved by Alvasatiya Islamic Center. A named teacher is assigned after verified enrollment.";

const DEFAULT_FAQS: CourseFaq[] = [
  {
    q: "Can I book a free demo first?",
    a: "Yes. Use Book Free Demo, and our team will contact you to confirm a suitable time.",
  },
  {
    q: "When does the student portal open?",
    a: "Student portal access becomes active only after enrollment and secure server-side payment verification.",
  },
  {
    q: "Are classes live online?",
    a: "Most courses are taught live online. Some pathways also offer on-site options where available.",
  },
];

function img(n: number) {
  return `/images/courses/photo-${String(n).padStart(2, "0")}.jpg`;
}

type Draft = Omit<
  Course,
  "instructor" | "teacherBio" | "banner" | "liveFormat" | "faqs" | "features" | "certificateAvailable"
> & {
  banner?: string;
  liveFormat?: string;
  faqs?: CourseFaq[];
  features?: string[];
  certificateAvailable?: boolean;
};

function course(draft: Draft): Course {
  return {
    instructor: TEACHER,
    teacherBio: TEACHER_BIO,
    banner: draft.banner ?? draft.image,
    liveFormat: draft.liveFormat ?? "Live online classes with teacher guidance",
    certificateAvailable: draft.certificateAvailable ?? false,
    faqs: draft.faqs ?? DEFAULT_FAQS,
    features: draft.features ?? [
      "Live teacher-led classes",
      "One-to-one or small-group placement where available",
      "Free demo before enrollment",
      "Progress tracking after verified enrollment",
      "Assignments and quizzes where the course includes them",
      "Learning resources inside the student portal",
    ],
    ...draft,
  };
}

export const courses: Course[] = [
  course({
    slug: "nazira-tul-quran",
    aliases: ["quran-learning"],
    title: "Nazira Tul Quran",
    category: "Quran",
    featured: true,
    description: "Look-and-read Quran study with fluency, accuracy, and regular teacher listening.",
    duration: "About 1 year, according to the student",
    durationBand: "flexible",
    classDuration: "30–45 minutes",
    language: "English & Urdu",
    level: "Beginner",
    mode: "Online & on-site",
    image: img(7),
    icon: "book-open",
    about:
      "Nazira Tul Quran is for students beginning or returning to mushaf reading. Lessons move from letters and connections toward fluent, accurate reading, with short daily practice and gentle correction.",
    learn: [
      "Arabic letters and correct connections",
      "Look-and-read fluency from the mushaf",
      "A calm daily reading habit",
    ],
    topics: ["Alphabet", "Harakat", "Joining letters", "Line fluency", "Short surahs", "Regular revision"],
    achieve: ["Comfortable Nazira reading", "Confidence to continue into Tajweed o Qirat or Hifaz ul Quran"],
    curriculum: [
      { title: "Start", items: ["Letters and connections", "Simple words"] },
      { title: "Mushaf reading", items: ["Line fluency", "Short surahs"] },
      { title: "Care", items: ["Common mistakes", "Daily revision"] },
    ],
    whoFor: ["Beginners", "Children starting Quran reading", "Returning learners"],
    requirements: ["Sincere intention", "A quiet study time", "A readable mushaf or approved digital mushaf"],
  }),
  course({
    slug: "hifaz-ul-quran",
    aliases: ["quran-hifz", "hifz-for-children"],
    title: "Hifaz ul Quran",
    category: "Hifz",
    featured: true,
    description: "A structured memorization pathway with new lesson, revision, and teacher guidance.",
    duration: "According to the student's ability",
    durationBand: "flexible",
    classDuration: "45–60 minutes",
    language: "English & Urdu",
    level: "All levels",
    mode: "Online & on-site",
    image: img(14),
    icon: "book-marked",
    certificateAvailable: true,
    about:
      "Hifaz ul Quran at Alvasatiya is a patient, revision-centered memorization path. Students receive a clear daily lesson, recent revision, and longer-term review so memorization stays firm. Placement depends on current recitation level after a free demo.",
    learn: [
      "A daily Hifz routine that fits the student's pace",
      "New lesson with Tajweed care",
      "Recent and remote revision methods",
      "How to keep memorized portions strong",
    ],
    topics: ["New lesson", "Sabaq revision", "Manzil / remote revision", "Tajweed correction", "Listening and recitation"],
    achieve: [
      "A sustainable memorization habit",
      "Clearer recitation of memorized portions",
      "Teacher-guided progress you can continue at home",
    ],
    curriculum: [
      { title: "Placement", items: ["Recitation check", "Pace agreement", "Revision plan"] },
      { title: "Daily Hifz", items: ["New lesson", "Immediate revision", "Tajweed notes"] },
      { title: "Strengthening", items: ["Recent pages", "Older portions", "Listening practice"] },
    ],
    whoFor: ["Children, youth, and adults who wish to memorize the Quran", "Students who can commit to daily revision"],
    requirements: ["Strong daily commitment", "A readable mushaf or approved digital mushaf", "Family or self-discipline support"],
  }),
  course({
    slug: "tajweed-o-qirat",
    aliases: ["tajweed-rules", "tajweed-course", "qirat-and-recitation"],
    title: "Tajweed o Qirat",
    category: "Tajweed",
    featured: true,
    description: "Study Tajweed and Qirat so recitation is clearer, more beautiful, and more careful.",
    duration: "6–12 months, according to the student",
    durationBand: "medium",
    classDuration: "45 minutes",
    language: "English & Urdu",
    level: "Intermediate",
    mode: "Online & on-site",
    image: img(8),
    icon: "audio",
    certificateAvailable: true,
    about:
      "Tajweed o Qirat trains the tongue and ear: makharij, sifaat, noon and meem rules, lengthening, stopping, and applied recitation. Students recite to a teacher and receive correction.",
    learn: [
      "Points of articulation",
      "Core Tajweed rules used in daily recitation",
      "Applied Qirat in longer passages",
      "Stopping and starting with care",
    ],
    topics: ["Makharij", "Sifaat", "Noon and Meem rules", "Madd", "Waqf", "Teacher listening"],
    achieve: ["Clearer recitation", "Ability to notice and correct common mistakes", "More beautiful, careful Qirat"],
    curriculum: [
      { title: "Sound foundations", items: ["Makharij", "Sifaat"] },
      { title: "Rules in recitation", items: ["Noon sakinah", "Meem sakinah", "Madd"] },
      { title: "Application", items: ["Selected passages", "Qirat practice", "Teacher listening"] },
    ],
    whoFor: ["Students who can already read Arabic script", "Hifz students needing correction"],
    requirements: ["Ability to read Arabic script", "Regular practice time"],
  }),
  course({
    slug: "tarjima-tul-quran",
    aliases: ["quran-translation", "tarjuma-tul-quran"],
    title: "Tarjima tul Quran",
    category: "Quran",
    featured: true,
    description: "Understand Quranic meanings through guided translation study and careful reflection.",
    duration: "1 year",
    durationBand: "long",
    classDuration: "45 minutes",
    language: "English & Urdu",
    level: "Intermediate",
    mode: "Online",
    image: img(2),
    icon: "languages",
    about:
      "Tarjima tul Quran helps students understand selected Quranic passages through word meanings, sentence sense, and teacher explanation. It is educational translation study, not a personal fatwa service.",
    learn: [
      "Word and phrase meanings of selected passages",
      "How to follow a translation with teacher notes",
      "Thematic reflection without inventing rulings",
    ],
    topics: ["Selected surahs", "Word meanings", "Context reminders", "Manners of reflection"],
    achieve: ["Clearer understanding of studied passages", "A respectful method for reading translation"],
    curriculum: [
      { title: "Foundations", items: ["How translation study works", "Key vocabulary"] },
      { title: "Guided passages", items: ["Selected short surahs", "Selected longer passages"] },
      { title: "Review", items: ["Meaning recap", "Questions with the teacher"] },
    ],
    whoFor: ["Students who can read Arabic script", "Learners seeking meanings with teacher guidance"],
    requirements: ["Basic Quran reading", "Willingness to review vocabulary"],
  }),
  course({
    slug: "tafseer-ul-quran",
    aliases: ["quran-tafseer"],
    title: "Tafseer ul Quran",
    category: "Quran",
    featured: true,
    description: "Guided tafsir study of selected passages with teacher explanation and careful notes.",
    duration: "1 year",
    durationBand: "long",
    classDuration: "45 minutes",
    language: "English & Urdu",
    level: "Intermediate",
    mode: "Online",
    image: img(19),
    icon: "book-text",
    about:
      "Tafseer ul Quran is selected-passage tafsir for students. The course explains meanings already taught by qualified teachers; it does not produce new religious rulings.",
    learn: ["How tafsir lessons are followed", "Meanings of selected passages", "Adab of Quran study"],
    topics: ["Selected surahs", "Themes", "Vocabulary", "Teacher notes"],
    achieve: ["Deeper understanding of studied passages", "Better adab in Quran study"],
    curriculum: [
      { title: "Method", items: ["How we study tafsir"] },
      { title: "Passages", items: ["Selected short surahs", "Selected themes"] },
      { title: "Review", items: ["Questions", "Revision"] },
    ],
    whoFor: ["Students with basic Quran reading and translation familiarity"],
    requirements: ["Basic Quran reading recommended"],
  }),
  course({
    slug: "ilm-ul-hadees",
    aliases: ["hadith-learning", "hadith-for-beginners"],
    title: "Ilm ul Hadees",
    category: "Hadith",
    featured: true,
    description: "Study selected Hadith and prophetic manners with teacher explanation.",
    duration: "2 years",
    durationBand: "long",
    classDuration: "1 hour",
    language: "English & Urdu",
    level: "Intermediate",
    mode: "Online & on-site",
    image: img(1),
    icon: "scroll",
    about:
      "Ilm ul Hadees introduces selected narrations, meanings, and practical manners. Lessons stay educational and do not replace asking a qualified scholar for personal rulings.",
    learn: [
      "Selected Hadith with meanings",
      "Adab of the Prophet ﷺ at a student level",
      "How to study with humility and teacher notes",
    ],
    topics: ["Selected collections", "Meanings", "Manners", "Practical lessons"],
    achieve: ["A grounded introduction to Hadith study", "Better adab in daily life from studied texts"],
    curriculum: [
      { title: "Introduction", items: ["What Hadith study is", "Respectful method"] },
      { title: "Selected texts", items: ["Short narrations", "Meanings and context reminders"] },
      { title: "Practice", items: ["Manners", "Review questions"] },
    ],
    whoFor: ["Students with basic Islamic knowledge", "Learners who can follow structured lessons"],
    requirements: ["Ability to follow structured lessons"],
  }),
  course({
    slug: "ilm-ul-fiqh",
    title: "Ilm ul Fiqh",
    category: "Fiqh",
    featured: true,
    description: "Practical Islamic jurisprudence covering worship and everyday questions at an educational level.",
    duration: "18 months",
    durationBand: "long",
    classDuration: "45–60 minutes",
    language: "English & Urdu",
    level: "Intermediate",
    mode: "Online & on-site",
    image: img(10),
    icon: "scale",
    about:
      "Ilm ul Fiqh teaches worship and daily-life rulings as educational study. Personal or complex cases should be referred to a qualified scholar; this course does not issue fatwas.",
    learn: [
      "Foundations of worship at a student level",
      "How to study fiqh with a teacher",
      "When to ask a mufti instead of self-ruling",
    ],
    topics: ["Taharah", "Salah", "Sawm", "Zakat outlines", "Everyday adab of rulings"],
    achieve: ["Clearer knowledge of studied chapters", "A respectful habit of asking qualified scholars"],
    curriculum: [
      { title: "Worship", items: ["Purification", "Prayer"] },
      { title: "Further chapters", items: ["Fasting", "Zakat outlines"] },
      { title: "Method", items: ["How students study fiqh", "When to seek a fatwa"] },
    ],
    whoFor: ["Students seeking structured fiqh study", "Adults wanting educational clarity in worship"],
    requirements: ["Sincere intention", "Willingness to review lessons"],
  }),
  course({
    slug: "usul-al-hadees",
    title: "Usul al Hadees",
    category: "Hadith",
    featured: true,
    description: "Foundations of Hadith methodology taught with humility and teacher guidance.",
    duration: "1 year",
    durationBand: "long",
    classDuration: "45 minutes",
    language: "English & Urdu",
    level: "Advanced",
    mode: "Online",
    image: img(16),
    icon: "compass",
    about:
      "Usul al Hadees introduces how scholars classify and study narrations. It is educational methodology, not a license to authenticate or reject reports independently.",
    learn: [
      "Key terms of Hadith methodology at a student level",
      "Why chains and texts are studied with care",
      "Humility before the work of hadith scholars",
    ],
    topics: ["Basic terms", "Types of reports at an intro level", "Adab of Hadith study", "Teacher notes"],
    achieve: ["A respectful map of Hadith usul", "Readiness to continue under qualified teachers"],
    curriculum: [
      { title: "Terms", items: ["Core vocabulary", "Why methodology matters"] },
      { title: "Study method", items: ["Listening to scholars", "Avoiding hasty judgments"] },
      { title: "Review", items: ["Questions", "Revision"] },
    ],
    whoFor: ["Students who have begun Ilm ul Hadees", "Serious learners of Islamic sciences"],
    requirements: ["Prior Hadith or Islamic studies recommended"],
  }),
  course({
    slug: "usul-al-fiqh",
    aliases: ["usul-al-fiqh-intro"],
    title: "Usul al Fiqh",
    category: "Fiqh",
    featured: true,
    description: "How scholars approach evidence — taught as education, not for issuing fatwas.",
    duration: "1 year",
    durationBand: "long",
    classDuration: "45 minutes",
    language: "English & Urdu",
    level: "Advanced",
    mode: "Online",
    image: img(11),
    icon: "graduation",
    about:
      "Usul al Fiqh explains, at a student level, how qualified scholars read evidence. Students must not issue fatwas from this course. Personal cases belong with a mufti.",
    learn: [
      "What usul is",
      "Why students must not issue fatwas",
      "How scholars approach evidence at a high level",
    ],
    topics: ["Sources at an intro level", "Adab of disagreement", "Limits of student study"],
    achieve: ["A cautious introduction to usul", "Clearer respect for qualified scholarship"],
    curriculum: [
      { title: "Foundations", items: ["What usul is", "Who may issue rulings"] },
      { title: "Study", items: ["Teacher-led overview", "Selected examples"] },
      { title: "Limits", items: ["Student boundaries", "When to ask a scholar"] },
    ],
    whoFor: ["Students of Ilm ul Fiqh ready for methodology", "Serious learners under teacher care"],
    requirements: ["Ilm ul Fiqh or equivalent recommended"],
  }),
  course({
    slug: "ilm-ul-fraiz",
    aliases: ["ilm-ul-faraid", "faraid"],
    title: "Ilm ul Fraiz",
    category: "Fiqh",
    featured: true,
    description: "Educational study of Islamic inheritance (Faraid) with teacher notes and careful examples.",
    duration: "8 months",
    durationBand: "medium",
    classDuration: "45 minutes",
    language: "English & Urdu",
    level: "Intermediate",
    mode: "Online",
    image: img(13),
    icon: "landmark",
    about:
      "Ilm ul Fraiz teaches the well-known shares and principles of Islamic inheritance as classroom study. Real estates, family disputes, and personal cases must be taken to a qualified scholar; this course does not divide estates.",
    learn: [
      "Core heirs and shares at a student level",
      "Why inheritance needs qualified guidance",
      "How to study Faraid without applying it to a real case",
    ],
    topics: ["Quranic shares at an intro level", "Types of heirs", "Worked classroom examples", "When to consult a mufti"],
    achieve: ["Clearer knowledge of studied Faraid chapters", "A firm habit of referring real cases to scholars"],
    curriculum: [
      { title: "Foundations", items: ["What Faraid is", "Adab of inheritance study"] },
      { title: "Shares", items: ["Primary heirs", "Classroom examples"] },
      { title: "Limits", items: ["Real cases go to a scholar", "Review"] },
    ],
    whoFor: ["Students of fiqh", "Adults seeking educational clarity, not a legal division of property"],
    requirements: ["Basic fiqh study recommended"],
  }),
  course({
    slug: "dars-e-nizami",
    title: "Dars e Nizami",
    category: "Islamic Studies",
    featured: true,
    description: "A classical Islamic sciences pathway covering core texts under qualified teacher guidance.",
    duration: "According to the student's stage",
    durationBand: "flexible",
    classDuration: "60–90 minutes",
    language: "Urdu & Arabic",
    level: "Advanced",
    mode: "Online & on-site",
    image: img(16),
    icon: "graduation",
    certificateAvailable: true,
    about:
      "Dars e Nizami at Alvasatiya is an educational classical pathway. Placement depends on prior study. Text lists and pacing are confirmed after a demo with the academic team.",
    learn: [
      "How to study classical texts with a teacher",
      "Foundations across core Islamic sciences at the student's stage",
      "Discipline, revision, and respectful questioning",
    ],
    topics: ["Arabic tools", "Fiqh foundations", "Hadith and Tafsir at stage level", "Aqidah studies as assigned"],
    achieve: ["A clear stage-based study plan", "Progress through assigned texts with teacher oversight"],
    curriculum: [
      { title: "Placement", items: ["Prior study review", "Stage assignment"] },
      { title: "Core sciences", items: ["Assigned texts", "Lesson and review"] },
      { title: "Assessment", items: ["Oral review", "Written tasks where used"] },
    ],
    whoFor: ["Serious students of Islamic sciences", "Learners ready for longer structured study"],
    requirements: ["Prior reading ability in Urdu or Arabic as required by stage", "Regular study hours"],
  }),
  course({
    slug: "khatam-e-nabuwat",
    aliases: ["khatm-e-nubuwwat", "finality-of-prophethood"],
    title: "Khatam e Nabuwat",
    category: "Aqidah",
    featured: true,
    description: "The finality of the prophethood of Muhammad ﷺ, taught with care, evidence, and adab.",
    duration: "3 months",
    durationBand: "short",
    classDuration: "45 minutes",
    language: "English & Urdu",
    level: "All levels",
    mode: "Online & on-site",
    image: img(4),
    icon: "star",
    about:
      "Khatam e Nabuwat teaches that Prophet Muhammad ﷺ is the Seal of the Prophets. Lessons stay educational, respectful, and grounded in well-known texts. The course is not a platform for abuse or personal attacks; complex cases belong with qualified scholars.",
    learn: [
      "The meaning of Khatam e Nabuwat at a student level",
      "Selected Quranic and Hadith evidence as taught by the teacher",
      "Adab in belief, speech, and disagreement",
    ],
    topics: ["Seal of the Prophets ﷺ", "Selected evidences", "Love and respect for the Prophet ﷺ", "Adab of discussion"],
    achieve: ["A clear educational understanding of finality of prophethood", "Better adab when this topic is discussed"],
    curriculum: [
      { title: "Belief", items: ["What Khatam e Nabuwat means", "Why it matters"] },
      { title: "Evidence", items: ["Selected Quranic verses", "Selected Hadith as assigned"] },
      { title: "Adab", items: ["Respectful speech", "When to ask a scholar"] },
    ],
    whoFor: ["General students and families", "Anyone seeking a calm, teacher-led explanation"],
    requirements: ["Sincere intention", "Willingness to study with adab"],
  }),
  course({
    slug: "taharat",
    title: "Taharat",
    category: "Fiqh",
    featured: true,
    description: "Purification for worship: wudu, ghusl, and related fiqh taught clearly at a student level.",
    duration: "2 months",
    durationBand: "short",
    classDuration: "30–45 minutes",
    language: "English & Urdu",
    level: "Beginner",
    mode: "Online & on-site",
    image: img(9),
    icon: "sparkles",
    about:
      "Taharat covers purification that prepares a person for Salah and other worship. Lessons are practical and educational. Unusual or personal medical questions should be confirmed with a qualified scholar or teacher.",
    learn: [
      "What breaks and what completes wudu at a student level",
      "When ghusl is required, as commonly taught",
      "Cleanliness of body, clothes, and place of prayer",
    ],
    topics: ["Wudu", "Ghusl", "Najasah outlines", "Istinja", "Preparation for Salah"],
    achieve: ["Clearer daily purification practice", "Confidence to ask a teacher about unclear cases"],
    curriculum: [
      { title: "Wudu", items: ["Steps", "What nullifies wudu"] },
      { title: "Ghusl", items: ["When it is required", "How it is performed as taught"] },
      { title: "Daily care", items: ["Clothes and place", "Common questions"] },
    ],
    whoFor: ["Beginners", "New Muslims", "Anyone wanting a clear refresh of purification"],
    requirements: ["Sincere intention", "A quiet study time"],
  }),
  course({
    slug: "hajj-course",
    aliases: ["hajj-and-umrah"],
    title: "Hajj Course",
    category: "Hajj",
    featured: true,
    description: "Educational preparation for Hajj and Umrah rites with teacher notes and a clear outline of the journey.",
    duration: "1–2 months",
    durationBand: "short",
    classDuration: "45 minutes",
    language: "English & Urdu",
    level: "Beginner",
    mode: "Online",
    image: img(12),
    icon: "landmark",
    about:
      "The Hajj Course explains well-known rites of Hajj and Umrah as classroom study. Personal circumstances, health, and fiqh details should be confirmed with a qualified scholar. This course does not replace official travel or visa guidance.",
    learn: [
      "Ihram at a student level",
      "Tawaf, Sa'i, and related rites as commonly taught",
      "A list of questions to confirm with a scholar before travel",
    ],
    topics: ["Ihram", "Tawaf", "Sa'i", "Arafah and related Hajj days", "Umrah outline", "Halq or Qasr"],
    achieve: ["Clearer preparation knowledge before travel", "Better questions for a local scholar or mufti"],
    curriculum: [
      { title: "Before travel", items: ["Intention", "Ihram"] },
      { title: "Rites", items: ["Tawaf", "Sa'i", "Hajj days at an outline level"] },
      { title: "Completion", items: ["Halq or Qasr", "When to ask a mufti"] },
    ],
    whoFor: ["Intending pilgrims", "Students wanting educational Hajj and Umrah knowledge"],
    requirements: ["Intending pilgrims and general students welcome"],
  }),
  course({
    slug: "umrah-course",
    aliases: ["ahkam-e-umra", "umrah"],
    title: "Umrah Course",
    category: "Hajj",
    featured: true,
    description: "Educational outline of Umrah rites: Ihram, Tawaf, Sa'i, and Halq or Qasr, with teacher notes.",
    duration: "1 month",
    durationBand: "short",
    classDuration: "30–45 minutes",
    language: "English & Urdu",
    level: "Beginner",
    mode: "Online",
    image: img(3),
    icon: "compass",
    about:
      "The Umrah Course explains well-known Umrah rites as classroom study. Personal health, travel, and fiqh details should be confirmed with a qualified scholar. This course does not replace official travel or visa guidance.",
    learn: [
      "Ihram for Umrah at a student level",
      "Tawaf and Sa'i as commonly taught",
      "Halq or Qasr and when to ask a mufti",
    ],
    topics: ["Intention", "Ihram", "Tawaf", "Sa'i", "Halq or Qasr"],
    achieve: ["Clearer Umrah preparation knowledge", "A list of questions to confirm with a scholar"],
    curriculum: [
      { title: "Before travel", items: ["Intention", "Ihram"] },
      { title: "Rites", items: ["Tawaf", "Sa'i"] },
      { title: "Completion", items: ["Halq or Qasr", "When to ask a mufti"] },
    ],
    whoFor: ["Intending Umrah pilgrims", "Students wanting educational Umrah knowledge"],
    requirements: ["Intending pilgrims and general students welcome"],
  }),
  course({
    slug: "new-muslim-course",
    aliases: ["new-muslim-essentials"],
    title: "New Muslim Course",
    category: "New Muslims",
    featured: true,
    description: "A calm beginner path covering Shahadah, wudu, Salah, Quran, beliefs, and manners.",
    duration: "3 months",
    durationBand: "short",
    classDuration: "30–45 minutes",
    language: "English & Urdu",
    level: "Beginner",
    mode: "Online",
    image: img(6),
    icon: "heart",
    about:
      "The New Muslim Course welcomes new Muslims and anyone beginning Islam without pressure. Lessons move slowly through faith, purification, prayer, and character. A teacher is assigned after enrollment.",
    learn: [
      "Shahadah and basic beliefs in simple language",
      "Wudu and Salah with teacher demonstration",
      "A first map of Quran, manners, and daily worship",
    ],
    topics: ["Shahadah", "Wudu", "Salah", "Short surahs", "Basic beliefs", "Islamic manners"],
    achieve: ["A calm first learning map", "Confidence to continue into Nazira, Taharat, and other courses"],
    curriculum: [
      { title: "Faith", items: ["Shahadah", "Basic beliefs"] },
      { title: "Worship", items: ["Wudu", "Salah"] },
      { title: "Daily life", items: ["Manners", "Where to ask questions"] },
    ],
    whoFor: ["New Muslims", "Anyone returning to basics"],
    requirements: ["Sincere intention", "No prior Arabic required"],
  }),
  course({
    slug: "ahkam-e-shariat",
    aliases: ["ahkam-e-shariah"],
    title: "Ahkam e Shariat",
    category: "Fiqh",
    featured: true,
    description: "Everyday rulings of Shariah taught as education — worship, food, dress, and manners — not as fatwa.",
    duration: "6 months",
    durationBand: "medium",
    classDuration: "45 minutes",
    language: "English & Urdu",
    level: "Intermediate",
    mode: "Online & on-site",
    image: img(15),
    icon: "scale",
    about:
      "Ahkam e Shariat surveys well-known rulings that affect daily Muslim life. Lessons stay educational. Personal, medical, or financial cases must be referred to a qualified scholar; this course does not issue fatwas.",
    learn: [
      "How students study ahkam with a teacher",
      "Selected chapters of worship and daily life",
      "When to ask a mufti instead of self-ruling",
    ],
    topics: ["Worship outlines", "Halal and haram at a student level", "Dress and manners", "When to seek a fatwa"],
    achieve: ["Clearer knowledge of studied chapters", "A respectful habit of asking qualified scholars"],
    curriculum: [
      { title: "Worship", items: ["Selected salah and fasting notes"] },
      { title: "Daily life", items: ["Food", "Dress", "Manners"] },
      { title: "Limits", items: ["Student boundaries", "Referring hard cases"] },
    ],
    whoFor: ["Adults seeking educational clarity", "Students of fiqh"],
    requirements: ["Sincere intention", "Willingness to review lessons"],
  }),
  course({
    slug: "basic-islam-for-children",
    aliases: ["childrens-islamic-education", "quran-for-children"],
    title: "Basic Islam for Children",
    category: "Children",
    featured: true,
    description: "Gentle lessons in belief, Salah, Quran listening, and manners for children, with guardian partnership.",
    duration: "Flexible",
    durationBand: "flexible",
    classDuration: "20–30 minutes",
    language: "English & Urdu",
    level: "Beginner",
    mode: "Online & on-site",
    image: img(17),
    icon: "baby",
    about:
      "Basic Islam for Children uses short lessons, stories, and repetition. Pace is never forced. Guardians are encouraged to sit nearby and continue practice at home.",
    learn: [
      "Allah, the Prophet ﷺ, and simple beliefs",
      "Cleanliness and Salah at a child level",
      "Kind speech, honesty, and Quran love",
    ],
    topics: ["Iman in simple words", "Wudu play-practice", "Salah movements", "Short duas", "Akhlaq"],
    achieve: ["A warm first map of Islam", "Habits a child can continue at home"],
    curriculum: [
      { title: "Faith", items: ["Allah", "Prophet ﷺ"] },
      { title: "Worship", items: ["Wudu", "Salah steps"] },
      { title: "Character", items: ["Manners", "Short duas"] },
    ],
    whoFor: ["Children with a guardian nearby", "Families starting Islamic education at home"],
    requirements: ["Guardian involvement", "Short, regular practice time"],
  }),
  course({
    slug: "basic-islam-for-youngers",
    aliases: ["basic-islam-for-youth"],
    title: "Basic Islam for Youngers",
    category: "Youth",
    featured: true,
    description: "Clear Islamic foundations for teens and youth: belief, worship, character, and living with adab today.",
    duration: "4 months",
    durationBand: "short",
    classDuration: "40 minutes",
    language: "English & Urdu",
    level: "Beginner",
    mode: "Online",
    image: img(18),
    icon: "users",
    about:
      "Basic Islam for Youngers speaks to teenagers and youth with respect. Lessons cover belief, Salah, the Prophet ﷺ, and character without pressure or harshness. Personal cases still belong with a trusted teacher or scholar.",
    learn: [
      "Core beliefs in clear language",
      "Salah and daily worship that fits a young schedule",
      "Honesty, courage, and mercy from the Seerah",
    ],
    topics: ["Iman", "Salah", "Halal living at a student level", "Seerah character", "Friends and screens with adab"],
    achieve: ["A memorable map of basic Islam", "Better questions for teachers and family"],
    curriculum: [
      { title: "Belief", items: ["Tawhid", "Love of the Prophet ﷺ"] },
      { title: "Worship", items: ["Salah", "Quran time"] },
      { title: "Character", items: ["Adab", "Youth choices"] },
    ],
    whoFor: ["Teenagers and youth", "Youth groups with a responsible adult aware of the class"],
    requirements: ["Guardian awareness recommended for younger teens"],
  }),
  course({
    slug: "urdu-language-course",
    aliases: ["urdu-course"],
    title: "Urdu Language Course",
    category: "Language",
    featured: true,
    description: "Read, write, and speak Urdu for Islamic study, Dars e Nizami support, and daily communication.",
    duration: "6–12 months, according to the student",
    durationBand: "medium",
    classDuration: "45 minutes",
    language: "Urdu & English",
    level: "Beginner",
    mode: "Online",
    image: img(20),
    icon: "languages",
    about:
      "The Urdu Language Course builds letters, reading, writing, and spoken Urdu so students can follow Islamic lessons and daily conversation. Placement depends on current level after a free demo.",
    learn: [
      "Urdu letters and joining",
      "Basic reading and writing",
      "Spoken Urdu for class and home",
    ],
    topics: ["Alphabet", "Reading", "Writing", "Speaking", "Islamic classroom vocabulary"],
    achieve: ["Comfortable beginner Urdu", "Readiness to follow Urdu Islamic lessons more easily"],
    curriculum: [
      { title: "Letters", items: ["Alphabet", "Joining"] },
      { title: "Literacy", items: ["Reading", "Writing"] },
      { title: "Speech", items: ["Daily phrases", "Classroom Urdu"] },
    ],
    whoFor: ["Beginners", "Students preparing for Urdu Islamic classes"],
    requirements: ["Sincere intention", "Regular practice time"],
  }),
  course({
    slug: "famous-surahs-hifaz",
    title: "Famous Surahs Hifaz",
    category: "Hifz",
    featured: true,
    description: "Memorize selected well-known surahs with Tajweed care, revision, and teacher listening.",
    duration: "According to the student's pace",
    durationBand: "flexible",
    classDuration: "30–45 minutes",
    language: "English & Urdu",
    level: "Beginner",
    mode: "Online & on-site",
    image: img(21),
    icon: "book-marked",
    about:
      "Famous Surahs Hifaz is for students who want to memorize selected surahs used in daily Salah and family recitation. Lessons stay short, with revision so memorization stays firm. The list of surahs is confirmed after a demo.",
    learn: [
      "A small, clear Hifz routine",
      "Selected famous surahs with teacher listening",
      "Revision so new lesson does not fade",
    ],
    topics: ["Short surahs", "Selected longer famous surahs as placed", "Tajweed care", "Daily revision"],
    achieve: ["Memorized portions you can recite in Salah", "A habit of revising what you have learned"],
    curriculum: [
      { title: "Placement", items: ["Current recitation check", "Surah list"] },
      { title: "Memorization", items: ["New lesson", "Immediate revision"] },
      { title: "Strengthening", items: ["Older surahs", "Listening practice"] },
    ],
    whoFor: ["Children, youth, and adults", "Students not yet ready for full Hifaz ul Quran"],
    requirements: ["Basic Quran reading recommended", "Daily revision time"],
  }),
  course({
    slug: "noorani-qaida",
    aliases: ["qaida"],
    title: "Noorani Qaida",
    category: "Quran",
    featured: true,
    description: "Letters, harakat, and joining so students are ready for Nazira Tul Quran.",
    duration: "2–6 months, according to the student",
    durationBand: "short",
    classDuration: "20–30 minutes",
    language: "English & Urdu",
    level: "Beginner",
    mode: "Online & on-site",
    image: img(22),
    icon: "book-open",
    about:
      "Noorani Qaida moves slowly from isolated letters to joined reading. It is the usual first step before Nazira Tul Quran. Pace is never forced.",
    learn: [
      "Arabic letters with correct sounds",
      "Harakat, sukoon, and shaddah at a beginner level",
      "Joining letters into simple words",
    ],
    topics: ["Alphabet", "Harakat", "Joining", "Simple words", "Revision"],
    achieve: ["Readiness for Nazira Tul Quran", "Confidence with basic Arabic script"],
    curriculum: [
      { title: "Letters", items: ["Isolated forms", "Sounds"] },
      { title: "Marks", items: ["Harakat", "Sukoon and shaddah"] },
      { title: "Joining", items: ["Connected letters", "Short words"] },
    ],
    whoFor: ["Complete beginners", "Children with a guardian nearby"],
    requirements: ["Sincere intention", "Short daily practice"],
  }),
  course({
    slug: "adaab-e-parents",
    title: "Adaab e Parents",
    category: "Manners",
    featured: true,
    description: "Honouring parents through Quran, Hadith, and daily manners, taught with gentleness.",
    duration: "2 months",
    durationBand: "short",
    classDuration: "30–40 minutes",
    language: "English & Urdu",
    level: "All levels",
    mode: "Online",
    image: img(23),
    icon: "heart",
    about:
      "Adaab e Parents teaches the rights of parents as educational study from well-known texts. Lessons encourage kindness, dua, and service. Family disputes and personal cases belong with a trusted elder or scholar, not with self-ruling from class notes.",
    learn: [
      "Selected Quranic and Hadith teachings on parents",
      "Speech, service, and dua for parents",
      "Adab when parents are elderly or when one has passed away",
    ],
    topics: ["Birr al-walidayn", "Kind speech", "Service", "Dua", "Limits of student advice"],
    achieve: ["A warmer daily practice toward parents", "Clearer knowledge of studied texts"],
    curriculum: [
      { title: "Texts", items: ["Selected verses", "Selected Hadith"] },
      { title: "Practice", items: ["Speech", "Service"] },
      { title: "Dua", items: ["Living parents", "Deceased parents"] },
    ],
    whoFor: ["Youth and adults", "Families studying together"],
    requirements: ["Sincere intention"],
  }),
  course({
    slug: "ahl-e-bait",
    title: "Ahl e Bait Course",
    category: "Seerah",
    featured: true,
    description: "Love and respect for the household of the Prophet ﷺ, taught with adab and well-known sources.",
    duration: "3 months",
    durationBand: "short",
    classDuration: "40 minutes",
    language: "English & Urdu",
    level: "All levels",
    mode: "Online",
    image: img(24),
    icon: "star",
    about:
      "The Ahl e Bait Course introduces the blessed household of Prophet Muhammad ﷺ with love, respect, and teacher notes. Lessons stay educational and avoid harsh dispute. Complex historical questions should be referred to qualified scholars.",
    learn: [
      "Who is meant by Ahl e Bait at a student level",
      "Love, respect, and salutations with adab",
      "Selected well-known reports as assigned by the teacher",
    ],
    topics: ["The Prophet ﷺ", "Family of the Prophet ﷺ", "Adab of love", "Selected seerah notes"],
    achieve: ["A respectful introduction to Ahl e Bait", "Better adab in speech about the Prophet's ﷺ household"],
    curriculum: [
      { title: "Introduction", items: ["Meaning of Ahl e Bait", "Why love and respect"] },
      { title: "Study", items: ["Selected figures", "Teacher notes"] },
      { title: "Adab", items: ["Speech", "When to ask a scholar"] },
    ],
    whoFor: ["General students and families", "Anyone seeking a calm, teacher-led explanation"],
    requirements: ["Sincere intention", "Willingness to study with adab"],
  }),
  course({
    slug: "parents-of-muhammad",
    aliases: ["parents-of-the-prophet"],
    title: "Parents of Muhammad ﷺ",
    category: "Seerah",
    featured: true,
    description: "Seerah lessons on the noble parents of the Messenger ﷺ, taught with love, care, and teacher notes.",
    duration: "6 weeks",
    durationBand: "short",
    classDuration: "30–40 minutes",
    language: "English & Urdu",
    level: "All levels",
    mode: "Online",
    image: img(4),
    icon: "users",
    about:
      "This course introduces the parents of Prophet Muhammad ﷺ as educational Seerah study. Lessons stay respectful. Detailed historical or theological disputes are left to qualified scholars.",
    learn: [
      "A clear Seerah outline of the Prophet's ﷺ parents",
      "The Makkan setting of his early life",
      "Adab when speaking about the family of the Messenger ﷺ",
    ],
    topics: ["Abdullah ibn Abd al-Muttalib", "Aminah bint Wahb", "Early Seerah setting", "Adab of discussion"],
    achieve: ["A respectful Seerah map of this chapter", "Better questions for further study"],
    curriculum: [
      { title: "Family", items: ["Lineage at a student level", "Makkan setting"] },
      { title: "Seerah notes", items: ["Selected reports", "Teacher explanation"] },
      { title: "Adab", items: ["Respectful speech", "Further reading with a teacher"] },
    ],
    whoFor: ["General students", "Families and youth studying Seerah"],
    requirements: ["Sincere intention"],
  }),
  course({
    slug: "qurbani-course",
    aliases: ["udhiyah", "qurbani"],
    title: "Qurbani Course",
    category: "Fiqh",
    featured: true,
    description: "Educational study of Qurbani / Udhiyah: meaning, well-known rulings, and adab — not a fatwa service.",
    duration: "4 weeks",
    durationBand: "short",
    classDuration: "40 minutes",
    language: "English & Urdu",
    level: "Beginner",
    mode: "Online",
    image: img(5),
    icon: "sparkles",
    about:
      "The Qurbani Course explains the meaning of Udhiyah and well-known educational rulings. Personal wealth, shares, and local practice must be confirmed with a qualified scholar. This course does not issue fatwas or arrange slaughter.",
    learn: [
      "What Qurbani is at a student level",
      "Well-known conditions as commonly taught",
      "When to ask a mufti about your own case",
    ],
    topics: ["Meaning of Udhiyah", "Who it concerns at an outline level", "Time of Qurbani", "Sharing meat", "Adab"],
    achieve: ["Clearer educational knowledge before Eid", "Better questions for a local scholar"],
    curriculum: [
      { title: "Meaning", items: ["Why Qurbani is taught", "Selected texts"] },
      { title: "Rulings outline", items: ["Well-known conditions", "Classroom examples"] },
      { title: "Limits", items: ["Personal cases go to a scholar"] },
    ],
    whoFor: ["Adults preparing for Eid", "Students of fiqh"],
    requirements: ["Sincere intention"],
  }),
  course({
    slug: "seerat-e-mustafa",
    aliases: ["seerat-un-nabi", "seerah-for-youth"],
    title: "Seerat e Mustafa",
    category: "Seerah",
    featured: true,
    description: "The blessed life of Prophet Muhammad ﷺ taught with love, a clear timeline, and practical character lessons.",
    duration: "6–12 months",
    durationBand: "medium",
    classDuration: "45 minutes",
    language: "English & Urdu",
    level: "All levels",
    mode: "Online & on-site",
    image: img(1),
    icon: "scroll",
    about:
      "Seerat e Mustafa walks through the life of the Messenger ﷺ from Makkah to Madinah with teacher notes. The aim is love, knowledge, and character — not debate. Personal rulings are not taken from Seerah class.",
    learn: [
      "A clear timeline of the Seerah",
      "Mercy, truthfulness, and patience of the Prophet ﷺ",
      "How students take character lessons without inventing rulings",
    ],
    topics: ["Makkan years", "Hijrah", "Madinan community", "Character of the Prophet ﷺ"],
    achieve: ["A memorable Seerah map", "Stronger love and adab toward the Messenger ﷺ"],
    curriculum: [
      { title: "Makkah", items: ["Early life", "Call and patience"] },
      { title: "Hijrah", items: ["Migration", "Madinah"] },
      { title: "Character", items: ["Mercy", "Honesty", "Review"] },
    ],
    whoFor: ["Families, youth, and adults", "Anyone wanting a teacher-led Seerah"],
    requirements: ["Sincere intention"],
  }),
  course({
    slug: "namaz-course",
    aliases: ["salah-course"],
    title: "Namaz Course",
    category: "Fiqh",
    featured: true,
    description: "Learn Salah step by step: purification, movements, short recitation, and the five daily prayers.",
    duration: "2–3 months",
    durationBand: "short",
    classDuration: "30–45 minutes",
    language: "English & Urdu",
    level: "Beginner",
    mode: "Online & on-site",
    image: img(8),
    icon: "compass",
    about:
      "The Namaz Course teaches Salah as practical worship with a teacher. Students learn wudu, the prayer movements, and short recitation. Personal or medical difficulties should be asked of a qualified teacher or scholar.",
    learn: [
      "Wudu for Salah at a student level",
      "The units and movements of prayer",
      "Short surahs and duas used in Namaz",
    ],
    topics: ["Wudu", "Adhan outline", "Fard prayers", "Movements", "Short recitation", "Common mistakes"],
    achieve: ["Confidence to pray the five daily Salah with teacher correction", "A list of questions for further fiqh study"],
    curriculum: [
      { title: "Preparation", items: ["Taharat outline", "Wudu"] },
      { title: "Salah", items: ["Takbir to salam", "Short surahs"] },
      { title: "Practice", items: ["Teacher listening", "Daily five prayers"] },
    ],
    whoFor: ["Beginners", "New Muslims", "Anyone wanting a clear refresh of Salah"],
    requirements: ["Sincere intention", "A quiet practice space"],
  }),
];

export function getCourse(slug: string, list: Course[] = courses) {
  return list.find((c) => c.slug === slug || c.aliases?.includes(slug));
}

export function getFeaturedCourses(list: Course[] = courses) {
  return FEATURED_COURSE_SLUGS.map((slug) => getCourse(slug, list))
    .filter((c): c is Course => Boolean(c))
    .slice(0, 6);
}

export function allCourseParams(list: Course[] = courses) {
  const slugs = new Set<string>();
  for (const course of list) {
    slugs.add(course.slug);
    course.aliases?.forEach((alias) => slugs.add(alias));
  }
  return [...slugs].map((slug) => ({ slug }));
}

export const COURSE_LANGUAGES = [...new Set(courses.map((c) => c.language))];
export const COURSE_LEVELS: CourseLevel[] = ["Beginner", "Intermediate", "Advanced", "All levels"];
export const DURATION_FILTERS: { id: DurationBand | "all"; label: string }[] = [
  { id: "all", label: "All durations" },
  { id: "short", label: "Up to 4 months" },
  { id: "medium", label: "5–8 months" },
  { id: "long", label: "9 months or longer" },
  { id: "flexible", label: "Flexible / ongoing" },
];
