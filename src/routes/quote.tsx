import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Request a Free Quote — Commercial Laundry | JZ Linen UK" },
      {
        name: "description",
        content:
          "Get a fast, no-obligation quote for commercial linen rental and laundry services. Response within 2 hours during business hours.",
      },
      { property: "og:title", content: "Request a Quote — JZ Linen & Laundry" },
      { property: "og:description", content: "Free, no-obligation quote in under 2 hours." },
    ],
  }),
  component: Quote,
});

const schema = z.object({
  business: z.string().trim().min(2).max(120),
  industry: z.string().min(1, "Choose an industry"),
  contact: z.string().trim().min(2).max(80),
  role: z.string().trim().max(80).optional(),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7).max(20),
  city: z.string().trim().min(2).max(80),
  rooms: z.string().trim().max(20).optional(),
  volume: z.string().min(1, "Estimate volume"),
  frequency: z.string().min(1, "Choose frequency"),
  details: z.string().trim().max(1000).optional(),
});

function Quote() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <PageHero
        eyebrow="Quote"
        title="Get a tailored quote in under 2 hours."
        sub="Tell us about your venue and linen needs — we'll send a transparent, itemised quote to your inbox today."
      />
      <section className="container-page py-16">
        <form
          className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-card md:p-10"
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            const data = Object.fromEntries(new FormData(e.currentTarget));
            const r = schema.safeParse(data);
            if (!r.success) {
              toast.error(r.error.issues[0].message);
              setLoading(false);
              return;
            }
            setTimeout(() => {
              toast.success("Quote request sent! We'll be in touch within 2 hours.");
              (e.target as HTMLFormElement).reset();
              setLoading(false);
            }, 700);
          }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" /> Free · No obligation
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold">Tell us about your business</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Input name="business" label="Business name" />
            <Select
              name="industry"
              label="Industry"
              options={[
                "Hotel",
                "Restaurant",
                "Healthcare",
                "Spa / Salon",
                "Care home",
                "Other hospitality",
                "Workwear / corporate",
              ]}
            />
            <Input name="contact" label="Your name" />
            <Input name="role" label="Role (optional)" required={false} />
            <Input name="email" label="Work email" type="email" />
            <Input name="phone" label="Phone" type="tel" />
            <Input name="city" label="City / area" />
            <Input name="rooms" label="Rooms / covers (if applicable)" required={false} />
            <Select
              name="volume"
              label="Estimated weekly volume"
              options={["Under 100kg", "100–500kg", "500kg–1 ton", "1–3 tons", "3+ tons"]}
            />
            <Select
              name="frequency"
              label="Service frequency"
              options={["Daily", "Weekly", "Twice weekly", "On-demand", "Not sure"]}
            />
          </div>
          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-medium">
              Additional details (optional)
            </label>
            <textarea
              name="details"
              maxLength={1000}
              rows={5}
              placeholder="Specific items, current supplier issues, branding requirements…"
              className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button type="submit" variant="hero" size="xl" className="mt-6 w-full" disabled={loading}>
            {loading ? "Sending…" : "Send my quote request"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Or call us directly:{" "}
            <a className="font-semibold text-primary" href={`tel:${SITE.phone}`}>
              {SITE.phoneDisplay}
            </a>
          </p>
        </form>
      </section>
    </>
  );
}

function Input({
  name,
  label,
  type = "text",
  required = true,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={255}
        className="h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
function Select({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <select
        id={name}
        name={name}
        required
        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
