import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Truck, Clock, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site";
import { createBooking } from "@/lib/supabase-data";

export const Route = createFileRoute("/book-pickup")({
  head: () => ({
    meta: [
      { title: "Book a Linen Pickup - Free Collection | JZ Linen UK" },
      {
        name: "description",
        content:
          "Schedule a free linen and laundry pickup anywhere in the UK. One-off or recurring collection slots, 6 days a week.",
      },
      { property: "og:title", content: "Book a Free Linen Pickup - JZ Linen" },
      {
        property: "og:description",
        content: "Schedule a free, no-obligation collection in under a minute.",
      },
    ],
  }),
  component: BookPickup,
});

const schema = z.object({
  business: z.string().trim().min(2, "Business name required").max(120),
  contact: z.string().trim().min(2, "Name required").max(80),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Phone required").max(20),
  postcode: z.string().trim().min(5, "Valid UK postcode").max(10),
  address: z.string().trim().min(5).max(255),
  service: z.string().min(1, "Choose a service"),
  date: z.string().min(1, "Pick a date"),
  slot: z.string().min(1, "Pick a time slot"),
  notes: z.string().max(600).optional(),
});

function BookPickup() {
  const [submitting, setSubmitting] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <PageHero
        eyebrow="Pickup"
        title="Book a free linen pickup."
        sub="Tell us when and where - we'll collect, process and return your linen, no fuss."
      />
      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <form
            className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-10"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);

              const form = e.currentTarget;
              const fd = new FormData(form);
              const r = schema.safeParse(Object.fromEntries(fd));

              if (!r.success) {
                toast.error(r.error.issues[0].message);
                setSubmitting(false);
                return;
              }

              try {
                await createBooking(r.data);
                toast.success("Pickup request sent. Our team will be in touch shortly.");
                form.reset();
              } catch (err) {
                console.error(err);
                const message =
                  err instanceof Error ? err.message : "Could not submit your booking.";
                toast.error(message);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <h2 className="font-display text-2xl font-bold">Pickup details</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field name="business" label="Business name" />
              <Field name="contact" label="Your name" />
              <Field name="email" label="Email" type="email" />
              <Field name="phone" label="Phone" type="tel" />
              <Field name="postcode" label="Postcode" />
              <Field name="address" label="Pickup address" />
              <SelectField
                name="service"
                label="Service type"
                options={[
                  "Hotel linen",
                  "Restaurant linen",
                  "Healthcare linen",
                  "Spa & salon",
                  "Workwear",
                  "Mixed / other",
                ]}
              />
              <Field name="date" label="Preferred date" type="date" min={today} />
              <SelectField
                name="slot"
                label="Time slot"
                options={[
                  "Morning (07:00-11:00)",
                  "Midday (11:00-14:00)",
                  "Afternoon (14:00-17:00)",
                  "Evening (17:00-20:00)",
                ]}
              />
            </div>
            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-medium">Notes (optional)</label>
              <textarea
                name="notes"
                maxLength={600}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Volume estimate, access info, recurring preference..."
              />
            </div>
            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="mt-6 w-full"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Confirm pickup request"}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              By submitting you agree to be contacted by JZ Linen regarding your request.
            </p>
          </form>
          <aside className="space-y-4">
            {[
              {
                icon: Truck,
                t: "Free pickup",
                d: "No charge for collection across Greater London and most UK regions.",
              },
              {
                icon: Clock,
                t: "24-hour turnaround",
                d: "Standard return next working day, express same-day available.",
              },
              {
                icon: ShieldCheck,
                t: "Fully insured",
                d: "All linen covered in transit and during processing.",
              },
              {
                icon: CheckCircle2,
                t: "No commitment",
                d: "Try us with a single pickup before any contract.",
              },
            ].map((b) => (
              <div key={b.t} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  <b.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 font-semibold">{b.t}</div>
                <p className="text-sm text-muted-foreground">{b.d}</p>
              </div>
            ))}
            <div className="rounded-xl border border-border bg-silver p-5 text-sm">
              Prefer to talk? Call{" "}
              <a className="font-semibold text-primary" href={`tel:${SITE.phone}`}>
                {SITE.phoneDisplay}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Field({
  name,
  label,
  type = "text",
  min,
}: {
  name: string;
  label: string;
  type?: string;
  min?: string;
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
        min={min}
        required
        maxLength={255}
        className="h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function SelectField({ name, label, options }: { name: string; label: string; options: string[] }) {
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
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
