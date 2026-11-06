import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Award, Leaf, Users, Target } from "lucide-react";
import { SITE } from "@/lib/site";
import facility from "@/assets/gallery-facility.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About JZ Linen & Laundry — UK Commercial Linen Experts" },
      { name: "description", content: "Family-founded in 2023, JZ Linen is the UK's premium commercial linen rental and laundry partner — serving 400+ hotels, restaurants, clinics and spas." },
      { property: "og:title", content: "About JZ Linen & Laundry" },
      { property: "og:description", content: "3+ years delivering hotel-grade linen services across the UK." },
      { property: "og:image", content: `${SITE.domain}/og-about.jpg` },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Award, title: "Quality without compromise", desc: "Every load inspected. Every fold deliberate. The standard never moves." },
  { icon: Leaf, title: "Genuine sustainability", desc: "98% water reclaimed, biodegradable chemistry, low-emission UK fleet." },
  { icon: Users, title: "Real partnerships", desc: "Dedicated account managers — not call centres. We know your operation by name." },
  { icon: Target, title: "Operational obsession", desc: "On-time delivery is non-negotiable. We measure ourselves on yours." },
];

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="Three years of getting linen exactly right." sub="Founded in East London in 2023, JZ Linen & Laundry has grown from a single van and 200 sq ft to a 4,000 sq ft processing facility serving over 1 venue across the UK." />
      <section className="container-page py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <img src={facility} alt="Inside the JZ Linen processing facility" loading="lazy" width={1024} height={1024} className="rounded-2xl shadow-elegant" />
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Our story</span>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">Built by hospitality people, for hospitality people.</h2>
            <div className="mt-5 space-y-4 text-muted-foreground">
             
            </div>
          </div>
        </div>
      </section>
      <section className="bg-silver py-20">
        <div className="container-page">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">What we stand for</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-7 text-center shadow-card">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  <v.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
