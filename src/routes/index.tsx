import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Truck,
  ShieldCheck,
  Leaf,
  Clock,
  Award,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import heroImg from "@/assets/hero-laundry.jpg";
import gFacility from "@/assets/gallery-facility.jpg";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JZ Linen & Laundry — Commercial Laundry & Linen Supply UK" },
      {
        name: "description",
        content:
          "Premium commercial linen rental & laundry processing for hotels, restaurants, healthcare and spas. Free pickup, 24hr turnaround, eco-certified across the UK.",
      },
      {
        property: "og:title",
        content: "JZ Linen & Laundry — Commercial Laundry & Linen Supply UK",
      },
      {
        property: "og:description",
        content:
          "Premium commercial linen rental & laundry processing — free pickup, 24hr turnaround.",
      },
      { property: "og:image", content: `${SITE.domain}/og-home.jpg` },
    ],
  }),
  component: HomePage,
});

const SERVICES = [
  {
    icon: "🏨",
    title: "Hotel Linen",
    desc: "Sheets, duvets, pillowcases & towels — finished to 5-star standard.",
    to: "/services/hotel-linen",
  },
  {
    icon: "🍽️",
    title: "Restaurant Linen",
    desc: "Tablecloths, napkins, chef whites & aprons. Daily rotations available.",
    to: "/services/restaurant-linen",
  },
  {
    icon: "🏥",
    title: "Healthcare Linen",
    desc: "Thermo-disinfected bedding, scrubs & gowns to NHS-grade standards.",
    to: "/services/healthcare-linen",
  },
  {
    icon: "🧖",
    title: "Spa & Salon Towels",
    desc: "Plush rolled towels, robes & sheets — soft, fragrant, immaculate.",
    to: "/services/spa-towels",
  },
  {
    icon: "👷",
    title: "Workwear & Uniforms",
    desc: "Industrial workwear cleaning with repairs and barcode tracking.",
    to: "/services/workwear",
  },
  {
    icon: "🚚",
    title: "Free Pickup & Delivery",
    desc: "Scheduled collection routes 6 days a week across Greater London & UK.",
    to: "/services",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Request a quote",
    desc: "Tell us your volume, items and frequency. We respond within 2 hours.",
  },
  {
    n: "02",
    title: "Schedule pickup",
    desc: "Choose a recurring or one-off collection slot that fits your operation.",
  },
  {
    n: "03",
    title: "We process & deliver",
    desc: "Wash, dry, press, pack and deliver back — clean, sorted, on time.",
  },
];

const REASONS = [
  {
    icon: ShieldCheck,
    title: "TSA & ISO 9001 Certified",
    desc: "Audited hygiene and quality management at every stage.",
  },
  {
    icon: Clock,
    title: "24-Hour Turnaround",
    desc: "Standard same-day or next-day return on most contracts.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Process",
    desc: "98% water recycled · biodegradable detergents · low-emission fleet.",
  },
  {
    icon: Truck,
    title: "Free Logistics",
    desc: "Pickup and delivery included on all rental contracts.",
  },
  {
    icon: Award,
    title: "16+ Years Experience",
    desc: "Trusted by 400+ UK hospitality, healthcare and corporate clients.",
  },
  {
    icon: Sparkles,
    title: "Hotel-Grade Finish",
    desc: "Calendared, hand-folded and packed to your brand spec.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Whitmore",
    role: "GM, The Kingsbridge Hotel",
    quote:
      "JZ Linen transformed our housekeeping operation. Quality is consistently impeccable and the team are genuinely a pleasure to deal with.",
    rating: 5,
  },
  {
    name: "Marco Bianchi",
    role: "Owner, Trattoria 32",
    quote:
      "Reliable daily deliveries, beautifully pressed linens and zero hassle. They've never missed a service in 3 years.",
    rating: 5,
  },
  {
    name: "Dr. Emily Chen",
    role: "Clinic Director, Harley Aesthetics",
    quote:
      "Hospital-grade hygiene with a luxury finish. Exactly what our spa clients expect when they come through the door.",
    rating: 5,
  },
  {
    name: "James O'Connor",
    role: "Operations, Riverside Bistro Group",
    quote:
      "Switching to JZ saved us nearly 30% on linen costs and freed up two storerooms. Wish we'd done it sooner.",
    rating: 5,
  },
];

const FAQ = [
  {
    q: "What's the minimum order or contract length?",
    a: "We work with venues of every size — from a 12-cover restaurant to 500-room hotel groups. Most rolling contracts are 12 months but we offer flexible monthly terms for new clients.",
  },
  {
    q: "How quickly can you turn linen around?",
    a: "Standard turnaround is 24 hours. Express same-day service is available within Greater London for an additional fee.",
  },
  {
    q: "Do you handle stained or damaged items?",
    a: "Yes — our reclaim process recovers over 92% of stained items. Items beyond repair are recycled responsibly and replaced from your rental stock at no charge.",
  },
  {
    q: "Are your processes environmentally certified?",
    a: "We are ISO 14001 certified, recycle 98% of process water, and operate a Euro-6 low-emission delivery fleet across the UK.",
  },
  {
    q: "Can I see real-time tracking of my linen?",
    a: "Yes. Every contract client gets access to our online portal with live volume reports, invoices, and barcode-tracked uniform inventories.",
  },
];

function HomePage() {
  return (
    <>
      <Hero />
      <Trustbar />
      <Services />
      <HowItWorks />
      <WhyChoose />
      <Stats />
      <Testimonials />
      <FAQSection />
      <Newsletter />
      <CTABanner />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero text-primary-foreground">
      <div className="absolute inset-0 opacity-30">
        <img
          src={heroImg}
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.18_0.06_255)]/95 via-[oklch(0.20_0.08_250)]/85 to-transparent" />
      </div>
      {/* Animated background layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
      >
        <div
          className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-[oklch(0.55_0.18_240)]/35 blur-3xl will-change-transform sm:h-[28rem] sm:w-[28rem]"
          style={{ animation: "blob 18s ease-in-out infinite", transform: "translateZ(0)" }}
        />
        <div
          className="absolute top-1/3 -right-32 hidden h-[32rem] w-[32rem] rounded-full bg-[oklch(0.70_0.16_220)]/25 blur-3xl will-change-transform md:block"
          style={{ animation: "blob 22s ease-in-out infinite reverse", transform: "translateZ(0)" }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          }}
        />
        {/* Floating bubbles — fewer, lighter */}
        {[
          { l: "15%", s: 12, d: 0, dur: 18 },
          { l: "45%", s: 16, d: 4, dur: 22 },
          { l: "78%", s: 10, d: 2, dur: 20 },
        ].map((b, i) => (
          <span
            key={i}
            className="absolute bottom-0 rounded-full bg-white/40 ring-1 ring-white/30 will-change-transform"
            style={{
              left: b.l,
              width: b.s,
              height: b.s,
              animation: `bubble-rise ${b.dur}s linear ${b.d}s infinite`,
              transform: "translateZ(0)",
            }}
          />
        ))}
      </div>
      <div className="container-page relative grid gap-10 py-20 lg:grid-cols-2 lg:gap-8 lg:py-32">
        <div className="animate-[fade-up_0.8s_ease-out]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> UK's Trusted Linen Partner Since 2008
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Pristine Linen.
            <br />
            <span className="bg-gradient-to-r from-white via-[oklch(0.92_0.05_230)] to-[oklch(0.85_0.08_230)] bg-clip-text text-transparent">
              Effortlessly Delivered.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            Premium commercial laundry, linen rental and uniform care for hotels, restaurants,
            healthcare and spas — with free pickup, 24-hour turnaround and a finish your guests
            notice.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/quote">
                Request Free Quote <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outlineHero" size="xl">
              <Link to="/book-pickup">Book a Pickup</Link>
            </Button>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm text-white/85 sm:grid-cols-3">
            {["Free pickup & delivery", "24-hour turnaround", "No hidden fees"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.85_0.15_160)]" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative hidden lg:block">
          <div className="absolute -top-6 -right-6 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl" />
          <div className="relative animate-[float_6s_ease-in-out_infinite] overflow-hidden rounded-2xl border border-white/10 shadow-elegant">
            <img
              src={gFacility}
              alt="Modern industrial laundry facility"
              width={800}
              height={900}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-full border-2 border-white bg-gradient-to-br from-[oklch(0.7_0.12_240)] to-[oklch(0.5_0.15_250)]"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold">400+ UK businesses</div>
                <div className="flex items-center gap-1 text-xs text-white/75">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3 w-3 fill-current text-[oklch(0.82_0.18_85)]" />
                  ))}
                  <span className="ml-1">4.9 / 5 average rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Trustbar() {
  return (
    <div className="border-y border-border bg-silver">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-12 gap-y-3 py-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {[
          "TSA Certified",
          "ISO 9001",
          "ISO 14001",
          "NHS Approved",
          "BICSc Member",
          "Sedex Audited",
        ].map((b) => (
          <span key={b}>{b}</span>
        ))}
      </div>
    </div>
  );
}

function Services() {
  return (
    <section className="container-page py-20 lg:py-28">
      <SectionHead
        eyebrow="What we do"
        title="Linen & laundry services tailored to your business"
        sub="From single-site restaurants to nationwide hotel groups — we provide a complete textile service that scales with you."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <Link
            key={s.title}
            to={s.to}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-primary/10 to-primary-glow/5 transition-transform group-hover:scale-150" />
            <div className="relative">
              <div className="text-4xl">{s.icon}</div>
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Learn more{" "}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-silver py-20 lg:py-28">
      <div className="container-page">
        <SectionHead
          eyebrow="How it works"
          title="Simple, scheduled, stress-free"
          sub="Get your linen handled end-to-end in three steps."
        />
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="relative rounded-2xl border border-border bg-card p-8 shadow-card"
            >
              <div className="font-display text-6xl font-bold text-gradient">{s.n}</div>
              <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              {i < STEPS.length - 1 && (
                <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 text-border md:block">
                  <ArrowRight className="h-7 w-7" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChoose() {
  return (
    <section className="container-page py-20 lg:py-28">
      <SectionHead
        eyebrow="Why choose JZ"
        title="The standards your guests expect — every single time"
        sub="We combine industrial-scale capability with the quality control of a boutique laundry."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {REASONS.map((r) => (
          <div
            key={r.title}
            className="rounded-2xl border border-border bg-card p-7 transition-all hover:border-primary/40 hover:shadow-card"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-card">
              <r.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: "400+", k: "UK clients served" },
    { v: "16 yrs", k: "Industry experience" },
    { v: "98%", k: "Process water recycled" },
    { v: "24 hr", k: "Standard turnaround" },
  ];
  return (
    <section className="bg-hero py-16 text-primary-foreground">
      <div className="container-page grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.k} className="text-center">
            <div className="font-display text-5xl font-bold tracking-tight lg:text-6xl">{s.v}</div>
            <div className="mt-2 text-sm uppercase tracking-widest text-white/70">{s.k}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  return (
    <section className="container-page py-20 lg:py-28">
      <SectionHead eyebrow="Testimonials" title="Trusted by Britain's best operators" />
      <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-border bg-card p-10 shadow-elegant md:p-14">
        <div className="flex gap-1 text-[oklch(0.78_0.18_85)]">
          {Array.from({ length: t.rating }).map((_, k) => (
            <Star key={k} className="h-5 w-5 fill-current" />
          ))}
        </div>
        <blockquote className="mt-5 font-display text-2xl leading-snug text-foreground md:text-3xl">
          “{t.quote}”
        </blockquote>
        <div className="mt-6 flex items-center justify-between">
          <div>
            <div className="font-semibold">{t.name}</div>
            <div className="text-sm text-muted-foreground">{t.role}</div>
          </div>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Testimonial ${k + 1}`}
                className={`h-2 rounded-full transition-all ${k === i ? "w-8 bg-primary" : "w-2 bg-border"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="bg-silver py-20 lg:py-28">
      <div className="container-page max-w-4xl">
        <SectionHead eyebrow="FAQ" title="Questions, answered" />
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {FAQ.map((f, i) => (
            <AccordionItem
              key={i}
              value={`q${i}`}
              className="overflow-hidden rounded-xl border border-border bg-card px-5 shadow-card"
            >
              <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
});

function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="container-page py-20">
      <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-secondary p-8 shadow-card md:p-14">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-display text-3xl font-bold md:text-4xl">
              Operational tips, straight to your inbox
            </h3>
            <p className="mt-3 text-muted-foreground">
              Monthly insights on linen management, hospitality trends and exclusive client offers.
              No spam — unsubscribe anytime.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const r = newsletterSchema.safeParse({ email });
              if (!r.success) return toast.error(r.error.issues[0].message);
              toast.success("Thanks! You're on the list.");
              setEmail("");
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.co.uk"
              maxLength={255}
              className="h-12 flex-1 rounded-md border border-input bg-background px-4 text-sm outline-none ring-ring focus:ring-2"
            />
            <Button type="submit" variant="hero" size="lg">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="container-page pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-hero p-10 text-primary-foreground shadow-elegant md:p-16">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl" />
        <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Ready to upgrade your linen service?
            </h2>
            <p className="mt-3 max-w-xl text-white/80">
              Get a free, no-obligation quote in under 2 hours. We'll match you with the right
              contract for your venue.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/quote">Get Quote</Link>
            </Button>
            <Button asChild variant="outlineHero" size="xl">
              <Link to="/contact">Talk to us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">{eyebrow}</span>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
    </div>
  );
}
