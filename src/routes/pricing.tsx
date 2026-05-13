import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Transparent Linen & Laundry Rates | JZ Linen UK" },
      {
        name: "description",
        content:
          "Transparent commercial linen rental and laundry pricing per item or per kilo. No hidden fees, free pickup included on contract plans.",
      },
      { property: "og:title", content: "Pricing — JZ Linen & Laundry" },
      {
        property: "og:description",
        content: "Transparent linen rental and laundry rates with free pickup.",
      },
    ],
  }),
  component: Pricing,
});

const PLANS = [
  {
    name: "Pay as you go",
    price: "£3.20",
    unit: "/ kilo",
    desc: "Flexible, no contract — perfect for one-off events or trial runs.",
    features: [
      "Free pickup over 25kg",
      "48-hour turnaround",
      "Standard wash & press",
      "Pay per collection",
      "No minimum term",
    ],
    cta: "Book a pickup",
    to: "/book-pickup",
    highlight: false,
  },
  {
    name: "Business contract",
    price: "£2.40",
    unit: "/ kilo",
    desc: "Our most popular plan for venues with weekly or daily linen needs.",
    features: [
      "Free scheduled pickup & delivery",
      "24-hour turnaround",
      "Stain reclaim included",
      "Dedicated account manager",
      "Online portal & reporting",
      "12-month rolling contract",
    ],
    cta: "Get a quote",
    to: "/quote",
    highlight: true,
  },
  {
    name: "Linen rental",
    price: "From £0.42",
    unit: "/ item",
    desc: "Full rental — we own, replace and process the linen for you.",
    features: [
      "Linen stock provided & maintained",
      "Loss & damage cover included",
      "Daily or weekly rotations",
      "Free pickup & delivery",
      "Custom branding available",
      "Volume reporting & invoicing",
    ],
    cta: "Talk to sales",
    to: "/contact",
    highlight: false,
  },
];

const TABLE = [
  ["Bath towel (large)", "£0.85", "£0.62"],
  ["Hand towel", "£0.45", "£0.32"],
  ["Single bed sheet", "£1.10", "£0.78"],
  ["King duvet cover", "£2.40", "£1.85"],
  ["Pillowcase", "£0.40", "£0.28"],
  ["Tablecloth (round, large)", "£3.20", "£2.40"],
  ["Napkin", "£0.32", "£0.22"],
  ["Chef jacket", "£1.85", "£1.35"],
  ["Apron", "£0.95", "£0.65"],
  ["Spa robe", "£3.10", "£2.30"],
];

function Pricing() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Honest, transparent pricing."
        sub="Three simple ways to work with us — choose what fits your operation. All prices exclude VAT."
      />
      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl border p-8 shadow-card ${p.highlight ? "border-primary bg-card shadow-elegant ring-1 ring-primary" : "border-border bg-card"}`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-primary-glow px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                  Most popular
                </div>
              )}
              <h3 className="font-display text-2xl font-bold">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-gradient">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.unit}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant={p.highlight ? "hero" : "silver"} size="lg" className="mt-6">
                <Link to={p.to}>{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-silver py-16">
        <div className="container-page">
          <h2 className="text-center font-display text-3xl font-bold">Per-item rate card</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Indicative pricing for individual items. Volume discounts available on rental contracts.
          </p>
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Item</th>
                  <th className="px-6 py-4 text-right font-semibold">Pay as you go</th>
                  <th className="px-6 py-4 text-right font-semibold">Contract</th>
                </tr>
              </thead>
              <tbody>
                {TABLE.map((row) => (
                  <tr key={row[0]} className="border-t border-border">
                    <td className="px-6 py-3.5">{row[0]}</td>
                    <td className="px-6 py-3.5 text-right text-muted-foreground">{row[1]}</td>
                    <td className="px-6 py-3.5 text-right font-semibold text-primary">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Prices ex-VAT. Need a custom rate card?{" "}
            <Link to="/quote" className="font-semibold text-primary underline">
              Request a quote
            </Link>{" "}
            — typical contracts deliver 18–32% savings vs PAYG.
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Questions? Call{" "}
            <a className="font-semibold text-primary" href={`tel:${SITE.phone}`}>
              {SITE.phoneDisplay}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
