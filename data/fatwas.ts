export type Fatwa = {
  id: string;
  category: string;
  question: string;
  answer: string;
  scholar: string;
  date: string;
};

export const FATWA_CATEGORIES = [
  "Worship",
  "Quran & Tajweed",
  "Zakat & Charity",
  "Family",
  "Fasting",
  "Hajj & Umrah",
  "General",
] as const;

export const fatwas: Fatwa[] = [
  {
    id: "f-001",
    category: "Worship",
    question: "How can a beginner start learning the prayer with confidence?",
    answer:
      "Begin with purification and a teacher-guided demonstration of Salah. Learn one step at a time, practice daily, and ask a qualified local teacher about details that depend on your school of jurisprudence. This answer is educational, not a personal fatwa.",
    scholar: "Alvasatiya Review Desk",
    date: "2026-07-14",
  },
  {
    id: "f-002",
    category: "Zakat & Charity",
    question: "Can I use a calculator to estimate Zakat?",
    answer:
      "A calculator can help you estimate eligible wealth, nisab comparison, and a 2.5% figure on zakatable assets after debts. Final calculation for your situation should be reviewed with a qualified scholar, especially for gold, business inventory, and mixed assets.",
    scholar: "Alvasatiya Review Desk",
    date: "2026-06-30",
  },
  {
    id: "f-003",
    category: "Quran & Tajweed",
    question: "Is it necessary to learn Tajweed before memorizing?",
    answer:
      "Correct recitation is important. Many teachers combine memorization with Tajweed correction so that errors are not stored. A qualified teacher can advise the best sequence for the student.",
    scholar: "Alvasatiya Review Desk",
    date: "2026-06-02",
  },
  {
    id: "f-004",
    category: "Hajj & Umrah",
    question: "Where should I learn Hajj rulings before traveling?",
    answer:
      "Study a reliable educational overview, attend a preparation class if available, and consult a qualified scholar for matters where schools of jurisprudence differ. Our Hajj & Umrah page is for education and reminder, not a complete personal ruling.",
    scholar: "Alvasatiya Review Desk",
    date: "2026-05-19",
  },
];
