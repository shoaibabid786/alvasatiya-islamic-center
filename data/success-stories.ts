import { SITE } from "@/data/site";

export type SuccessStory = {
  title: string;
  spentOn: string;
  text: string;
  image: string;
  videoUrl: string;
};

const VIDEO = SITE.social.youtube;

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    title: "Quran education",
    spentOn: "Hifz and Tajweed classes",
    text: "Donations help keep Quran classes open for children who come to learn recitation and memorization with qualified teachers.",
    image: "/images/hero/quran.png",
    videoUrl: VIDEO,
  },
  {
    title: "Student meals",
    spentOn: "Food for boarding students",
    text: "Your giving helps provide meals for eligible students who stay at the campus to study, so hunger does not interrupt their learning.",
    image: "/images/hero/education.png",
    videoUrl: VIDEO,
  },
  {
    title: "Orphan care",
    spentOn: "Education and daily support",
    text: "Funds are used to support orphaned children with schooling, Quran learning, and practical care arranged by the Center.",
    image: "/images/hero/service.png",
    videoUrl: VIDEO,
  },
  {
    title: "Family assistance",
    spentOn: "Food packages and welfare",
    text: "Sadaqah and general donations help prepare food packages and quiet support for families facing hardship.",
    image: "/images/courses/photo-06.jpg",
    videoUrl: VIDEO,
  },
  {
    title: "Student housing",
    spentOn: "Accommodation for travelers",
    text: "Where the office approves it, donations help house students who travel from other towns to study at Jamia Umme Ashraf Jamal.",
    image: "/images/hero/alvasatiya.png",
    videoUrl: VIDEO,
  },
  {
    title: "Books and classrooms",
    spentOn: "Learning materials",
    text: "Contributions buy mushafs, notebooks, and classroom resources so that lack of supplies does not close the door of knowledge.",
    image: "/images/courses/photo-14.jpg",
    videoUrl: VIDEO,
  },
];
