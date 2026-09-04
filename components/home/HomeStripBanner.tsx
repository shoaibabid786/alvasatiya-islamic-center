export default function HomeStripBanner({ title }: { title: string }) {
  return (
    <aside className="home-strip-banner" aria-label={title}>
      <div className="section-container">
        <div className="flex items-center justify-center gap-4 md:gap-7">
          <span className="home-strip-banner-line hidden sm:block" aria-hidden="true" />
          <p className="home-strip-banner-title">{title}</p>
          <span className="home-strip-banner-line home-strip-banner-line-end hidden sm:block" aria-hidden="true" />
        </div>
      </div>
    </aside>
  );
}
