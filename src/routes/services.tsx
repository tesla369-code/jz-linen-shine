import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ChevronRight } from "lucide-react";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services — Commercial Laundry & Linen Rental | JZ Linen" },
      { name: "description", content: "Full-service commercial linen rental, laundry processing & uniform care for hotels, restaurants, healthcare and spas across the UK." },
      { property: "og:title", content: "Our Services — JZ Linen & Laundry" },
      { property: "og:description", content: "Hotel, restaurant, healthcare, spa and workwear laundry — done properly." },
      { property: "og:image", content: `${SITE.domain}/og-services.jpg` },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  { slug: "hotel-linen", title: "Hotel Linen Service", icon: "🏨", desc: "Sheets, duvet covers, pillowcases, bath towels, bath sheets, robes and pool towels — finished to luxury hotel standards." },
  { slug: "restaurant-linen", title: "Restaurant & Hospitality Linen", icon: "🍽️", desc: "Tablecloths, napkins, glass cloths, chef whites, tea towels and aprons. Daily rotations and stain reclaim included." },
  { slug: "healthcare-linen", title: "Healthcare & Clinic Linen", icon: "🏥", desc: "Thermo-disinfected sheets, blankets, gowns, scrubs and theatre wear processed to EN 14065 standards." },
  { slug: "spa-towels", title: "Spa & Salon Linen", icon: "🧖", desc: "Plush rolled hand towels, bath sheets, robes, slippers and treatment bed linen — soft, fresh, immaculate every day." },
  { slug: "workwear", title: "Workwear & Uniform Care", icon: "👷", desc: "Industrial workwear, hi-vis, kitchen whites and corporate uniforms with barcode tracking and on-site repairs." },
];

function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title="A complete linen service for every kind of venue." sub="From single-site bistros to national hotel groups — explore the textile services we deliver six days a week." />
      <section className="container-page py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {SERVICES.map((s) => (
            <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }}
              className="group flex items-start gap-6 rounded-2xl border border-border bg-card p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
              <div className="text-5xl">{s.icon}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{s.title}</h2>
                <p className="mt-2 text-muted-foreground">{s.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Service details <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
