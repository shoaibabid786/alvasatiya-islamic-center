import PageHero from "@/components/layout/PageHero";
import BooksLibrary from "@/components/interactive/BooksLibrary";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Islamic Books Library | Quran, Hadith, Fiqh and Seerah Titles",
  "Search Alvasatiya's digital Islamic library by category, author and title, including Quran, Hadith, Fiqh, Seerah and educational books.",
  "/islamic-services/books-library"
);

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Islamic Services" title="Books Library" description="A digital catalog of Quran, Hadith, Fiqh, Seerah, and educational titles." />
      <section className="section-container py-12"><BooksLibrary /></section>
    </>
  );
}
