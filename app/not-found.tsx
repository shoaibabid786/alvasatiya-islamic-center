import Link from "next/link";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="section-container py-24 text-center">
      <h1 className="section-title">Page not found</h1>
      <p className="section-desc mx-auto mt-4">This path is not part of the Alvasatiya website yet.</p>
      <Link href="/" className="btn btn-gold mt-8">Return home</Link>
    </section>
  );
}
