import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ArrowRight } from "lucide-react";
import g1 from "@/assets/gallery-towels.jpg";
import g2 from "@/assets/gallery-restaurant.jpg";
import g3 from "@/assets/gallery-spa.jpg";
import g4 from "@/assets/gallery-facility.jpg";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/blog")({
  head: () => {
    const blogSchema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: `${SITE.name} Blog`,
      url: `${SITE.domain}/blog`,
      blogPost: POSTS.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        datePublished: p.date,
        author: { "@type": "Organization", name: SITE.name },
        url: `${SITE.domain}/blog`,
        image: `${SITE.domain}${p.img}`,
      })),
    };
    return {
      meta: [
        { title: "Blog — Linen & Laundry Insights | JZ Linen UK" },
        {
          name: "description",
          content:
            "Operational tips, hospitality industry insights and sustainability updates from the JZ Linen & Laundry team.",
        },
        { property: "og:title", content: "Blog — JZ Linen & Laundry" },
        { property: "og:description", content: "Linen, laundry and hospitality insights." },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(blogSchema) }],
    };
  },
  component: Blog,
});

const POSTS = [
  {
    slug: "1",
    title: "How hotels can cut linen costs by 30% without compromising quality",
    excerpt:
      "The four-point audit we run on every new hotel client — and the surprising findings that come back every time.",
    date: "2026-04-12",
    img: g1,
    category: "Hotels",
  },
  {
    slug: "2",
    title: "Restaurant linen: the hidden costs of in-house laundry",
    excerpt:
      "Equipment, labour, downtime and consistency — the real maths behind outsourcing your tablecloth and napkin service.",
    date: "2026-03-28",
    img: g2,
    category: "Restaurants",
  },
  {
    slug: "3",
    title: "Eco linen: what 'sustainable laundry' actually means",
    excerpt:
      "Beyond the buzzwords — what to look for in a genuinely environmentally responsible commercial laundry partner.",
    date: "2026-03-10",
    img: g3,
    category: "Sustainability",
  },
  {
    slug: "4",
    title: "Behind the scenes: a day inside our 35,000 sq ft facility",
    excerpt:
      "From 6am collections to overnight finishing — the journey of one bed sheet through the JZ process.",
    date: "2026-02-21",
    img: g4,
    category: "Inside JZ",
  },
];

function Blog() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Insights from the laundry floor."
        sub="Practical guidance for hospitality and healthcare operators on linen, hygiene and operations."
      />
      <section className="container-page py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {POSTS.map((p) => (
            <article
              key={p.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-primary">
                    {p.category}
                  </span>
                  <time>
                    {new Date(p.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <h2 className="mt-3 font-display text-xl font-bold leading-snug">{p.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
                <Link
                  to="/blog"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
                >
                  Read article{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
