export type CourseTestimonial = {
  quote: string;
  name: string;
  role: string;
  course: string;
};

export const COURSE_TESTIMONIALS: CourseTestimonial[] = [
  {
    quote:
      "My daughter started Nazira with no Arabic. Within months she was reading fluently, and the teacher listened to every lesson with patience.",
    name: "Amina R.",
    role: "Parent",
    course: "Nazira-tul-Quran",
  },
  {
    quote:
      "The Hifz plan is clear: new lesson, revision, and listening. I always know what to prepare, and I am not rushed.",
    name: "Yusuf K.",
    role: "Student",
    course: "Hifaz-ul-Quran",
  },
  {
    quote:
      "Tajweed was confusing until a teacher sat with me on each rule. Recitation feels calmer and more correct now.",
    name: "Fatima S.",
    role: "Student",
    course: "Tajweed-o-Qirat",
  },
  {
    quote:
      "Tarjima helped our family understand what we recite in Salah. The lessons are simple, not overwhelming.",
    name: "Imran H.",
    role: "Parent",
    course: "Tarjima-tul-Quran",
  },
  {
    quote:
      "Hadith class taught manners as much as text. The teacher explained with adab, and I use what I learn at home.",
    name: "Maryam A.",
    role: "Student",
    course: "Ilm-ul-Hadees",
  },
  {
    quote:
      "Dars-e-Nizami is serious study, but the teachers keep it organised. I finally have a pathway, not scattered notes.",
    name: "Bilal M.",
    role: "Student",
    course: "Dars-e-Nizami",
  },
];
