import { Quote } from "lucide-react";
import { COURSE_TESTIMONIALS } from "@/data/testimonials";

export default function CourseTestimonials() {
  return (
    <section className="bg-[#fbfaf6] py-16 md:py-20" aria-labelledby="course-testimonials-heading">
      <div className="section-container">
        <p className="section-eyebrow">Testimonials</p>
        <h2 id="course-testimonials-heading" className="section-title">
          What Students and Families Say
        </h2>
        <div className="geometric-divider !mx-0" />
        <p className="section-desc mt-2">
          Voices from those who study Quran, Hadith, and the Islamic sciences with Alvasatiya teachers.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {COURSE_TESTIMONIALS.map((item) => (
            <article
              key={`${item.name}-${item.course}`}
              className="group flex h-full flex-col rounded-2xl border border-[#e8e4d8] bg-white p-6 shadow-[0_8px_24px_rgba(40,54,24,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#d4e09b] hover:shadow-[0_16px_36px_rgba(40,54,24,0.1)]"
            >
              <Quote className="h-7 w-7 text-gold/80" strokeWidth={1.4} aria-hidden />
              <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-green-deep/85">
                “{item.quote}”
              </p>
              <div className="mt-6 border-t border-[#eee8d8] pt-4">
                <p className="font-semibold text-green-deep">{item.name}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {item.role} · {item.course}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
