import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, MessageCircle, type LucideIcon } from "lucide-react";
import { SITE, waLink } from "@/lib/site";
import { createContactMessage } from "@/lib/supabase-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact JZ Linen & Laundry — Talk to Our UK Team" },
      {
        name: "description",
        content:
          "Get in touch with the JZ Linen team. Phone, email, WhatsApp or visit our East London facility. We respond within 2 hours.",
      },
      { property: "og:title", content: "Contact — JZ Linen & Laundry" },
      { property: "og:description", content: "Talk to our UK team — phone, email or WhatsApp." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name required").max(80),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10, "Tell us a little more").max(1000),
});

function Contact() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to a real human."
        sub="Phone, email, WhatsApp or pop into the facility — we'd love to help."
      />
      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5">
            <ContactCard
              icon={Phone}
              title="Call us"
              value={SITE.phoneDisplay}
              href={`tel:${SITE.phone}`}
              sub={SITE.hours}
            />
            <ContactCard
              icon={MessageCircle}
              title="WhatsApp"
              value="Chat now"
              href={waLink()}
              sub="Fastest response, usually within minutes"
            />
            <ContactCard
              icon={Mail}
              title="Email"
              value={SITE.email}
              href={`mailto:${SITE.email}`}
              sub="Reply within 2 working hours"
            />
            <ContactCard
              icon={MapPin}
              title="Visit us"
              value={`${SITE.address.street}, ${SITE.address.city} ${SITE.address.postcode}`}
              sub="Tours by appointment"
            />
            <ContactCard icon={Clock} title="Opening hours" value={SITE.hours} sub="" />
            <div className="overflow-hidden rounded-2xl border border-border shadow-card">
              <iframe
                title="JZ Linen location — Stanley House, Bramble Road, Swindon SN2 8ER"
                src="https://www.google.com/maps?q=Stanley+House,+Bramble+Road,+Swindon,+SN2+8ER,+England&output=embed"
                width="100%"
                height="280"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>
          <form
            className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-10"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const form = e.currentTarget;
              const data = Object.fromEntries(new FormData(form));
              const r = schema.safeParse(data);
              if (!r.success) {
                toast.error(r.error.issues[0].message);
                setLoading(false);
                return;
              }
              try {
                await createContactMessage(r.data);
                toast.success("Message sent! We'll be in touch shortly.");
                form.reset();
              } catch (err) {
                console.error(err);
                const message = err instanceof Error ? err.message : "Could not send your message.";
                toast.error(message);
              } finally {
                setLoading(false);
              }
            }}
          >
            <h2 className="font-display text-2xl font-bold">Send us a message</h2>
            <div className="mt-6 grid gap-5">
              <Inp name="name" label="Your name" />
              <div className="grid gap-5 md:grid-cols-2">
                <Inp name="email" label="Email" type="email" />
                <Inp name="phone" label="Phone (optional)" type="tel" required={false} />
              </div>
              <Inp name="subject" label="Subject" />
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  maxLength={1000}
                  rows={6}
                  className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button type="submit" variant="hero" size="xl" disabled={loading}>
                {loading ? "Sending…" : "Send message"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

function Inp({
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

function ContactCard({
  icon: Icon,
  title,
  value,
  sub,
  href,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  sub?: string;
  href?: string;
}) {
  const Content = (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:border-primary/40">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
        <div className="mt-0.5 font-semibold">{value}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener"
      className="block"
    >
      {Content}
    </a>
  ) : (
    Content
  );
}
