import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import gTowels from "@/assets/gallery-towels.jpg";
import gRestaurant from "@/assets/gallery-restaurant.jpg";
import gMedical from "@/assets/gallery-medical.jpg";
import gSpa from "@/assets/gallery-spa.jpg";
import gPickup from "@/assets/gallery-pickup.jpg";

const DATA: Record<
  string,
  { title: string; lead: string; image: string; bullets: string[]; suited: string[] }
> = {
  "hotel-linen": {
    title: "Hotel Linen Service",
    lead: "Five-star presentation, six days a week. From boutique B&Bs to 500-room flagships.",
    image: gTowels,
    bullets: [
      "100% Egyptian cotton & poly-cotton ranges",
      "Thermal disinfection at 71°C+",
      "Hand-finished folds & branded packing",
      "Loss & damage cover included",
      "Dedicated stock pool per property",
      "Online linen usage reporting",
    ],
    suited: [
      "Independent boutique hotels",
      "Branded chain properties",
      "Serviced apartments & Airbnb operators",
      "Conference & wedding venues",
    ],
  },
  "restaurant-linen": {
    title: "Restaurant & Hospitality Linen",
    lead: "Crisp tablecloths, fresh napkins and pristine chef whites — delivered before service.",
    image: gRestaurant,
    bullets: [
      "Daily, weekly or on-demand rotation",
      "Premium 100% cotton & easycare poly ranges",
      "Custom sizing for round, square & long tables",
      "Stain reclaim built in — no extra cost",
      "Chef whites, aprons & glass cloths",
      "Same-day express in Greater London",
    ],
    suited: [
      "Fine-dining restaurants",
      "Brasseries & gastropubs",
      "Catering companies",
      "Event & banqueting venues",
    ],
  },
  "healthcare-linen": {
    title: "Healthcare & Clinic Linen",
    lead: "Hospital-grade hygiene with documented audit trails to EN 14065 RABC.",
    image: gMedical,
    bullets: [
      "Thermo-disinfected to NHS standards",
      "Barcode-tracked scrubs & theatre wear",
      "Closed-loop infection-control packaging",
      "Patient gowns, bedding, blankets & curtains",
      "Weekly volume & compliance reporting",
      "Emergency response within 4 hours",
    ],
    suited: [
      "Private clinics & day surgeries",
      "Aesthetic & dermatology practices",
      "Care homes & nursing facilities",
      "Dental & veterinary practices",
    ],
  },
  "spa-towels": {
    title: "Spa & Salon Linen",
    lead: "The soft, fragrant finish your treatment rooms deserve.",
    image: gSpa,
    bullets: [
      "Premium 600gsm rolled towels",
      "Hypoallergenic detergents & oils removed",
      "Robes, slippers, sheets & headbands",
      "Daily rotation pricing",
      "Custom embroidery available",
      "Eco-certified processing",
    ],
    suited: [
      "Day spas & wellness clinics",
      "Hair & beauty salons",
      "Hotel spas",
      "Aesthetic & laser clinics",
    ],
  },
  workwear: {
    title: "Workwear & Uniform Care",
    lead: "Industrial workwear and corporate uniforms, tracked, repaired and returned.",
    image: gPickup,
    bullets: [
      "Per-garment barcode tracking",
      "On-site repairs & replacements",
      "Hi-vis, FR & welding workwear",
      "Corporate & branded uniforms",
      "Lockers & locker management available",
      "Online wearer portal",
    ],
    suited: [
      "Manufacturing & engineering",
      "Logistics & warehousing",
      "Construction & utilities",
      "Corporate & front-of-house teams",
    ],
  },
};

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const item = DATA[params.slug];
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.item.title} — JZ Linen & Laundry UK` },
            { name: "description", content: loaderData.item.lead },
            { property: "og:title", content: loaderData.item.title },
            { property: "og:description", content: loaderData.item.lead },
            { property: "og:image", content: `${SITE.domain}${loaderData.item.image}` },
          ],
        }
      : { meta: [{ title: "Service — JZ Linen" }] },
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-4xl font-bold">Service not found</h1>
      <Link to="/services" className="mt-4 inline-block text-primary underline">
        Back to services
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { item } = Route.useLoaderData();
  return (
    <>
      <PageHero eyebrow="Service" title={item.title} sub={item.lead} />
      <section className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            width={1024}
            height={1024}
            className="rounded-2xl shadow-elegant"
          />
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">What's included</h2>
            <ul className="mt-6 space-y-3">
              {item.bullets.map((b: string) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <h3 className="mt-10 font-display text-xl font-bold">Best suited for</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.suited.map((s: string) => (
                <span
                  key={s}
                  className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/quote">
                  Get a quote <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="silver" size="lg">
                <Link to="/book-pickup">Book pickup</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
