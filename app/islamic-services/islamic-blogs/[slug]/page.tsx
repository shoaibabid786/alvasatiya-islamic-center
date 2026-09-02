import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/layout/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { blogs, getBlog } from "@/data/blogs";
import { pageMeta } from "@/lib/seo";
import { articleSchema } from "@/lib/schema";

export function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/islamic-services/islamic-blogs/[slug]">) {
  const { slug } = await params;
  const post = getBlog(slug);
  if (!post) return pageMeta("Article", "Islamic article from Alvasatiya Islamic Center", "/islamic-services/islamic-blogs");
  return pageMeta(post.title, post.excerpt, `/islamic-services/islamic-blogs/${post.slug}`, {
    ogType: "article",
    publishedTime: post.date,
  });
}

export default async function Page({ params }: PageProps<"/islamic-services/islamic-blogs/[slug]">) {
  const { slug } = await params;
  const post = getBlog(slug);
  if (!post) notFound();
  const related = blogs.filter((b) => b.slug !== post.slug && b.category === post.category).slice(0, 3);
  return (
    <>
      <JsonLd data={articleSchema(post)} />
      <PageHero eyebrow={post.category} title={post.title} description={`${post.author} · ${post.date} · ${post.minutes} min read`} />
      <article className="section-container py-12 max-w-3xl prose-islamic">
        {post.content.map((p) => <p key={p} className="mb-5">{p}</p>)}
        <h2>Related articles</h2>
        <ul>
          {related.map((r) => (
            <li key={r.slug}><Link href={`/islamic-services/islamic-blogs/${r.slug}`}>{r.title}</Link></li>
          ))}
        </ul>
      </article>
    </>
  );
}
