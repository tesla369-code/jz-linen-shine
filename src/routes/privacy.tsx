import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — JZ Linen & Laundry" },
      {
        name: "description",
        content:
          "How JZ Linen & Laundry collects, uses and protects your personal data — UK GDPR compliant.",
      },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" sub="Last updated 1 January 2026." />
      <section className="container-page py-16">
        <article className="prose mx-auto max-w-3xl text-foreground [&_h2]:font-display [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_p]:mt-3 [&_p]:text-muted-foreground [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-muted-foreground">
          <p>
            JZ Linen & Laundry Ltd ("we", "us", "our") is committed to protecting your privacy and
            personal data. This policy explains what we collect, why and how we use it.
          </p>
          <h2>Information we collect</h2>
          <p>
            Contact details (name, business, email, phone, address), service preferences,
            communication records, and pickup/delivery information.
          </p>
          <h2>How we use your information</h2>
          <ul>
            <li>To provide and improve our laundry and linen services</li>
            <li>To respond to enquiries, quotes and pickup requests</li>
            <li>To send service-related communications and invoices</li>
            <li>To comply with legal and regulatory obligations</li>
          </ul>
          <h2>Lawful basis</h2>
          <p>
            We rely on contract performance, legitimate interests and your consent (where required)
            under UK GDPR.
          </p>
          <h2>Data sharing</h2>
          <p>
            We never sell your data. We share only with payment processors, logistics partners and
            IT providers under written agreements.
          </p>
          <h2>Your rights</h2>
          <p>
            You have the right to access, correct, delete or restrict use of your data. Contact{" "}
            <a className="text-primary underline" href="mailto:hello@jzlinen.co.uk">
              hello@jzlinen.co.uk
            </a>
            .
          </p>
          <h2>Cookies</h2>
          <p>
            We use essential cookies to operate the site and analytics cookies (with consent) to
            improve performance.
          </p>
          <h2>Contact</h2>
          <p>JZ Linen & Laundry Ltd, Unit 14 Riverside Industrial Estate, London E16 2QT.</p>
        </article>
      </section>
    </>
  );
}
