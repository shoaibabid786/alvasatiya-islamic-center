export default function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden islamic-pattern text-ivory py-12 md:py-16">
      <div className="absolute inset-x-0 top-0 gold-line" />
      <div className="section-container text-center">
        {eyebrow && <p className="section-eyebrow !text-gold-soft">{eyebrow}</p>}
        <h1 className="section-title !text-ivory">{title}</h1>
        <div className="geometric-divider" />
        {description && <p className="section-desc mx-auto text-ivory/80">{description}</p>}
      </div>
    </section>
  );
}
